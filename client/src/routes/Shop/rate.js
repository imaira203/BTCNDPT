import React, { useState, useEffect } from 'react';

const Rating = ({ productId, currentRating, onRate }) => {
  const [rating, setRating] = useState(currentRating || 0);

  const handleRating = (newRating) => {
    setRating(newRating);
    onRate(newRating);
  };

  return (
    <div className="rating">
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={index < rating ? 'active' : ''}
          onClick={() => handleRating(index + 1)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default Rating;
