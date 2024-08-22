import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./about.css"

function About() {
  useEffect(() => {
    document.title = 'Fashion - About Us';
  }, []);

  return (
    <div>
      <h1 className='h1'>Meet our team</h1>
      <div className='member'>
        <div className='o'>
          <img alt='c' width='210px' height='210px' src='https://scontent.fhan9-1.fna.fbcdn.net/v/t39.30808-1/442384348_1157413532173057_6256722979044235522_n.jpg?stp=dst-jpg_s200x200&_nc_cat=108&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeFAlxGkIJIb1KEiZ_sM9vK1F0LVKXUfV68XQtUpdR9XrwI-7cgaXsO2Cgh5h8WlL0ALxJfIqXlE-WOaF2n1Yyju&_nc_ohc=AhjLYQUYvCIQ7kNvgG8D6fZ&_nc_ht=scontent.fhan9-1.fna&oh=00_AYDcaaT4KiV29wQXC0NORYJ5qQ85g7BSE_wpqLIP3TDjdQ&oe=66CCD490'></img>
          <div className='Name'>Trần Kim Cương</div>
          <div className='class'>DCCNTT.14.C.2</div>
          <div className='class'>MSV: 20231192</div>
          <div className='class'>Quê Quán: Hải Dương</div>
          <div className='class'>Sở Thích: Nghe Nhạc</div>
        </div>
        <div className='o'>
          <img alt='c' width='210px' height='210px' src='https://scontent.fhan9-1.fna.fbcdn.net/v/t39.30808-1/440855620_2186056375089623_1063488146053937985_n.jpg?stp=dst-jpg_s200x200&_nc_cat=111&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeH6ZxLb_X2Rm1DwwqbHKQ8dMVPgU7HIZmIxU-BTschmYoh8w_Pfjcr8RfdYCcrxwigPwDGTOcTWpv9iqAD-IodU&_nc_ohc=osLGYB_aPe0Q7kNvgFZYxVt&_nc_ht=scontent.fhan9-1.fna&oh=00_AYDGbOpVRQq9rFgwWsv3Po9VgoRGr8PeZYsFK6mQNJIdlw&oe=66CCE7F8'></img>
          <div className='Name'>Phạm Minh Hiếu</div>
          <div className='class'>DCCNTT.14.C.2</div>
          <div className='class'>MSV: 20230957</div>
          <div className='class'>Quê Quán: Hà Nội</div>
          <div className='class'>Sở Thích: Nghe Nhạc</div>
        </div>
        <div className='o'>
          <img alt='c' width='210px' height='210px' src='https://i.pinimg.com/280x280_RS/08/84/1c/08841cfb2f636e49c21308142283b92d.jpg'></img>
          <div className='Name'>Đặng Phúc Đình</div>
          <div className='class'>DCCNTT.14.C.2</div>
          <div className='class'>MSV: 20231011</div>
          <div className='class'>Quê Quán: Yên Bái</div>
          <div className='class'>Sở Thích: Chơi Game</div>
        </div>
        <div className='o'>
          <img alt='c' width='210px' height='210px' src='https://i.pinimg.com/236x/c7/e1/47/c7e14763c312bded135d0dc641ebfe0e.jpg'></img>
          <div className='Name'>Đoàn Duy Đường</div>
          <div className='class'>DCCNTT.14.C.2</div>
          <div className='class'>MSV: 20232092</div>
          <div className='class'>Quê Quán: Nam Định</div>
          <div className='class'>Sở Thích: Cơm Rang</div>
        </div>
        <div className='o'>
          <img alt='c' width='210px' height='210px' src='https://scontent.fhan9-1.fna.fbcdn.net/v/t39.30808-1/433434940_1139718774052352_447519630374635713_n.jpg?stp=dst-jpg_s200x200&_nc_cat=109&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeGgAvxpQRP08O45IMGhzfaD4QTEwXSoWkrhBMTBdKhaSpath8mdsIjgm9AdbeX3uhb9_UtpJOtuQr5wTqLIsrsu&_nc_ohc=oW-AgC2J5jkQ7kNvgGhKt8n&_nc_ht=scontent.fhan9-1.fna&oh=00_AYDkgbVqvP0H0sZmjy97w-WTUEa0dUB69heLp95c83hjQg&oe=66CCD76E'></img>
          <div className='Name'>Trần Quang Huy</div>
          <div className='class'>DCCNTT.14.C.2</div>
          <div className='class'>MSV: 20231338</div>
          <div className='class'>Quê Quán: Thanh Hoá</div>
          <div className='class'>Sở Thích: Đá Bóng</div>
        </div>
      </div>
    </div>
  );
}

export default About;
