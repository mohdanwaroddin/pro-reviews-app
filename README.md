<hr>
<h1>Reviews-App</h1>
<hr>
<h3>🛍️ Shopify Product Reviews App</h3>

A full-stack Product Reviews application built using Node.js, MongoDB, React.js, and Shopify Theme App Extension.
The app allows customers to submit reviews for Shopify products, enables admin moderation, and displays approved reviews directly on the Shopify product page.
<br>

<a href="README.md#-features">Features</a>
<a href="README.md#-project-structure">Project Structure</a>
<a href="README.md#-assumptions">Assumptions</a>
<a href="README.md#-possible-enhancements">Enhancements</a>



## ✨ Features<br>
📝 Submit product reviews (with ratings & images)<br>
🔐 Admin moderation (Approve / Reject)<br>
🗄️ MongoDB-based persistent storage<br>
🛍️ Shopify Theme App Extension integration<br>
⭐ Product-specific reviews using Shopify Product ID<br>
📄 Pagination (5 reviews per page)<br>
🖼️ Image upload support<br>
🎨 Clean & responsive UI<br>

## 🏗️ Tech Stack<br>
Layer	Technology<br>
Backend	Node.js, Express.js<br>
Database	MongoDB Atlas<br>
Frontend	React.js (Vite)<br>
File Upload	Multer<br>
Shopify	Shopify CLI, Theme App Extension<br>
Tunneling	ngrok

## 📂 Project Structure<br>
project-root/<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── backend/<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│   ├── server.js<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│   ├── package.json<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│   └── uploads/<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── frontend/<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│   ├── src/<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│   └── package.json<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── shopify-extension/<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ├── shopify.app.toml<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; └── extensions/<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; └── product-reviews/<br>

## ⚙️ Setup Instructions<br>
1️⃣ Prerequisites<br>
Make sure you have:<br>
Node.js v20.x (LTS)<br>
npm v10+<br>
MongoDB Atlas account<br>
Shopify Partner account<br>
Shopify development store<br>
Shopify CLI (@shopify/cli)<br>
ngrok<br>

2️⃣ Backend Setup (Node + MongoDB)<br>
cd backend<br>
npm install<br>
Create a .env file:<br>
PORT=3000<br>
MONGODB_URI=your_mongodb_connection_string<br>
SHOPIFY_API_KEY=your_key<br>
SHOPIFY_API_SECRET=your_secret<br>
SCOPES=read_products,write_products<br>
HOST=https://your-ngrok-url<br>
Start the backend server:<br>
node server.js<br>
Backend runs on:<br>
http://localhost:3000<br>

3️⃣ Database Migration / Initialization<br>

⚠️ No manual migration command is required.<br>
MongoDB collections are auto-created using Mongoose schemas<br>
First review submission automatically initializes the collection<br>
Schema Used:<br>
Review {<br>
  shop: String,<br>
  productId: String,<br>
  name: String,<br>
  rating: Number,<br>
  text: String,<br>
  images: [String],<br>
  status: "pending | approved | rejected",<br>
  createdAt: Date<br>
}<br>

4️⃣ Frontend Setup (React)<br>
cd frontend<br>
npm install<br>
npm run dev<br>
Frontend runs on:<br>
http://localhost:5173<br>

5️⃣ Shopify App & Theme App Extension Setup<br>
cd shopify-extension<br>
npx shopify login<br>
npx shopify app dev<br>

During setup:<br>
Select existing Shopify app<br>
Enter store password (if enabled)<br>
App installs automatically on dev store<br>

6️⃣ Add Reviews Block to Shopify Theme
<br>Shopify Admin → Online Store → Themes → Customize
<br>Switch to:
<br>Products → Default product
<br>Under Product information → Add block
<br>Select Apps → Product Reviews
<br>Save theme

## 🔁 How the Product ID Mapping Works
<br>Shopify provides {{ product.id }} in Liquid
<br>The same ID is:
<br>Sent during review submission
<br>Stored in MongoDB
<br>Used to fetch reviews for display
<br>✅ This ensures product-specific reviews.

## 🧠 Assumptions
<br>Shopify store is a development store
<br>Backend is exposed publicly via ngrok
<br>Reviews are displayed only after admin approval
<br>Product ID is the single source of truth
<br>Images are stored locally (not cloud-hosted)

## ⚠️ Limitations<br>
No authentication for customers (open review submission)<br>
Images are stored locally (not Cloudinary/S3)<br>
ngrok URL changes require updating backend URL<br>
Theme extension uses vanilla JS, not React<br>
No spam detection or CAPTCHA implemented<br>

## 🚀 Possible Enhancements<br>
Cloud-based image storage<br>
<space>Review submission authentication<br>
Star rating summary on product title<br>
SEO-friendly structured data (JSON-LD)<br>
Caching reviews for performance<br>
<br><hr><hr><br>
👨‍💻 Author
Mohd Anwaroddin<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fullstack Developer
