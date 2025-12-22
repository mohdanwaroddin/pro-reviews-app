import { useState } from 'react'
import { API } from '../api'

export default function ReviewForm() {
    const [form, setForm] = useState({
        shop: 'test-store.myshopify.com',
        productId: '123456789',
        name: '',
        rating: 5,
        text: ''
    })
    const [images, setImages] = useState([])

    const submit = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();
            data.append("shop", form.shop);
            data.append("productId", form.productId);
            data.append("name", form.name);
            data.append("rating", form.rating);
            data.append("text", form.text);

            images.forEach(img => data.append("images", img));

            const res = await API.post("/reviews", data);

            if (res.data.success) {
                alert("Review submitted successfully and awaiting approval");

                // reset form
                setForm({
                    shop: form.shop,
                    productId: form.productId,
                    name: "",
                    rating: 5,
                    text: ""
                });
                setImages([]);
            }
        } catch (err) {
            console.error(err);
            alert("Uploading failed");
        }
    };



    return (
        <form onSubmit={submit} className="card form-card">
            <h2>Write a Review</h2>

            <input
                placeholder="Your Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
            />

            <textarea
                placeholder="Your Review"
                value={form.text}
                onChange={e => setForm({ ...form, text: e.target.value })}
            />

            <select
                value={form.rating}
                onChange={e => setForm({ ...form, rating: e.target.value })}
            >
                <option value={5}>★★★★★ (5)</option>
                <option value={4}>★★★★☆ (4)</option>
                <option value={3}>★★★☆☆ (3)</option>
                <option value={2}>★★☆☆☆ (2)</option>
                <option value={1}>★☆☆☆☆ (1)</option>
            </select>

            <input
                id="imagesInput"
                type="file"
                multiple
                onChange={e => setImages([...e.target.files])}
            />

            <button type="submit" className="btn btn-approve">
                Submit Review
            </button>
        </form>

    )
}
