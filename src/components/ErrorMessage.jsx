import React from 'react';

/**
 * Error message component
 */
const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-red-500 mb-4">{message}</p>
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  );
};

export default ErrorMessage;
