import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./register.css"

function Register() {
  useEffect(() => {
    document.title = 'Fashion Blog - Register';
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhoneNumber] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(phone)) {
      setPopupMessage('Phone number must be 10 digits.');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }
  
    // Kiểm tra email (định dạng example@gmail.com)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setPopupMessage('Please enter a valid email address.');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }

    const registerData = {
      username: username,
      password: password,
      name: name,
      phone: phone,
      email: email,
    };

    try {
      const response = await fetch('http://localhost:81/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (response.ok) {
        setPopupMessage('Registration successful! Redirecting to login...');
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate('/login');
        }, 2000);
      } else {
        setPopupMessage('Registration failed. Please try again.');
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      setPopupMessage('An error occurred. Please try again.');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  return (
    <div className='body_login'>
      <div className="wrapper_register">
        <form onSubmit={handleRegister}>
          <h1>Create an account</h1>
          <div className="input-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="i1" viewBox="0 0 16 16">
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
            </svg>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Name'
              required
            />
          </div>
          <div className="input-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="i2" viewBox="0 0 16 16">
              <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
            </svg>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Example@gmail.com'
              required
            />
          </div>
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
          <div className="input-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="i2" viewBox="0 0 16 16">
              <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
            </svg>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder='Phone Number'
              required
            />
          </div>
          <button type="submit" className="btn">Register</button>
          <div className="register">
            <p>Already have an account? <Link to="/login">Login</Link></p>
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

export default Register;
