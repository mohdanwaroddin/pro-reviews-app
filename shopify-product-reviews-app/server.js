import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import '@shopify/shopify-api/adapters/node';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';

dotenv.config();
const app = express();

/* -------------------- MIDDLEWARE -------------------- */
//const cors = require("cors");

// ✅ ALLOW SHOPIFY STOREFRONT
app.use(
  cors({
    origin: [
      "https://mystore-123456789789457446.myshopify.com/products/reviewproduct?variant=47782650511611",
      "https://mystore-123456789789457446.myshopify.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "ngrok-skip-browser-warning"],
    credentials: true
  })
);

// ✅ HANDLE PREFLIGHT
app.options("*", cors());


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, ngrok-skip-browser-warning");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -------------------- MONGODB -------------------- */
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

/* -------------------- REVIEW MODEL -------------------- */
const Review = mongoose.model('Review', new mongoose.Schema({
  shop: String,
  productId: String,
  name: String,
  rating: Number,
  text: String,
  images: [String],
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
}));

/* -------------------- SHOPIFY SETUP -------------------- */
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SCOPES.split(","),
  hostName: process.env.HOST.replace("https://", ""),
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true
});

/* -------------------- IMAGE UPLOAD (MULTER) -------------------- */

// Storage with proper filenames
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
    );
  }
});

// File filter (only images)
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const isValid =
    allowed.test(file.mimetype) &&
    allowed.test(path.extname(file.originalname).toLowerCase());

  cb(isValid ? null : new Error("Only image files allowed"), isValid);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
});

/* -------------------- SERVE IMAGES PUBLICLY -------------------- */


/* -------------------- ROUTES -------------------- */

// GET APPROVED REVIEWS (STOREFRONT)
app.get('/reviews/:productId', async (req, res) => {
  console.log("FETCH PRODUCT ID:", req.params.productId);
  const productId = String(req.params.productId);
  const reviews = await Review.find({
    productId,
    status: 'approved'
  }).sort({ createdAt: -1 });

  res.json(reviews);
});

// shopify-proxy.js
app.get("/proxy/reviews/:productId", async (req, res) => {
  try {
    const productId = String(req.params.productId);

    const reviews = await Review.find({
      productId,
      status: "approved"
    }).lean();

    res.set("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(reviews));
  } catch (err) {
    res.status(500).send("[]");
  }
});

app.post("/proxy/reviews", async (req, res) => {
  try {
    const productId = String(req.body.productId || "");
    const name = String(req.body.name || "").trim();
    const rating = Number(req.body.rating);
    const text = String(req.body.text || "").trim();

    if (!productId || !name || !rating || !text) {
      return res.status(400).send("INVALID");
    }

    await Review.create({
      productId,
      name,
      rating,
      text,
      status: "pending"
    });

    // 🔴 IMPORTANT: Shopify expects HTML, not JSON
    res.status(200).send("OK");
  } catch (err) {
    console.error("SAVE ERROR:", err);
    res.status(500).send("ERROR");
  }
});



// CREATE REVIEW (WITH IMAGES)
app.post('/reviews', upload.array('images', 2), async (req, res) => {
  try {
    const origin = req.headers.origin || req.headers.referer;


    // Extract domain
    const shop = origin
      .replace("https://", "")
      .replace("http://", "")
      .split("/")[0];
    const review = new Review({
      shop,
      productId: String(req.body.productId),
      name: req.body.name,
      rating: Number(req.body.rating),
      text: req.body.text,
      images: req.files ? req.files.map(f => f.filename) : []
    });

    await review.save();
    res.json({ success: true });
  } catch (error) {
    console.error("❌ REVIEW SAVE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET ALL APPROVED For Landing Page
app.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({
      status: "approved"
    }).sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});




// ADMIN – APPROVE
app.post('/reviews/:id/approve', async (req, res) => {
  await Review.findByIdAndUpdate(req.params.id, { status: 'approved' });
  res.json({ success: true });
});

// ADMIN – REJECT
app.post('/reviews/:id/reject', async (req, res) => {
  await Review.findByIdAndUpdate(req.params.id, { status: 'rejected' });
  res.json({ success: true });
});

// ADMIN – GET ALL REVIEWS
app.get("/admin/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error("FETCH ALL ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/auth", async (req, res) => {
  const authRoute = shopify.auth.begin({
    shop: req.query.shop,
    callbackPath: "/auth/callback",
    isOnline: false,
    rawRequest: req,
    rawResponse: res
  });

  return authRoute;
});

app.get("/auth/callback", async (req, res) => {
  const session = await shopify.auth.callback({
    rawRequest: req,
    rawResponse: res
  });

  console.log("Shop installed on:", session.shop);

  res.redirect(`/admin?shop=${session.shop}`);
});
app.use("/uploads", express.static("uploads"));

/* -------------------- SERVER -------------------- */
app.listen(3000, () => console.log('🚀 Server running on port 3000'));
