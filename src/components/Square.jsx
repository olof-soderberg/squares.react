import React from 'react';

/**
 * Single square component
 */
const Square = ({ square, isNew, position }) => {
  const squareColor = square.color || square.Color || '#ff0000';
  
  return (
    <div
      className={`w-10 h-10 rounded shadow ${isNew ? 'animate-pulse border-yellow-500' : 'border-black'} transition-all duration-500`}
      style={{ 
        backgroundColor: squareColor,
        width: '40px',
        height: '40px',
        boxShadow: isNew ? '0 0 10px gold' : ''
      }}
    >
    </div>
  );
};

export default Square;
