import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./editProfile.scss";

const EditProfile = () => {
	const { token } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const [postData, setPostData] = useState({
		username: "",
		avatar: "",
		age: "",
		bio: "",
		fullName: "",
		balance: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [photoInputType, setPhotoInputType] = useState("url");
	
	// ✅ Load current profile data
	useEffect(() => {
		const fetchProfileData = async () => {
			try {
				const response = await fetch("http://49.13.31.246:9191/me", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-access-token": token,
					},
				});
				if (!response.ok) throw new Error(`Error loading data: ${response.status}`);
				
				const data = await response.json();
				setPostData({
					username: data.username || "",
					avatar: data.avatar || "",
					age: data.age || "",
					bio: data.bio || "",
					fullName: data.fullName || "",
					balance: data.balance || "",
				});
			} catch (err) {
				setError(err.message);
			}
		};
		
		fetchProfileData();
	}, [token]);
	
	const handleChange = (e) => {
		setPostData({
			...postData,
			[e.target.name]: e.target.value,
		});
	};
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			const response = await fetch("http://49.13.31.246:9191/me", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"x-access-token": token,
				},
				body: JSON.stringify(postData),
			});
			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
			navigate("/feed");
		}
	};
	
	const deleteProfile = async () => {
		const isConfirmed = window.confirm("Are you sure you want to delete your profile? This action cannot be undone!");
		
		if (!isConfirmed) return; // If "Cancel" is clicked, exit the function
		
		try {
			await fetch("http://49.13.31.246:9191/me", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"x-access-token": token,
				},
			});
			
			navigate("/");
		} catch (err) {
			setError(err.message);
		}
	};
	
	return (
		<div>
			<div className="editProfile">
				<button className="delete-profile-btn" onClick={deleteProfile}>
					Delete Profile
				</button>
				<h1>Edit Profile</h1>
				<form onSubmit={handleSubmit} className="edit-profile-form" >
					<div className="form-group">
						<label htmlFor="username">Username:</label>
						<input
							required
							type="text"
							id="username"
							name="username"
							value={postData.username}
							onChange={handleChange}
							placeholder="Enter new username"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="age">Age:</label>
						<input
							required
							type="number"
							id="age"
							name="age"
							value={postData.age}
							onChange={handleChange}
							placeholder="Enter age"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="bio">About Me:</label>
						<input
							required
							type="text"
							id="bio"
							name="bio"
							value={postData.bio}
							onChange={handleChange}
							placeholder="Enter about yourself"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="fullName">Full Name:</label>
						<input
							required
							type="text"
							id="fullName"
							name="fullName"
							value={postData.fullName}
							onChange={handleChange}
							placeholder="Enter full name"
						/>
					</div>
				
					<div className="form-group">
						<label>Avatar:</label>
						<div className="media-choice">
							<label>
								<input
									type="radio"
									name="photoInputType"
									value="upload"
									checked={photoInputType === "upload"}
									onChange={() => setPhotoInputType("upload")}
								/>
								Upload File
							</label>
							<label>
								<input
									type="radio"
									name="photoInputType"
									value="url"
									checked={photoInputType === "url"}
									onChange={() => setPhotoInputType("url")}
								/>
								Enter URL
							</label>
						</div>
						{photoInputType === "upload" ? (
							<input type="file" accept="image/*" />
						) : (
							<input
								type="text"
								name="avatar"
								value={postData.avatar}
								onChange={handleChange}
								placeholder="Enter image URL"
							/>
						)}
					</div>
					
					<button className='save_profile' type="submit" disabled={loading}>
						{loading ? "Sending..." : "Save Changes"}
					</button>
				</form>
				
				<button className="back-to-profile-btn" onClick={() => navigate("/feed")}>
					Back to Profile
				</button>
				
				{error && <div className="error-msg">❌ Error: {error}</div>}
			</div>
		</div>
	);
};

export default EditProfile;
