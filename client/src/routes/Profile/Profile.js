import React, { useState, useEffect } from 'react';
import './profile.css';

function Profile() {
  const [user, setUser] = useState({ name: '' });
  const [avatar, setAvatar] = useState('');
  const [err, setError] = useState('');

  useEffect(() => {
    document.title = 'Fashion Blog - Profile';
    const storedAccountId = localStorage.getItem('accountId');
    getUser(storedAccountId);
    // eslint-disable-next-line 
  }, []);

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
    <div>
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

      
    </div>
  );
}

export default Profile;
