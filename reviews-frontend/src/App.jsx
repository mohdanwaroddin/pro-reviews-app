import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ReviewForm from "./components/ReviewForm";
import ReviewsList from "./components/ReviewsList";
import AdminPanel from "./components/AdminPanel";

function Storefront() {
    return (
        <>
            <div className="page">
                <div className="content">
                    <h1>Product Reviews</h1>

                    <ReviewForm />
                    <ReviewsList />
                </div>
            </div>

        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <nav style={{ marginBottom: 20 }}>
                <Link to="/">Storefront</Link> |{" "}
                <Link to="/admin">Admin</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Storefront />} />
                <Route path="/admin" element={<AdminPanel />} />
            </Routes>
        </BrowserRouter>
    );
}
