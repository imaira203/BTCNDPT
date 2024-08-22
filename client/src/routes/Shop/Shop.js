import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './shop.css';
import Rating from './rate';

function Shop() {
  const [products, setProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Men');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Fashion Blog - Home';
    checkLoginStatus();
    fetchProducts('Men');
  }, []);
  

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  };

  const fetchProducts = async (category) => {
    try {
      const response = await fetch(`http://localhost:81/get-products?category=${category}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const productsWithRatings = await Promise.all(
        data.products.map(async (product) => {
          const ratingResponse = await fetch(`http://localhost:81/get-rating?product_id=${product.id}`);
          const ratingData = await ratingResponse.json();
          return {
            ...product,
            rating: ratingData.averageRating || 0,
          };
        })
      );
      setProducts(productsWithRatings); // Cập nhật state với danh sách sản phẩm cùng với rating
    } catch (error) {
      console.error('Error fetching products:', error.message);
    }
  };

  const handleAddCart = async (productId) => {
    const user_id = localStorage.getItem('userId');
    
    if (!user_id) {
        console.error('User ID is missing');
        return;
    }

    try {
        const response = await fetch('http://localhost:81/add-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_id: productId, user_id }), // Ensure keys match
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Network response was not ok');
        }

        const result = await response.json();
        console.log('Product added to cart', result);
    } catch (error) {
        console.error('Failed to add: ', error.message);
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

  const handleRateProduct = async (productId, rating) => {
    const user_id = localStorage.getItem('userId');
    try {
        const response = await fetch('http://localhost:81/rate-product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, rating, user_id }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log('Rating submitted:', result);
    } catch (error) {
        console.error('Failed to submit rating:', error.message);
    }
};

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setProducts([]); // Clear the existing products
    fetchProducts(category); // Fetch products for the new category
  };

  


  return (
    <div className="body-shop">
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
                  <li><Link to="/login">Login/Register</Link></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='shop-container'>
        <div className='category'>
          <div className="section">Categories</div>
          <ul>
            <li 
              className={selectedCategory === 'Men' ? 'active' : ''} 
              onClick={() => handleCategoryClick('Men')}
            >
              Men
            </li>
            <li 
              className={selectedCategory === 'Women' ? 'active' : ''} 
              onClick={() => handleCategoryClick('Women')}
            >
              Women
            </li>
            <li 
              className={selectedCategory === 'Kids' ? 'active' : ''} 
              onClick={() => handleCategoryClick('Kids')}
            >
              Kids
            </li>
          </ul>
        </div>
        <div className='products-list'>
          <div className='item'>
          {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className='item-sell'>
                  <div className='product-image'><img alt='product-image' src={product.image}></img></div>
                  <div className='product-details'>
                    <div className='product-name'>{product.name}</div>
                    <Rating 
                      productId={product.id} 
                      currentRating={product.rating} 
                      onRate={(newRating) => handleRateProduct(product.id, newRating)}
                    />
                    <div className='first-price'>${product.firstPrice}</div>
                    <div className='last-price'>${product.lastPrice}</div>
                    <button className='add-cart'  onClick={() => handleAddCart(product.id)}>Add to cart</button>
                  </div>
                </div>
              ))
            ) : (
              <div className='not-found'>No products available</div>
            )}
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

export default Shop;
