import { useEffect, useState } from "react";
import { API } from "../api";

const STATUS_ORDER = ["pending", "approved", "rejected"];
const PAGE_SIZE = 5;

export default function AdminPanel() {
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(1);
    const [expanded, setExpanded] = useState({});

    const loadReviews = async () => {
        try {
            const res = await API.get("/admin/reviews");

            // 🔑 normalize + sort
            const sorted = STATUS_ORDER.flatMap(status =>
                res.data.filter(r => r.status?.toLowerCase() === status)
            );

            console.log("SORTED REVIEWS:", sorted.map(r => r.status));

            setReviews(sorted);
        } catch (err) {
            console.error("ADMIN FETCH ERROR:", err);
        }
    };

    useEffect(() => {
        loadReviews();
    }, []);

    const approve = async (id) => {
        await API.post(`/reviews/${id}/approve`);
        loadReviews();
    };

    const reject = async (id) => {
        await API.post(`/reviews/${id}/reject`);
        loadReviews();
    };


    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const currentReviews = reviews.slice(start, end);


    return (
        <div className="admin-page">
            <div className="admin-container">
                <h2 className="admin-title">Admin Panel</h2>

                {reviews.length === 0 && <p>No reviews found</p>}

                {currentReviews.map(r => (
                    <div key={r._id} className="admin-card">
                        {/* LEFT SECTION */}
                        <div className="admin-card-left">
                            <div className="review-header">
                                <strong>{r.name || "Anonymous"}</strong>
                                <span className={`badge ${r.status}`}>{r.status}</span>
                            </div>
                            <p
                                className={
                                    expanded[r._id]
                                        ? "review-text expanded"
                                        : "review-text"
                                }
                            >
                                {r.text}
                            </p>
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
                            <div>
                                {[...Array(r.rating)].map((_, i) => (
                                    <span key={i} className="star">★</span>
                                ))}
                            </div>

                            {r.status === "pending" && (
                                <div className="admin-actions">
                                    <button
                                        className="btn btn-approve"
                                        onClick={() => approve(r._id)}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="btn btn-reject"
                                        onClick={() => reject(r._id)}
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
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

                {reviews.length > PAGE_SIZE && (
                    <div className="pagination">
                        <button
                            className="btn"
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            Previous
                        </button>

                        <span className="page-number">Page {page}</span>

                        <button
                            className="btn"
                            disabled={end >= reviews.length}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}


            </div>
        </div>
    );


}
