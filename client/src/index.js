import React from 'react';
import ReactDOM from 'react-dom/client'; // Cập nhật import để sử dụng 'react-dom/client'
import App from './App';
import './index.css';

// Tạo root với createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render ứng dụng của bạn vào root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
