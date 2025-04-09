import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import avatar from "../../images/png-transparent-default-avatar-thumbnail.png"; // Default avatar image
import "./search.scss";
import Nav from "../../elements/nav/Nav"; // Navigation component

const Search = () => {
    const [results, setResults] = useState([]); // Stores the search results (users found)
    const [following, setFollowing] = useState(new Set()); // Stores the usernames of users the current user follows
    const [loading, setLoading] = useState(false); // Loading state for search results
    const [error, setError] = useState(null); // Error state for any issues

    const { token, username } = useSelector((state) => state.user); // Redux state: access token and current username
    const location = useLocation(); // To read the current URL
    const navigate = useNavigate(); // For navigation between pages

    // ✅ Extract query parameter from URL (search query)
    const params = new URLSearchParams(location.search);
    const query = params.get("query")?.toLowerCase() || ""; // Lowercase to make it case insensitive
    
    // 📌 Fetching the list of users the current user is following
    useEffect(() => {
        if (!token) return;

        const fetchFollowing = async () => {
            try {
                const response = await axios.get(`http://49.13.31.246:9191/followings/${username}`, {
                    headers: { "x-access-token": token },
                });
                const followingSet = new Set(response.data.following.map((u) => u.username));
                setFollowing(followingSet); // Store the following set in state
            } catch (err) {
                console.error("Error fetching followings:", err);
            }
        };

        fetchFollowing();
    }, [token, username]);

    // 📌 Searching users based on query (filtering by name or username)
    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://49.13.31.246:9191/users`, {
                    headers: { "x-access-token": token },
                });

                // 🔹 Filter users based on query (match fullName or username)
                const filteredUsers = response.data.filter((user) =>
                    user.fullName.toLowerCase().includes(query) || user.username.toLowerCase().includes(query)
                );

                setResults(filteredUsers); // Set filtered users in the state
            } catch (err) {
                console.error("Error during search:", err);
                setResults([]); // If error occurs, clear the results
            } finally {
                setLoading(false); // Set loading to false after search finishes
            }
        };

        fetchUsers();
    }, [query, token]);

    // 📌 Follow or Unfollow user
    const toggleFollow = async (username) => {
        const isFollowing = following.has(username);
        const url = `http://49.13.31.246:9191/${isFollowing ? "unfollow" : "follow"}`;

        try {
            await axios.post(url, { username }, { headers: { "x-access-token": token } });

            setFollowing((prev) => {
                const updatedSet = new Set(prev);
                if (isFollowing) {
                    updatedSet.delete(username); // Remove user from following set
                } else {
                    updatedSet.add(username); // Add user to following set
                }
                return updatedSet;
            });
        } catch (err) {
            console.error(`Error ${isFollowing ? "unfollowing" : "following"} user:`, err);
        }
    };

    // 📌 Navigate to the user's profile when clicked
    const handleUserClick = (user) => {
        navigate(`/user/${user.username}`); // Redirect to the user's profile
    };

    return (
        <div>
            <Nav />
            <div className="search-container">
                <h2> Search Results: {query}</h2>
                {loading && <p> Loading...</p>}
                {error && <p className="error-msg">{error}</p>}
                {!loading && results.length === 0 && <p> No results found</p>}
                
                {/* ✅ Display list of found users */}
                <ul className="search-results">
                    {results.map((user) => (
                        <li key={user._id} onClick={() => handleUserClick(user)}>
                            <img src={user.avatar || avatar} alt="Avatar" />
                            {user.fullName} (@{user.username})
                        </li>
                    ))}
                </ul>

                {/* ✅ Back to feed button */}
                <button className="back-to-feed-btn" onClick={() => navigate("/feed")}>⬅ Back to feed</button>
            </div>
        </div>
    );
};

export default Search;
