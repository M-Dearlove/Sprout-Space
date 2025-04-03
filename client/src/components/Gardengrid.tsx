import React from 'react';
import { GardenGrid as GardenGridType } from '../types';

interface GardenGridProps {
  garden: GardenGridType;
  rows: number;
  cols: number;
  onCellClick: (rowIndex: number, colIndex: number) => void;
  onCellRightClick: (rowIndex: number, colIndex: number) => void;
}

const GardenGrid: React.FC<GardenGridProps> = ({ 
  garden, 
  cols, 
  onCellClick, 
  onCellRightClick 
}) => {
  return (
    <div className="bg-green-100 border-2 border-green-200 rounded overflow-hidden">
      <div 
        className="grid gap-px bg-green-300" 
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {garden.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="aspect-square bg-green-100 relative cursor-pointer hover:bg-green-50 transition-colors"
              onClick={() => onCellClick(rowIndex, colIndex)}
              onContextMenu={(e: React.MouseEvent) => {
                e.preventDefault();
                onCellRightClick(rowIndex, colIndex);
              }}
            >
              {cell && (
                <div
                  className="absolute inset-1 rounded flex items-center justify-center"
                  style={{ backgroundColor: cell.color }}
                >
                  <span className="text-white text-xs font-bold">{cell.name[0]}</span>
                </div>
              )}
            </div>
          ))
        ))}
      </div>
    </div>
  );
};

export default GardenGrid;