import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './routes/Home/Home';
import Register from './routes/Register/Register';
import Login from './routes/Login/Login';
import Profile from './routes/Profile/Profile';
import About from './routes/About/About';
import Shop from './routes/Shop/Shop';
import './App.css';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/shop" element={<Shop />} />
        </Routes>
    </Router>
  );
}

export default App;
