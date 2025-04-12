import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import avatar from '../../images/png-transparent-default-avatar-thumbnail.png';
import './followerMy.scss'
import ScrollUp from '../scroll/ScrollUp';

const FolgeIch = () => {
	const { token, username } = useSelector((state) => state.user);
	const [followings, setFollowings] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null); // Selected user
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	
	useEffect(() => {
		if (!token || !username) {
			setError("Error: Token or user not found.");
			setLoading(false);
			return;
		}
		
		const fetchFollowings = async () => {
			try {
				console.log(`Fetching followings for user: ${username}`);
				
				const response = await fetch(`http://49.13.31.246:9191/followings/${username}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-access-token": token,
					},
				});
				
				if (!response.ok) throw new Error(`Error: ${response.status}`);
				
				let data = await response.json();
				console.log("SERVER RESPONSE (followings):", data);
				
				if (data && Array.isArray(data.following)) {
					console.log("Found followings:", data.following);
					setFollowings([...data.following]);
				} else {
					console.warn("The server returned incorrect data or no followings.");
					setFollowings([]);
				}
			} catch (err) {
				console.error("Error fetching followings:", err.message);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		
		fetchFollowings();
	}, [token, username]);
	
	// Get user details
	const fetchUserDetails = async (user) => {
		try {
			const response = await fetch(`http://49.13.31.246:9191/user/${user.username}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-access-token": token,
				},
			});
			if (!response.ok) throw new Error("Error loading profile");
			
			const data = await response.json();
			setSelectedUser(data);
		} catch (error) {
			console.error("Error loading profile:", error);
		}
	};
	
	// Navigate to user profile
	const handleUserClick = (user) => {
		navigate(`/user/${user.username}`);
		fetchUserDetails(user);
	};
	
	if (loading) return <div className="loading">⏳ Loading...</div>;
	if (error) return <div className="error-msg">{error}</div>;
	
	return (
		<div className="following-list-container">
			<h2>My Followings</h2>
			<div className="following-list">
				{followings.length > 0 ? (
					followings.map((follow) => (
						<div key={follow._id} className="following-item" onClick={() => handleUserClick(follow)}>
							<img src={follow.avatar || avatar} alt="Avatar" className="following-avatar" />
							<div className="follower-info">
								<p>{follow.fullName}</p>
								<p>@{follow.username}</p>
							</div>
						</div>
					))
				) : (
					<p className="no-followings">You are not following anyone yet</p>
				)}
			</div>
			
			{/* User card */}
			{selectedUser && (
				<div className="user-card">
					<img src={selectedUser.avatar || "https://via.placeholder.com/100"} alt="Avatar" />
					<h3>{selectedUser.fullName} (@{selectedUser.username})</h3>
					<p><strong>Posts:</strong> {selectedUser.posts_count}</p>
					<p><strong>Followers:</strong> {selectedUser.followers}</p>
					<p><strong>Followings:</strong> {selectedUser.following}</p>
				</div>
			)}
			<ScrollUp />
		</div>
	);
};

export default FolgeIch;
