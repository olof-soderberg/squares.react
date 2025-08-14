import React from 'react';

/**
 * Single square component
 */
const Square = ({ square, position }) => {
  const squareColor = square.color || square.Color || '#ff0000';
  
  return (
    <div
      className={`w-10 h-10 rounded-md shadow-md border border-gray-300`}
      style={{ 
        backgroundColor: squareColor,
        width: '40px',
        height: '40px'
      }}
    >
    </div>
  );
};

export default Square;
