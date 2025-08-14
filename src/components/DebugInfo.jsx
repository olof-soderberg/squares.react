import React from 'react';

/**
 * Debug information component
 */
const DebugInfo = ({ squares, gridSize, streaming, children }) => {
  return (
    <div className="mb-4 p-4 bg-gray-200 rounded">
      <h3 className="text-lg font-bold">Debug Info:</h3>
      <p>Squares count: {squares.length}</p>
      <p>Grid size: {gridSize}x{gridSize}</p>
      
      {streaming && (
        <div className="mt-2 flex items-center text-blue-600">
          <svg className="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Streaming squares in real-time...</span>
        </div>
      )}
      
      {squares.length > 0 && (
        <div className="mt-2">
          <p className="font-semibold">First square:</p>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(squares[0], null, 2)}
          </pre>
        </div>
      )}
      
      {children}
    </div>
  );
};

export default DebugInfo;
