import React, { useState, useEffect } from 'react';
import './profile.css';

function Profile() {
  const [user, setUser] = useState({ name: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Fashion Blog - Profile';
    const storedAccountId = localStorage.getItem('accountId');
    getUser(storedAccountId);
  }, []);

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
        setUser(data[0]);
      } else {
        setError('User not found.');
      }
    })
    .catch(error => {
      setError(`Error: ${error.message}`);
    });
  }

  return (
    <div className='main'>
        <div className='wrapper'>
            <div className='left'>
                <img src="https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg" alt="" width="70px" height="70px">
            </img>
            <h1> {user.name || 'Loading...'}</h1>
            <p>Gruop6</p>
            </div>
            <div className='right'>
                <div className='infor'>
                    <h3>information</h3>
                    <div className='infor_data'>
                        <div className='data'>
                            <h4>Email</h4>
                            <p>dinhprovip@gmail.com</p>
                        </div>
                        <div className='data'>
                            <h4>Phone</h4>
                            <p>0364213314</p>
                        </div>
                    </div>
                </div>

                <div className='account_infor'>
                    <h3>Security</h3>
                    <div className='account_data'>
                        <div className='data'>
                            <h4>Account</h4>
                            <p>demo@gmail.com</p>
                        </div>
                        <div className='data'>
                            <h4>password</h4>
                            <p>abcd12345</p>
                        </div>
                    </div>
                </div>



            </div>
        </div>

      
    </div>
  );
}

export default Profile;
