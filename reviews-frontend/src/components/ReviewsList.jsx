import { useEffect, useState } from "react";
import { API } from "../api";

const PAGE_SIZE = 5;

export default function ReviewsList() {
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(1);
    const [expanded, setExpanded] = useState({});

    useEffect(() => {
        API.get("/reviews")
            .then(res => setReviews(res.data))
            .catch(console.error);
    }, []);

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const currentReviews = reviews.slice(start, end);

    return (
        <div style={{ margin: "30px auto", maxWidth: "900px" }}>
            <h2>Customer Reviews</h2>

            {currentReviews.map(r => (
                <div key={r._id} className="admin-card">
                    {/* LEFT SECTION */}
                    <div className="admin-card-left">
                        <div className="review-header">
                            <strong>{r.name || "Anonymous"}</strong>
                            <div>
                                {[...Array(r.rating)].map((_, i) => (
                                    <span key={i} className="star">★</span>
                                ))}
                            </div>
                        </div>

                        {/* REVIEW TEXT */}
                        <p
                            className={
                                expanded[r._id]
                                    ? "review-text expanded"
                                    : "review-text"
                            }
                        >
                            {r.text}
                        </p>

                        {/* READ MORE / LESS */}
                        <div className="read-more-wrapper">
                            {r.text.length > 120 && (
                                <button
                                    className="read-more"
                                    onClick={() =>
                                        setExpanded(prev => ({
                                            ...prev,
                                            [r._id]: !prev[r._id]
                                        }))
                                    }
                                >
                                    {expanded[r._id] ? "Read less" : "Read more"}
                                </button>
                            )}
                        </div>
                        <div className="review-footer">

                            <small>
                                {new Date(r.createdAt).toLocaleDateString()}
                            </small>
                        </div>
                    </div>

                    {/* RIGHT SECTION – IMAGE */}
                    {r.images && r.images.length > 0 && (
                        <div className="admin-card-right">
                            <img
                                src={`http://localhost:3000/uploads/${r.images[0]}`}
                                alt="review"
                                className="admin-review-image"
                            />
                        </div>
                    )}
                </div>
            ))}

            {/* PAGINATION (OPTIONAL – already works) */}
            {reviews.length > PAGE_SIZE && (
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                        Prev
                    </button>
                    <button
                        disabled={end >= reviews.length}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
