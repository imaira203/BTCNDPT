import React from 'react';

const ProductDetails = ({ product }) => {
  return (
    <div className='product-details'>
        <div className='product-name'>{product.name}</div>
        <Rating 
            productId={product.id} 
            currentRating={product.rating} 
            onRate={(newRating) => handleRateProduct(product.id, newRating)}
        />
        <div className='first-price'>{product.firstPrice}</div>
        <div className='last-price'>{product.lastPrice}</div>
        <div className='vote'>VOTE</div>
    </div>
  );
};

export default ProductDetails;
