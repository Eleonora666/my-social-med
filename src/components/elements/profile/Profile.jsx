import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, setUser } from "../../../features/features";
import { useNavigate } from "react-router-dom";
import "./profile.scss";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, posts = [] } = useSelector((state) => state.user); // Гарантируем, что posts всегда массив
  // const token = localStorage.getItem(token)
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/");
      alert('test')
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
        dispatch(setUser({
          user: data._id,
          username: data.username,
        }));
      } catch (err) {
        setError(err.message);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, dispatch, navigate]);

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
        setUserPosts(data);
      } catch (err) {
        setPostsError(err.message);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchPosts();
  }, [profileData, token]);

  if (!token) return <div className="error-msg">User is not authorized</div>;
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-msg">Error: {error}</div>;
  if (!profileData) return <div className="error-msg">No profile data</div>;

  return (
    <div className="profile-card col-3">
      <div className="profile-header">
        <img src={profileData.avatar} alt="Avatar" className="profile-avatar" />
        <h2>{profileData.fullName}</h2>
      </div>
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
          <strong>{userPosts.length}</strong>
          <p>Posts</p>
        </div>
      </div>
      <div className="profile-menu">
        <button onClick={() => navigate("/myProfile")}>Profile</button>
        <button onClick={() => navigate("/followers")}>Following me</button>
        <button onClick={() => navigate("/followings")}>Following</button>
        <button onClick={() => navigate("/editProfile")}>Settings</button>
      </div>
      <button className="profile-view-btn" onClick={() => navigate("/MyProfile")}>View Profile</button>
    </div>
  );
};

export default Profile;
