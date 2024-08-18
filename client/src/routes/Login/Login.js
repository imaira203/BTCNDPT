import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./login.css";

function Login() {
  useEffect(() => {
    document.title = 'Fashion Blog - Login';
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch('http://localhost:81/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        localStorage.setItem('token', data.token);
        setPopupMessage('Login successful!');
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate('/');
        }, 1000); 
      } else {
        setPopupMessage('Login failed. Please check your username and password.');
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='body_login'>
      <div className="wapper">
        <form onSubmit={handleLogin}>
          <h1>Welcome back</h1>
          <div className="input-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="i1" viewBox="0 0 16 16">
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
            </svg> 
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Username'
              required
            />
          </div>
          <div className="input-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="i2" viewBox="0 0 16 16">
              <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
            </svg>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              required
            />
          </div>
          <div className="remember-forgot">
            <label><input type="checkbox"></input>Remember me</label>
            <a><Link to="/">Forgot password</Link></a>
          </div>
          <button type="submit" className="bnt">Login</button>
          <div className="register">
            <p>Don't have an account? <Link to="/Register">Create one</Link></p>
          </div>
        </form>
      </div>

      {showPopup && (
        <div className="popup">
          <p>{popupMessage}</p>
        </div>
      )}
    </div>
  );
}

export default Login;
