import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './profile.css';

function Profile() {
  const [user, setUser] = useState({ name: '' });
  const [avatar, setAvatar] = useState('');
  const [err, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    document.title = 'Fashion Blog - Profile';
    const storedAccountId = localStorage.getItem('accountId');
    getUser(storedAccountId);
    checkLoginStatus(); // Check if the user is logged in

    // eslint-disable-next-line 
  }, []);

    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
      }
    };
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setPopupMessage('You have been logged out!');
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate('/');
        }, 1000)
  }

  const handleImageClick = () => {
    document.getElementById('avatarInput').click();
  };
  const handleFileChange = async (e) => {
    const account_id = localStorage.getItem("accountId");
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('account_id', account_id);

      try {
        const response = await fetch('http://localhost:81/upload-avatar', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setAvatar(data.avatarUrl); // Update the avatar with the new image URL
        } else {
          console.error('Upload failed');
        }
      } catch (error) {
        setError(error);
        console.log('Error uploading file:', err);
      }
    }
  };

  const getUser = (accountId) => {
    fetch(`http://localhost:81/getUser?account_id=${accountId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .then(data => {
      if (data.length > 0) {
        setUser(data[0].account);
        setAvatar(data[0].avatar || "https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg");
      } else {
        setError('User not found.');
      }
    })
    .catch(error => {
      setError(`Error: ${error.message}`);
    });
  }
  

  return (
    <div className='body-profile'>
      <div className='nav-container'>
        <div className='home-menu'>
          <div className='nav-menu'>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Products</Link></li>
              <li><Link to="/about-us">About Us</Link></li>
            </ul>
            {isLoggedIn ? (
                <div className="profile-menu">
                  <ul>
                    <li>
                      <Link to="/profile">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40%" height="40%" fill="currentColor" className="bi bi-person-circle svg-icon" viewBox="0 0 16 16">
                          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                          <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                        </svg>
                      </Link>
                        <ul className="dropdown-menu">
                          <li><Link to="/profile">Profile</Link></li>
                          <li><Link onClick={handleLogout}>Log out</Link></li>
                        </ul>
                      </li>
                      <li>
                        <Link to={"/cart"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40%" height="40%" fill="currentColor" class="bi bi-cart svg-icon" viewBox="0 0 16 16">
                          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                        </svg>
                        </Link>
                      </li>
                  </ul>
                  </div>
              ) : (
                  <div className="profile-menu">
                    <ul>
                      <li><Link to="/login">Login/Register</Link></li>
                    </ul>
                  </div>
              )}
          </div>
        </div>
      </div>
        <div className='wrapper'>
            <div className='left'>
                    <img 
                onClick={handleImageClick} 
                src={avatar} 
                alt="Avatar" 
                width="70px" 
                height="70px" 
                style={{ cursor: 'pointer' }} 
              />
              <input 
                id="avatarInput" 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={handleFileChange} 
              />
            <h1> {user.name || 'Loading...'}</h1>
            </div>
            <div className='right'>
                <div className='infor'>
                    <h3>information</h3>
                    <div className='infor_data'>
                        <div className='data'>
                            <h4>Email</h4>
                            <p>{user.email || "Loading..."}</p>
                        </div>
                        <div className='data'>
                            <h4>Phone</h4>
                            <p>{user.phone || "Loading..."}</p>
                        </div>
                    </div>
                </div>

                <div className='account_infor'>
                    <h3>Security</h3>
                    <div className='account_data'>
                        <div className='data'>
                            <h4>Username</h4>
                            <p>{user.username || "Loading..."}</p>
                        </div>
                        <div className='data'>
                            <h4>Password</h4>
                            <button>Change Password</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        {showPopup && (
        <div className="popup">
          <p>{popupMessage}</p>
        </div>
      )}
    </div>
  );
}

export default Profile;
