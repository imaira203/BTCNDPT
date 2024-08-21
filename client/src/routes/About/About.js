import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./about.css"

function About() {
  useEffect(() => {
    document.title = 'Fashion Blog - About Us';
  }, []);

  return (
    <div>
      <div className='about'>
           <h1>Đoàn Duy Đường</h1>
          <h2>sở thích: đi phượt </h2>
          <h3>quê quán: nam định</h3>
      </div>
      <div className='about'>
        <h1>đặng púc đình</h1>
        <h2>sở thích: chơi lỗ nhị</h2>
        <h3>quê quán: yên bái </h3>
      </div>
      <div className='about'>
        <h1>Trần kim cương</h1>
        <h2>sở thích: bắn lào</h2>
        <h3>quê quán: hưng yên</h3>
      </div>
        <div className='about'>
          <h1>Phạm Minh Hiếu</h1>
          <h2>sở thích: bida</h2>
          <h3>quê quán: hà nội</h3>
        </div>
    </div>
  );
}

export default About;
