import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./newPost.scss";

const NewPost = () => {
    const token = useSelector((state) => state.user?.token); // Safe token check
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPhotoInput, setShowPhotoInput] = useState(false);
    const [showVideoInput, setShowVideoInput] = useState(false);

    // Handle changes in inputs
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "title") setTitle(value);
        if (name === "description") setDescription(value);
        if (name === "image") setImageUrl(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            console.warn("No token for authentication, redirecting to login page");
            navigate("#"); // Redirect to login or home page
            return;
        }

        setLoading(true);

        const postData = {
            title,
            description,
            image: imageUrl,
        };

        try {
            const response = await fetch("http://49.13.31.246:9191/post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            navigate("/Feed"); // Redirect after successful post
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="new-post-container">
            <div className="post-box">
                
                <div className="post-header">
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter post title"
                        value={title}
                        onChange={handleChange}
                        className="post-input title-input"
                    />
                </div>

                <div className="post-description">
                    <textarea
                        name="description"
                        placeholder="Enter post description"
                        value={description}
                        onChange={handleChange}
                        className="post-input desc-input"
                    ></textarea>
                </div>

                <div className="post-actions">
                    <button className="post-action photo" onClick={() => setShowPhotoInput(!showPhotoInput)}>
                        Foto
                    </button>
                    <button className="post-action video" onClick={() => setShowVideoInput(!showVideoInput)}>
                        Video
                    </button>
                </div>

                {showPhotoInput && (
                    <div className="extra-input">
                        <input
                            type="text"
                            name="image"
                            placeholder="Foto URL"
                            value={imageUrl}
                            onChange={handleChange}
                        />
                    </div>
                )}

                {showVideoInput && (
                    <div className="extra-input">
                        <input
                            type="text"
                            name="video"
                            placeholder="Video URL"
                            value={imageUrl} // Video input isn't being used in your code, but you can add a state for it if needed
                            onChange={handleChange}
                        />
                    </div>
                )}

                <button className="post-submit" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Laden..." : "Posten"}
                </button>

                {error && <div className="error-msg">{error}</div>}
            </div>
        </div>
    );
};

export default NewPost;
