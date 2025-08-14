import React from 'react';
import Square from './Square';

/**
 * Grid that displays squares in a specific pattern
 */
const SquareGrid = ({ squares, gridSize }) => {
  const grid = Array(gridSize * gridSize).fill(null);

  // Completely rebuilt algorithm to match the specific pattern:
  // 1. First fill a 2x2 grid: top-left, top-right, bottom-right, bottom-left
  // 2. Then add a column to the right from top to bottom
  // 3. Then add a row at the bottom from right to left
  // 4. Repeat for larger grids
  const getPositionForIndex = (index) => {
    // Define fixed positions for indices to ensure consistency
    const positions = [];
    
    // Start with a 2x2 grid
    positions.push({ row: 0, col: 0 }); // 0: Top-left
    positions.push({ row: 0, col: 1 }); // 1: Top-right
    positions.push({ row: 1, col: 1 }); // 2: Bottom-right
    positions.push({ row: 1, col: 0 }); // 3: Bottom-left
    
    // Size starts at 2
    let size = 2;
    
    // Keep adding positions until we have enough
    while (positions.length <= index) {
      // Add a column on the right (top to bottom)
      for (let row = 0; row <= size; row++) {
        positions.push({ row, col: size });
      }
      
      // Add a row at the bottom (right to left, excluding corner)
      for (let col = size - 1; col >= 0; col--) {
        positions.push({ row: size, col });
      }
      
      // Increase size for next iteration
      size++;
    }
    
    // Return the position for the requested index
    return positions[index];
  };
  
  // Place each square at its calculated position
  squares.forEach((square, index) => {
    const { row, col } = getPositionForIndex(index);
    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
      const gridIndex = row * gridSize + col;
      grid[gridIndex] = square;
    }
  });

  // Calculate fixed dimensions for the grid container
  const squareSize = 40; // px
  const gapSize = 16; // 1rem = 16px
  const totalSize = gridSize * squareSize + (gridSize - 1) * gapSize;
  
  // Since we need dynamic grid template, we need to use inline styles for grid structure
  return (
    <div className="bg-white rounded-xl shadow-xl p-8">
      <div
        className="grid-wrapper relative"
        style={{
          width: `${totalSize}px`,
          height: `${totalSize}px`,
        }}
      >
        <div
          className="grid w-full h-full"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize}, ${squareSize}px)`,
            gridTemplateRows: `repeat(${gridSize}, ${squareSize}px)`,
            gap: `${gapSize}px`,
          }}
        >
          {grid.map((sq, idx) => {
            if (sq) {
              return (
                <Square 
                  key={idx} 
                  square={sq} 
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
      </div>
    </div>
  );
};

export default SquareGrid;
