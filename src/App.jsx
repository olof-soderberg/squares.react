import React, { useEffect, useState, useRef } from "react";
import './App.css';
import SquareGrid from './components/SquareGrid';
import Controls from './components/Controls';
import DebugInfo from './components/DebugInfo';
import LoadingIndicator from './components/LoadingIndicator';
import ErrorMessage from './components/ErrorMessage';

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
    return (
      <div className="flex items-center justify-center h-screen">Loading...</div>
    );
  }
  
  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <LoadingIndicator processing={processing} adding={adding} />
      
      <DebugInfo squares={squares} gridSize={gridSize} streaming={streaming}>
        <Controls 
          onAddSquare={addNewSquare} 
          onClearSquares={clearAllSquares} 
          adding={adding}
          streaming={streaming}
          processing={processing}
          onReload={() => window.location.reload()}
        />
      </DebugInfo>
      
      <SquareGrid 
        squares={squares} 
        newSquares={newSquares} 
        gridSize={gridSize} 
      />
    </div>
  );
}

export default App
