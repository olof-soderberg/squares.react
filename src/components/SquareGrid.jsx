import React, { useMemo } from 'react';
import Square from './Square';

const SquareGrid = ({ squares, gridSize }) => {
 
  const grid = useMemo(() => {
    const gridArray = Array(gridSize * gridSize).fill(null);

    const getPositionForIndex = (index) => {
      const positions = [];
      
      positions.push({ row: 0, col: 0 }); // 0: Top-left
      positions.push({ row: 0, col: 1 }); // 1: Top-right
      positions.push({ row: 1, col: 1 }); // 2: Bottom-right
      positions.push({ row: 1, col: 0 }); // 3: Bottom-left
      
      let size = 2;
      
      while (positions.length <= index) {
        // Add a column on the right (top to bottom)
        for (let row = 0; row <= size; row++) {
          positions.push({ row, col: size });
        }
        
        // Add a row at the bottom (right to left, excluding corner)
        for (let col = size - 1; col >= 0; col--) {
          positions.push({ row: size, col });
        }
        
        size++;
      }
      
      return positions[index];
    };
    
    squares.forEach((square, index) => {
      const { row, col } = getPositionForIndex(index);
      if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
        const gridIndex = row * gridSize + col;
        gridArray[gridIndex] = square;
      }
    });
    
    return gridArray;
  }, [squares, gridSize]); 

  const squareSize = 40; 
  const gapSize = 16; 
  const totalSize = gridSize * squareSize + (gridSize - 1) * gapSize;
  
  return (
    <div className="bg-emerald-100 rounded-xl shadow-xl p-8">
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
