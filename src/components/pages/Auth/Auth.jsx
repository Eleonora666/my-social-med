import "./auth.scss";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { useForm } from "react-hook-form";
import { setToken } from "../../../features/features";
import { useDispatch } from "react-redux";

const HackerAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // Hook for registration (we add watch to check password match)
  const {
    handleSubmit: handleSubmitRegister,
    register: registerRegister,
    formState: { errors: errorsRegister },
    watch,
  } = useForm();

  const password = watch("password", ""); // Следим за полем пароля

  // Hook for login
  const {
    handleSubmit: handleSubmitLogin,
    register: registerLogin,
    formState: { errors: errorsLogin },
  } = useForm();

  // Registration
  const handleRegister = async (data) => {
    console.log("Registration, form data:", data);

    const payload = {
      username: data.username,
      password: data.password,
      confirm_password: data.confirm_password,
    };

    try {
      const response = await fetch('http://49.13.31.246:9191/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Registration successful! Please log in.');
        setIsLogin(true); // Switch to the login form after successful registration
      } else {
        console.error("Server response:", result);
        alert(result.message || 'Registration error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Network error');
    }
  };
  const dispatch = useDispatch()
  // Login
  const handleLogin = async (data) => {
    console.log("Login, form data:", data);
    try {
      const response = await fetch('http://49.13.31.246:9191/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('token', result.token); // Save token
        dispatch(setToken({ token: result.token }));
        navigate('/feed');
        // Redirect to the profile page
      } else {
        console.error("Server response:", result);
        alert(result.message || 'Login error');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Network error');
    }
  };

  return (
    <div className="section">
      {[...Array(200)].map((_, i) => (
        <span key={i}></span>
      ))}
      <div className="signin">
        <div className="content">
          <h2>{isLogin ? "Sign In" : "Sign Up"}</h2>
          <form
            className="form"
            onSubmit={isLogin ? handleSubmitLogin(handleLogin) : handleSubmitRegister(handleRegister)}
          >
            <div className="inputBox">
              <input
                type="text"
                {...(isLogin ? registerLogin : registerRegister)("username", { required: true })}
                required
              />
              <label>Username</label>
              {(isLogin ? errorsLogin : errorsRegister).username && (
                <span>This field is required</span>
              )}
            </div>
            <div className="inputBox">
              <input
                type="password"
                {...(isLogin ? registerLogin : registerRegister)("password", { required: true })}
                required
              />
              <label>Password</label>
              {(isLogin ? errorsLogin : errorsRegister).password && (
                <span>This field is required</span>
              )}
            </div>
            {!isLogin && (
              <div className="inputBox">
                <input
                  type="password"
                  {...registerRegister("confirm_password", { required: true })}
                  required
                />
                <label>Confirm Password</label>
                {errorsRegister.confirm_password && (
                  <span>This field is required</span>
                )}
              </div>
            )}
            <div className="links">
              <button
                type="button"
                className="link-button" // можно стилизовать как ссылку
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>

            </div>
            <div className="inputBox">
              <input type="submit" value={isLogin ? "Login" : "Sign Up"} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HackerAuth;
