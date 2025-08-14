import React from 'react';
import Square from './Square';

/**
 * Grid that displays squares in a specific pattern
 */
const SquareGrid = ({ squares, newSquares, gridSize }) => {
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
        const isNew = newSquares.includes(squares.findIndex(square => {
          const pos = square.Position ?? square.position ?? square.position;
          return pos === idx;
        }));

        if (sq) {
          return (
            <Square 
              key={idx} 
              square={sq} 
              isNew={isNew}
              position={idx}
            />
          );
        } 
        else {
          return (
            <div key={idx}></div>
          );
        }
      })}
    </div>
  );
};

export default SquareGrid;
