import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './home.css';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Fashion Blog - Home';
    checkLoginStatus(); // Check if the user is logged in
  }, []);

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  };

  const directToShop = () => {
    navigate("/shop")
  }

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

  return (
    <div className="body">
      <div className='nav-container'>
        <div className='home-menu'>
          <div className='nav-menu'>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="shop">Products</Link></li>
              <li><Link to="about-us">About Us</Link></li>
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="40%" height="40%" fill="currentColor" className="bi bi-cart svg-icon" viewBox="0 0 16 16">
                          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                        </svg>
                        </Link>
                      </li>
                  </ul>
                  </div>
              ) : (
                  <div className="profile-menu">
                    <ul>
                      <li><Link to="Login">Login/Register</Link></li>
                    </ul>
                  </div>
              )}
          </div>
        </div>
      </div>
      <div className='container'>
        <div className="img" onClick={directToShop}>
          <img alt="Men" src="https://templates.simplified.co/thumb/1f4ddfc2-fd55-43f9-8c8a-3be7277d5828.jpg"></img>
        </div>
        <div className="img" onClick={directToShop}>
          <img alt="Women" src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/33234650700333.58d88a71f123e.png"></img>
        </div>
        <div className="img" onClick={directToShop}>
         <img alt="Kids" src="https://i.ytimg.com/vi/5zWZjeeOViM/maxresdefault.jpg"></img>
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

export default Home;
