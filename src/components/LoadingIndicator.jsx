import React from 'react';

/**
 * Processing/Loading indicator component
 */
const LoadingIndicator = ({ processing, adding }) => {
  if (!processing && !adding) return null;
  
  return (
    <div 
      className="fixed top-0 left-0 w-full bg-opacity-90 p-3 flex items-center justify-center z-50 transition-all duration-300 ease-in-out shadow-md"
      style={{ backgroundColor: processing ? '#FEF3C7' : '#D1FAE5' }}
    >
      <div className="flex items-center">
        <svg 
          className="animate-spin h-5 w-5 mr-2" 
          style={{ color: processing ? '#D97706' : '#059669' }}
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span style={{ color: processing ? '#92400E' : '#065F46' }}>
          {processing ? "Processing request..." : "Adding new square..."}
        </span>
      </div>
    </div>
  );
};

export default LoadingIndicator;
