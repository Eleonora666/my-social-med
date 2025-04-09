import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./followers.scss";
import avatar from '../../images/png-transparent-default-avatar-thumbnail.png';
import ScrollUp from '../../elements/scroll/ScrollUp';

const Followers = () => {
	const { token, username } = useSelector((state) => state.user);
	const [followers, setFollowers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate(); // ✅ For navigating to the profile page

	useEffect(() => {
		if (!token || !username) {
			setError("❌ Error: Token or username is missing.");
			setLoading(false);
			return;
		}

		const fetchFollowers = async () => {
			try {
				const response = await fetch(`http://49.13.31.246:9191/followers/${username}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-access-token": token,
					},
				});

				if (!response.ok) throw new Error(`Error: ${response.status}`);

				let data = await response.json();
				console.log("🔍 SERVER RESPONSE (followers):", data);

				// ✅ Now get the list of followers from `data.followers`
				if (data && Array.isArray(data.followers)) {
					console.log("✅ Found followers:", data.followers);
					setFollowers(data.followers);
				} else {
					console.warn("⚠️ No followers or the response format has changed!");
					setFollowers([]); // If there are no followers
				}
			} catch (err) {
				console.error("❌ Error fetching followers:", err.message);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchFollowers();
	}, [token, username]);

	if (loading) return <div className="followers-loading">⏳ Loading...</div>;
	if (error) return <div className="followers-error">{error}</div>;

	console.log("✅ Final list of followers:", followers);

	if (!followers || followers.length === 0) return <div className="followers-empty">❌ No followers</div>;

	return (
		<div className="followers-container">
			<h2>Followers</h2>
			<div className="followers-list">
				{followers.map((follower) => (
					<div key={follower._id} className="follower-card" onClick={() => navigate(`/user/${follower.username}`)}>
						<img src={follower.avatar || avatar} alt="Avatar" className="follower-avatar" />
						<div className="follower-info">
							<p>{follower.fullName}</p>
							<p>@{follower.username}</p>
						</div>
					</div>
				))}
			</div>
			<ScrollUp />
		</div>
	);
};

export default Followers;
