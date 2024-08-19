import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./about.css"

function About() {
  useEffect(() => {
    document.title = 'Fashion Blog - About Us';
  }, []);

  return (
    <div>
        <h1>HELLO</h1>
    </div>
  );
}

export default About;
