import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import avatar from '../../images/png-transparent-default-avatar-thumbnail.png';
import "./user.scss";

const User = () => {
  const { token, username } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [following, setFollowing] = useState(new Set()); //  User's subscriptions
  const navigate = useNavigate(); //  For navigating to profile page
  
  //  Load all users and my subscriptions
  useEffect(() => {
    if (!token) {
      setError("❌ Error: Token not found.");
      setLoading(false);
      return;
    }
    
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://49.13.31.246:9191/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        });
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        
        const data = await response.json();
        
        //  Exclude the current user from the list
        const filteredUsers = data.filter(user => user.username !== username);
        setUsers(filteredUsers);
      } catch (err) {
        setError(err.message);
      }
    };
    
    const fetchMyFollowing = async () => {
      try {
        const response = await fetch(`http://49.13.31.246:9191/followings/${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        });
        if (!response.ok) throw new Error("Error loading subscriptions");
        
        const data = await response.json();
        const myFollowing = new Set(data.following.map((u) => u.username)); //  Create a Set from subscriptions
        setFollowing(myFollowing);
      } catch (err) {
        console.error("❌ Error loading subscriptions:", err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
    fetchMyFollowing();
  }, [token, username]);
  
  //  Follow / Unfollow
  const toggleFollow = async (userToFollow) => {
    const isFollowing = following.has(userToFollow);
    const url = `http://49.13.31.246:9191/${isFollowing ? "unfollow" : "follow"}`;
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({ username: userToFollow }),
      });
      if (!response.ok) throw new Error(`Error ${isFollowing ? "unfollowing" : "following"}`);
      

      setFollowing((prev) => {
        const updatedSet = new Set(prev);
        if (isFollowing) {
          updatedSet.delete(userToFollow);
        } else {
          updatedSet.add(userToFollow);
        }
        return updatedSet;
      });
    } catch (err) {
      console.error("❌ Error during follow/unfollow:", err.message);
    }
  };
  
  //  UI handling for errors and loading
  if (loading) return <div className="loading">⏳ Loading...</div>;
  if (error) return <div className="error-msg">{error}</div>;
  
  return (
    <div className="user-list-container">
      <h2 className="uberschrift_user">All Users</h2>
      <div className="user-list">
        {users.map((userItem) => (
          <div key={userItem._id} className="user-item">
            {/*  Click on avatar or name redirects to the profile */}
            <div className="user-info" onClick={() => navigate(`/user/${userItem.username}`)}>
              <img src={userItem.avatar || avatar} alt="Avatar" className="user-avatar" />
              <h4>{userItem.fullName || "No name"}</h4>
              <p>@{userItem.username}</p>
            </div>
            
            {/* Follow / Unfollow button */}
            <button
              className={`follow-btn ${following.has(userItem.username) ? "following" : ""}`}
              onClick={() => toggleFollow(userItem.username)}
            >
              {following.has(userItem.username) ? "Unfollow" : "Follow"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default User;
