import React, { useEffect, useState, useRef } from "react";
import './App.css';
import SquareGrid from './components/SquareGrid';
import Controls from './components/Controls';
import ErrorMessage from './components/ErrorMessage';
import { handleApiError, formatError } from './utils/errorHandling';

const API_URL = import.meta.env.VITE_API_URL;

function getGridSize(n) {
  // Find the smallest square grid that can fit n squares
  // Add 1 to reduce frequency of grid resizing
  return Math.max(2, Math.ceil(Math.sqrt(n + 1)));
}

function App() {
  const [squares, setSquares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(new AbortController());
  
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
  fetch(`${API_URL}/squares`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, application/problem+json',
        'Content-Type': 'application/json'
      }
    })
      .then(async response => {
        if (!response.ok) {
          const errorDetails = await handleApiError(response);
          throw errorDetails;
        }
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
          setError(formatError(err));
          setLoading(false);
          console.error('Error fetching squares:', err);
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
    return <ErrorMessage error={error} onRetry={() => window.location.reload()} />;
  }

  const addNewSquare = async () => {
    setAdding(true);
    setProcessing(true);
    let timeoutId;
    try {
      console.log("Adding new square...");
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 10000);
  const response = await fetch(`${API_URL}/squares`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json, application/problem+json',
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorDetails = await handleApiError(response);
        throw errorDetails;
      }
      
      const newSquareResponse = await response.json();
      if (newSquareResponse) {
        setSquares(currentSquares => [...currentSquares, newSquareResponse]);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      setError(formatError(err));
      console.error('Error adding new square:', err);
    } finally {
      setProcessing(false);
      setAdding(false);
    }
  };

  const clearAllSquares = async () => {
    setProcessing(true);
    try {
      console.log("Clearing all squares...");
  const response = await fetch(`${API_URL}/squares`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json, application/problem+json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorDetails = await handleApiError(response);
        throw errorDetails;
      }
      
      setSquares([]);
    } catch (err) {
      setError(formatError(err));
      console.error('Error clearing squares:', err);
    } finally {
      setProcessing(false);
    }
  };

  const gridSize = getGridSize(squares.length);

  return (
    <div className="min-h-screen flex flex-col items-center bg-orange-200 pt-8">
      <div className="mb-6">
        <Controls 
          onAddSquare={addNewSquare} 
          onClearSquares={clearAllSquares} 
          adding={adding}
          processing={processing}
          onReload={() => window.location.reload()}
        />
      </div>
      
      <div className="grid-container">
        <SquareGrid 
          squares={squares} 
          gridSize={gridSize} 
        />
      </div>
    </div>
  );
}

export default App
