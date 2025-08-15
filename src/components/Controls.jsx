import React from 'react';

const Controls = ({ onAddSquare, onClearSquares, adding, processing, onReload }) => {
  return (
    <div className="mt-8 mb-12 flex flex-wrap gap-4 justify-center">
      {/* Orange Button for Reload - Flowbite style */}
      <button 
        className="text-white bg-orange-700 hover:bg-orange-800 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none transition-colors duration-150"
        onClick={onReload}
      >
        Reload App
      </button>
      
      {/* Green Button for Add - Flowbite style */}
      <button 
        className={`font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none transition-colors duration-150 ${
          adding ? 
          'bg-gray-300 text-gray-600 cursor-not-allowed' : 
          'text-white bg-green-700 hover:bg-green-800'
        }`}
        onClick={onAddSquare}
        disabled={adding}
      >
        {adding ? "Adding Square..." : "Add New Square"}
      </button>
      
      {/* Red Button for Clear - Flowbite style */}
      <button 
        className={`font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none transition-colors duration-150 ${
          processing ? 
          'bg-gray-300 text-gray-600 cursor-not-allowed' : 
          'text-white bg-red-700 hover:bg-red-800'
        }`}
        onClick={onClearSquares}
        disabled={processing}
      >
        {processing ? "Processing..." : "Clear All Squares"}
      </button>
    </div>
  );
};

export default Controls;
