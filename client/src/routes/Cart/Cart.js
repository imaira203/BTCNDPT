import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './cart.css';

function Cart() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Fashion Site - Cart';
    checkLoginStatus();
    // Fetch cart data if logged in
    if (isLoggedIn) {
      fetchCartData();
    }
    // eslint-disable-next-line
  }, [isLoggedIn]);

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setPopupMessage('You Must Log In First!');
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate('/');
      }, 1000);
    }
  };

  const fetchCartData = async () => {
    const user_id = localStorage.getItem('userId');
    try {
      const response = await fetch(`http://localhost:81/get-cart?user_id=${user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error('Failed to fetch cart data:', error.message);
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
    }, 1000);
  };

  return (
    <div>
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
                    <Link to="/cart">
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
      <div className='cart-container'>
        {cartItems.length > 0 ? (
          <div className="cart-items">
            {cartItems.map((item) => {
              const price = parseFloat(item.product.lastPrice) || 0;
              const quantity = item.quantity || 0;
              const total = price * quantity;

              return (
                <div key={item.product_id} className="cart-item">
                  <div className='details'>
                    <h3>{item.product.name}</h3>
                    <p>Price: ${price.toFixed(2)}</p>
                    <p>Quantity: {quantity}</p>
                    <p>Total: ${total.toFixed(2)}</p>
                  </div>
                  <div className='card-image'>
                    <img alt='img' src={item.product.img}></img>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>
      {showPopup && (
        <div className="popup">
          <p>{popupMessage}</p>
        </div>
      )}
    </div>
  );
}

export default Cart;
