import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./myProfile.scss";
import User from "../../elements/user/User";
import Weather from "../../elements/weather/Weather";
import ScrollUp from '../../elements/scroll/ScrollUp';

const MyProfile = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [profileData, setProfileData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [postsLoading, setPostsLoading] = useState(false);
    const [postsError, setPostsError] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate("/");
            return;
        }

        const fetchProfile = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://49.13.31.246:9191/me", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                });

                if (!response.ok) throw new Error(`Error: ${response.status}`);

                const data = await response.json();
                setProfileData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token, navigate]);

    useEffect(() => {
        if (!profileData?._id) return;

        const fetchPosts = async () => {
            setPostsLoading(true);
            try {
                const response = await fetch(`http://49.13.31.246:9191/posts?user_id=${profileData._id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                });

                if (!response.ok) throw new Error("Failed to load posts");

                const data = await response.json();
                setPosts(data);
            } catch (err) {
                setPostsError(err.message);
            } finally {
                setPostsLoading(false);
            }
        };

        fetchPosts();
    }, [profileData, token]);

    const deletePost = async (postId) => {
        if (!window.confirm("Delete this post?")) return;

        try {
            const response = await fetch(`http://49.13.31.246:9191/post/${postId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                },
            });

            if (!response.ok) throw new Error("Error deleting post");

            setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
        } catch (err) {
            alert("Error: " + err.message);
        }
    };
    const getYouTubeEmbedUrl = (url) => {
        const regExp = /^.*(youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error-msg">Error: {error}</div>;
    if (!profileData) return <div className="error-msg">No profile data</div>;

    return (
        <div className="profile-container">
            <div className="cover-photo"></div>

            <div className="profile-content">
                <div className="profile-info-box">
                    <div className="profile-info-section">
                        <img src={profileData.avatar || "default-avatar.png"} alt="Avatar" className="profile-avatar" />
                        <h1 className="profile-name">{profileData.fullName}</h1>
                        <p className="profile-username">@{profileData.username}</p>

                        <div className="profile-stats">
                            <div className="profile-stat">
                                <strong>{profileData.followers || 0}</strong>
                                <p>Followers</p>
                            </div>
                            <div className="profile-stat">
                                <strong>{profileData.following || 0}</strong>
                                <p>Subscriptions</p>
                            </div>
                            <div className="profile-stat">
                                <strong>{posts.length || 0}</strong>
                                <p>Posts</p>
                            </div>
                        </div>

                        <button className="edit-profile-btn" onClick={() => navigate("/editProfile")}>
                            Edit Profile
                        </button>
                    </div>
                </div>

                <div className="profile-right-box">
                    <div className="profile-description">
                        <h3>About Me</h3>
                        <p style={{ whiteSpace: "pre-wrap" }}>{profileData.bio || "No description available."}</p>
                    </div>

                    <div className="profile-posts-box">
                        {postsLoading ? (
                            <p>Loading posts...</p>
                        ) : postsError ? (
                            <p className="error-msg">Error loading posts: {postsError}</p>
                        ) : Array.isArray(posts) && posts.length > 0 ? (
                            posts.map(({ _id, title, description, image, video }) => (

                                <div key={_id} className="post-item">
                                    <div className="post-header">
                                        <h3>{title}</h3>
                                        <button className="delete-post-btn" onClick={() => deletePost(_id)}>❌</button>
                                    </div>
                                    <p style={{ whiteSpace: "pre-wrap" }}>{description || "No description"}</p>
                                    {image && <img src={image} alt="Post" className="post-image" loading="lazy" />}
                                    {video && getYouTubeEmbedUrl(video) && (
                                        <iframe
                                            src={getYouTubeEmbedUrl(video)}
                                            title="Video"
                                            className="post-video"
                                        />
                                    )}

                                </div>
                            ))
                        ) : (
                            <p>No posts available.</p>
                        )}

                    </div>
                </div>

                <div className="col-4">
                    <User />
                    <Weather />
                </div>
                <ScrollUp />
            </div>
        </div>
    );
};

export default MyProfile;
