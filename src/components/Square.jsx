import React, { memo } from 'react';

/**
 * Single square component
 */
const Square = memo(({ square, position }) => {
  const squareColor = square.color || square.Color || '#ff0000';
  
  return (
    <div
      className="w-10 h-10 rounded-lg shadow-lg border border-gray-400 transform hover:scale-110 transition-transform duration-200"
      style={{ 
        backgroundColor: squareColor
      }}
    >
    </div>
  );
});

export default Square;
