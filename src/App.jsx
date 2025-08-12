import React, { useEffect, useState, useRef } from "react";
import './App.css'

function getGridSize(n) {
  // Find the smallest square grid that can fit n squares
  return Math.ceil(Math.sqrt(n));
}

function App() {
  const [squares, setSquares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [newSquares, setNewSquares] = useState([]);
  // Use a ref to track the abort controller so we can replace it if needed
  const abortControllerRef = useRef(new AbortController());
  
  // Effect to highlight new squares briefly
  useEffect(() => {
    if (squares.length > 0) {
      // Get last square
      const lastIndex = squares.length - 1;
      setNewSquares(prev => [...prev, lastIndex]);
      
      // Remove highlight after animation
      const timer = setTimeout(() => {
        setNewSquares(prev => prev.filter(idx => idx !== lastIndex));
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [squares.length]);
  
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    fetch("http://localhost:5272/squares", {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (isMounted) {
          setSquares(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(`Error fetching squares: ${err.message}`);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading && squares.length === 0) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  // Function to add a new square and refresh the stream
  const addNewSquare = async () => {
    setAdding(true);
    setProcessing(true);
    let timeoutId;
    try {
      console.log("Adding new square...");
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 7000); // 7 second timeout
      const response = await fetch("http://localhost:5272/squares", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newSquareResponse = await response.json();
      if (newSquareResponse) {
        setSquares(currentSquares => [...currentSquares, newSquareResponse]);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setError("Request timed out. The server might be overloaded or unavailable.");
      } else {
        setError(`Error adding new square: ${err.message}`);
      }
    } finally {
      setProcessing(false);
      setAdding(false);
    }
  };

  // Function to clear all squares
  const clearAllSquares = async () => {
    setProcessing(true);
    try {
      console.log("Clearing all squares...");
      const response = await fetch("http://localhost:5272/squares", {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Clear squares from state
      setSquares([]);
      setNewSquares([]);
    } catch (err) {
      setError(`Error clearing squares: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const gridSize = getGridSize(squares.length);
  const grid = Array(gridSize * gridSize).fill(null);

  // Place squares in a specific pattern:
  // 1. Fill the complete inner square first (e.g., 2x2, 3x3)
  // 2. Then fill rightmost column top-to-bottom
  // 3. Finally fill bottom row right-to-left
  let placed = 0;
  
  // Calculate the size of the inner complete square
  const innerSquareSize = Math.floor(Math.sqrt(squares.length));
  
  // 1. Fill the inner square (left to right, top to bottom)
  for (let row = 0; row < innerSquareSize && placed < squares.length; row++) {
    for (let col = 0; col < innerSquareSize && placed < squares.length; col++) {
      const gridIndex = row * gridSize + col;
      grid[gridIndex] = squares[placed];
      placed++;
    }
  }
  
  // 2. Fill rightmost column (top to bottom, excluding any cells that are part of the inner square)
  for (let row = 0; row < gridSize && placed < squares.length; row++) {
    const col = gridSize - 1;
    // Skip if this cell is already part of the inner square
    if (row < innerSquareSize && col < innerSquareSize) continue;
    const gridIndex = row * gridSize + col;
    grid[gridIndex] = squares[placed];
    placed++;
  }
  
  // 3. Fill bottom row (right to left, excluding rightmost cell which was already filled)
  for (let col = gridSize - 2; col >= 0 && placed < squares.length; col--) {
    const row = gridSize - 1;
    // Skip if this cell is already part of the inner square
    if (row < innerSquareSize && col < innerSquareSize) continue;
    const gridIndex = row * gridSize + col;
    grid[gridIndex] = squares[placed];
    placed++;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* Processing notification */}
      {(processing || adding) && (
        <div className="fixed top-0 left-0 w-full bg-opacity-90 p-3 flex items-center justify-center z-50 transition-all duration-300 ease-in-out shadow-md"
             style={{ backgroundColor: processing ? '#FEF3C7' : '#D1FAE5' }}>
          <div className="flex items-center">
            <svg className="animate-spin h-5 w-5 mr-2" 
                 style={{ color: processing ? '#D97706' : '#059669' }}
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span style={{ color: processing ? '#92400E' : '#065F46' }}>
              {processing ? "Processing request..." : "Adding new square..."}
            </span>
          </div>
        </div>
      )}
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
        <div className="mt-3 flex space-x-3">
          <button 
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            onClick={() => window.location.reload()}
          >
            Reload App
          </button>
          
          <button 
            className={`px-3 py-1 text-white rounded text-sm flex items-center ${
              adding || streaming ? 
              'bg-gray-400 cursor-not-allowed' : 
              'bg-green-500 hover:bg-green-600'
            }`}
            onClick={addNewSquare}
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
            onClick={clearAllSquares}
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
      </div>
      
      {/* Grid layout of squares */}
      <div
        className="grid gap-2"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, 40px)`,
          gridTemplateRows: `repeat(${gridSize}, 40px)`,
        }}
      >
        {grid.map((sq, idx) => {
          // Find if this is a new square by matching its Position
          const isNew = newSquares.includes(squares.findIndex(sq => {
            const pos = sq.Position ?? sq.position ?? sq.position;
            return pos === idx;
          }));

          if (sq) {
            console.log(`Rendering square at position ${idx}:`, sq);
            const squareColor = sq.color || sq.Color || '#ff0000';
            console.log(`Using color: ${squareColor}`);
            return (
              <div
                key={idx}
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
          } 
          else {
            return (
              <div 
                //key={idx} 
                //className="w-10 h-10 bg-gray-300 rounded opacity-30 border-2 border-black"
              >
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

export default App
