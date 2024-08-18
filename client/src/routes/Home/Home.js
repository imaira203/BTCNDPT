import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './home.css';
import { images } from '../../images/images'; // Import images


function Home() {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Current image index
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const navigate = useNavigate();

  const postsPerPage = 5; 

  useEffect(() => {
    document.title = 'Fashion Blog - Home';
    getPosts();
    checkLoginStatus(); // Check if the user is logged in
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

  const getPosts = () => {
    fetch('http://localhost:81/getPosts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => console.error('Error:', error));
  };

  const Prev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const Next = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Get current posts based on current page
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total pages
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div>
      <div className='nav-container'>
        <div className='home-menu'>
          <div className='nav-menu'>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="Products">Products</Link></li>
              <li><Link to="Albums">Albums</Link></li>
              <li><Link to="About">About Us</Link></li>
              {isLoggedIn ? (
                <li className="profile-menu">
                  <Link to="/Profile">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40%" height="40%" fill="currentColor" className="bi bi-person-circle svg-icon" viewBox="0 0 16 16">
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                      <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                    </svg>
                  </Link>
                  <ul className="dropdown-menu">
                    <li><Link to="/Profile">Profile</Link></li>
                    <li><Link onClick={handleLogout}>Log out</Link></li>
                  </ul>
                </li>
              ) : (
                <li><Link to="Login">Login</Link></li>
              )}
            </ul>
            <div className='welcome'>
              <h1>Fashion Blog</h1>
            </div>
          </div>
        </div>
      </div>
      <div className='container'>
        <div className='side-nav'>
          {currentPosts.map((post) => (
            <div key={post.id} className='side-nav-item'>
              <h3 className='title'>{post.title}</h3>
              <p className='description'>{post.description}</p>
              <p className='author'>By {post.author}</p>
            </div>
          ))}
          <div className='pagination'>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        <div className='main-page'>
          <div className='image-container'>
            {images.length > 0 && (
              <img src={images[currentIndex]} alt="Banner" className='banner-image' />
            )}
          </div>
          <div className='prev-btn' onClick={Prev}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 6L9 12L15 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className='next-btn' onClick={Next}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6L15 12L9 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      <div className='footer'>FOOTER HERE</div>
      {showPopup && (
        <div className="popup">
          <p>{popupMessage}</p>
        </div>
      )}
    </div>
  );
}

export default Home;
