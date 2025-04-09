import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import avatar from "../../images/png-transparent-default-avatar-thumbnail.png";
import User from "../../elements/user/User";
import Weather from "../../elements/weather/Weather";
import ScrollUp from '../../elements/scroll/ScrollUp';

const UserProfile = () => {
    const { username: viewedUsername } = useParams();
    const { token, username: myUsername } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token || !viewedUsername) {
            setError("❌ Error: Token or username is missing.");
            setLoading(false);
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://49.13.31.246:9191/user/${viewedUsername}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                });
                if (!response.ok) throw new Error(`Error: ${response.status}`);
                const data = await response.json();
                setProfileData(data);
                if (data._id) fetchUserPosts(data._id);
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchUserPosts = async (userId) => {
            try {
                const response = await fetch(`http://49.13.31.246:9191/posts?user_id=${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                });
                if (!response.ok) throw new Error(`Error loading posts: ${response.status}`);
                const data = await response.json();
                setPosts(data.reverse());
            } catch (err) {
                console.error("❌ Error loading posts:", err.message);
            }
        };

        const fetchFollowing = async () => {
            try {
                const response = await fetch(`http://49.13.31.246:9191/followings/${myUsername}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                });
                if (!response.ok) throw new Error("Error loading subscriptions");
                const data = await response.json();
                setIsFollowing(data.following?.some((follow) => follow.username === viewedUsername));
            } catch (err) {
                console.error("❌ Error getting subscriptions:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
        fetchFollowing();
    }, [token, viewedUsername, myUsername]);

    const toggleFollow = async () => {
        const url = `http://49.13.31.246:9191/${isFollowing ? "unfollow" : "follow"}`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                },
                body: JSON.stringify({ username: viewedUsername }),
            });
            if (!response.ok) throw new Error(`Error ${isFollowing ? "unfollowing" : "following"}`);
            setIsFollowing(!isFollowing);
        } catch (err) {
            console.error(err.message);
        }
    };
    const getYouTubeEmbedUrl = (url) => {
        const regExp = /^.*(youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
    };


    if (loading) return <div className="one-user-loading">⏳ Loading...</div>;
    if (error) return <div className="one-user-error">{error}</div>;
    if (!profileData) return <div className="one-user-error">❌ Failed to load profile</div>;

    return (
        <div className="profile-container">
            <div className="cover-photo"></div>
            <div className="profile-content">
                <div className="profile-info-box">
                    <div className="profile-info-section">
                        <img src={profileData?.avatar || avatar} alt="Avatar" className="profile-avatar" />
                        <h1 className="profile-name">{profileData.fullName}</h1>
                        <p className="profile-username">@{profileData.username}</p>
                        <div className="profile-stats">
                            <div className="profile-stat"><strong>{profileData.followers || 0}</strong><p>Followers</p></div>
                            <div className="profile-stat"><strong>{profileData.following || 0}</strong><p>Subscriptions</p></div>
                            <div className="profile-stat"><strong>{posts.length || 0}</strong><p>Posts</p></div>
                        </div>
                    </div>
                </div>
                <div className="profile-right-box">
                    <div className="profile-description">
                        <h3>About Me</h3>
                        <p style={{ whiteSpace: "pre-wrap" }}>{profileData.bio || "No description available."}</p>
                    </div>
                    <div className="profile-posts-box">
                        {posts.length > 0 ? (
                           posts.map(({ _id, title, description, image, video }) => (

                                <div key={_id} className="post-item">
                                    <div className="post-header"><h3>{title}</h3></div>
                                    <p style={{ whiteSpace: "pre-wrap" }}>{description || "No description"}</p>
                                    {image && <img src={image} alt="Post" className="post-image" loading="lazy" />}
                                    {video && getYouTubeEmbedUrl(video) && (
                                        <iframe
                                            src={getYouTubeEmbedUrl(video)}
                                            title="Video"
                                            className="post-video"
                                            allowFullScreen
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
            </div>
            <ScrollUp />
        </div>
    );
};

export default UserProfile;
