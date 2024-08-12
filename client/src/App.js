import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './routes/Home/Home';
import Register from './routes/Register/Register';
import Login from './routes/Login/Login';
import './App.css';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
    </Router>
  );
}

export default App;
