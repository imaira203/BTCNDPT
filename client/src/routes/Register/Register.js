// client/src/routes/Register.js
import React, { useState, useEffect } from 'react';
import './register.css';


function Register() {
  useEffect(() => {
    document.title = 'Fashion Blog - Register';
  }, []);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const register = () => {
    fetch('http://localhost:81/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((response) => response.text())
      .then((data) => {
        alert(data);
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <div className='register'>
      <h2>Register</h2>
      <div className="form-group">
        <label htmlFor="register-username">Username</label>
        <input
          type="text"
          id="register-username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="register-password">Password</label>
        <input
          type="password"
          id="register-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="btn" onClick={register}>
        Register
      </button>
    </div>
  );
}

export default Register;
