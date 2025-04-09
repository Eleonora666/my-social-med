import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./createPost.scss";

const CreatePost = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // URL for the image
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      console.warn("No token for authentication, redirecting to login page");
      navigate("/");
      return;
    }

    setLoading(true);

    const postData = {
      title,
      description,
      status,
      'image': imageUrl
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

      navigate("/feed");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h1>Create a New Post</h1>
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter post title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Enter post description"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <input
            type="text"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            placeholder="Enter post status"
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
          />
        </div>

        {error && <div className="error-msg">{error}</div>}

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Uploading..." : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
