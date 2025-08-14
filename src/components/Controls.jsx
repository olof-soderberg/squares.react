import React from 'react';

/**
 * Control buttons for application actions
 */
const Controls = ({ onAddSquare, onClearSquares, adding, streaming, processing, onReload }) => {
  return (
    <div className="mt-3 flex space-x-3">
      <button 
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        onClick={onReload}
      >
        Reload App
      </button>
      
      <button 
        className={`px-3 py-1 text-white rounded text-sm flex items-center ${
          adding || streaming ? 
          'bg-gray-400 cursor-not-allowed' : 
          'bg-green-500 hover:bg-green-600'
        }`}
        onClick={onAddSquare}
        disabled={adding || streaming}
      >
        {adding ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Adding Square...
          </>
        ) : "Add New Square"}
      </button>
      
      <button 
        className={`px-3 py-1 text-white rounded text-sm flex items-center ${
          processing ? 
          'bg-gray-400 cursor-not-allowed' : 
          'bg-red-500 hover:bg-red-600'
        }`}
        onClick={onClearSquares}
        disabled={processing}
      >
        {processing ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : "Clear All Squares"}
      </button>
    </div>
  );
};

export default Controls;
