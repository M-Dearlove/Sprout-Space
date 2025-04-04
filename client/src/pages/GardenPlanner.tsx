import React, { useState, useEffect } from 'react';
import '../styles/Gardenplanner.css';
import axios from 'axios';
import defaultPlantTypes, { Plant } from '../utils/plantData';

// Define interfaces
interface LocalPlant {
  id: string;
  name: string;
  color: string;
  width: number;
  height: number;
  spacing: number;
  sunlight: string;
  water: string;
  plantsPerSquareFoot: number; // New property to track plants per square foot
  image?: string; // Optional image URL
}

interface PlotSize {
  id: string;
  name: string;
  rows: number;
  cols: number;
}

// Perenual API plant interface
interface PerenualPlant {
  id: number;
  common_name: string;
  scientific_name: string[];
  cycle: string;
  watering: string;
  sunlight: string[];
  default_image: {
    thumbnail: string;
  } | null;
}

// Calculate plants per square foot based on spacing
const calculatePlantsPerSquareFoot = (spacing: number): number => {
  if (spacing >= 18) return 0.5; // 1 plant per 2 squares
  if (spacing >= 12) return 1;
  if (spacing >= 6) return 4;
  if (spacing >= 4) return 9;
  return 16; // 3 inches or less spacing
};

// Get API key and URL from environment variables
const PERENUAL_API_KEY = process.env.REACT_APP_PERENUAL_API_KEY || '';
const PERENUAL_API_BASE_URL = process.env.REACT_APP_PERENUAL_API_URL || 'https://perenual.com/api';

const GardenPlanner: React.FC = () => {
  // Available plot sizes
  const plotSizes: PlotSize[] = [
    { id: 'xxxs', name: 'Extra Extra Extra Small (1 x 1)', rows: 1, cols: 1 },
    { id: 'xxs', name: 'Extra Extra Small (2 x 2)', rows: 2, cols: 2 },
    { id: 'xs', name: 'Extra Small (3 x 3)', rows: 3, cols: 3 },
    { id: 'xs', name: 'Extra Small (4 x 4)', rows: 4, cols: 4 },
    { id: 'small', name: 'Small (6 x 6)', rows: 6, cols: 6 },
    { id: 'medium', name: 'Medium (10 x 10)', rows: 10, cols: 10 },
    { id: 'large', name: 'Large (12 x 12)', rows: 12, cols: 12 },

  ];
  


  // State
  const [selectedPlotSize, setSelectedPlotSize] = useState<PlotSize>(plotSizes[1]); // Default to medium
  const [garden, setGarden] = useState<(Plant | null)[][]>([]);
  const [selectedPlant, setSelectedPlant] = useState<LocalPlant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [plantTypes, setPlantTypes] = useState<LocalPlant[]>(defaultPlantTypes);
  const [searchResults, setSearchResults] = useState<LocalPlant[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  
  // Initialize garden grid when plot size changes
  useEffect(() => {
    setGarden(
      Array(selectedPlotSize.rows).fill(null).map(() => Array(selectedPlotSize.cols).fill(null))
    );
  }, [selectedPlotSize]);
  
  // Function to search for plants using Perenual API
  const searchPlants = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    // Check if API key is available
    if (!PERENUAL_API_KEY) {
      console.error('Perenual API key is missing');
      setSearchError('API key is missing. Check your environment variables.');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    
    // Log for debugging
    console.log(`Searching for: "${searchTerm}" using Perenual API`);
    console.log(`API Key: ${PERENUAL_API_KEY.substring(0, 4)}...`);
    console.log(`API Base URL: ${PERENUAL_API_BASE_URL}`);
    
    try {
      const apiUrl = `${PERENUAL_API_BASE_URL}/species-list`;
      console.log(`Full API URL: ${apiUrl}`);
      
      const response = await axios.get(apiUrl, {
        params: {
          key: PERENUAL_API_KEY,
          q: searchTerm,
          page: 1,
          page_size: 8 // Limit results for better performance
        }
      });
      
      console.log('API response status:', response.status);
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        if (response.data.data.length === 0) {
          console.log('No results found');
          setSearchError('No plants found matching your search.');
          setSearchResults([]);
        } else {
          // Convert API plants to our plant format
          const apiPlants: Plant[] = response.data.data.map((plant: PerenualPlant) => {
            // Generate a color based on plant id
            const colors = ['#ff6b6b', '#ff9f43', '#1dd1a1', '#10ac84', '#2e86de', '#f9ca24', '#6ab04c', '#eb4d4b'];
            const color = colors[plant.id % colors.length];
            
            // Default spacing (can be adjusted)
            const spacing = 12;
           
            const mappedPlant = {
              id: `api-${plant.id}`,
              name: plant.common_name,
              color: color,
              width: 1,
              height: 1,
              spacing: spacing,
              plantsPerSquareFoot: calculatePlantsPerSquareFoot(spacing), // Calculate based on spacing
              sunlight: Array.isArray(plant.sunlight) && plant.sunlight.length > 0 
                ? plant.sunlight.join(', ') 
                : 'Unknown',
              water: plant.watering || 'Unknown',
              image: 'https://cdn-icons-png.flaticon.com/128/628/628324.png' // Default plant icon
            };
            
            return mappedPlant;
          });
          
          console.log(`Found ${apiPlants.length} plants from API`);
          setSearchResults(apiPlants);
        }
      } else {
        console.error('Unexpected API response structure:', response.data);
        setSearchResults([]);
        setSearchError('Unexpected response from plant database. Please try again.');
      }
    } catch (error) {
      console.error('Error searching plants:', error);
      
      // Enhanced error logging
      if (axios.isAxiosError(error)) {
        console.error('API error details:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText
        });
        
        if (error.response?.status === 401) {
          setSearchError('API key error: Please check your Perenual API key.');
        } else if (error.response?.status === 429) {
          setSearchError('Rate limit exceeded. Please try again later.');
        } else {
          setSearchError(`Error searching plants: ${error.message}. Please try again.`);
        }
      } else {
        setSearchError('Unknown error searching plants. Please try again.');
      }
      
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    
    // If search term is empty, clear results
    if (!e.target.value.trim()) {
      setSearchResults([]);
    }
  };
  
  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchPlants();
  };
  
  // Add a plant from search results to the palette
  const addPlantToPalette = (plant: Plant) => {
    // Check if plant is already in the palette
    if (!plantTypes.some(p => p.id === plant.id)) {
      setPlantTypes([...plantTypes, plant]);
    }
    
    // Select the plant
    setSelectedPlant(plant);
    
    // Clear search results
    setSearchResults([]);
    setSearchTerm('');
  };
  
  // Handle selecting a plant
  const handlePlantSelect = (plant: Plant): void => {
    setSelectedPlant(plant);
  };
  
  // Handle placing a plant in the garden
  const handleCellClick = (rowIndex: number, colIndex: number): void => {
    if (!selectedPlant) return;
    
    // Check if space is available
    if (garden[rowIndex][colIndex]) return;
    
    // Create a new garden grid with the selected plant placed
    const newGarden = [...garden];
    newGarden[rowIndex][colIndex] = { 
      ...selectedPlant, 
      image: selectedPlant.image || '' // Ensure image is a string
    };
    setGarden(newGarden);
  };
  
  // Handle removing a plant
  const handleRemovePlant = (rowIndex: number, colIndex: number): void => {
    if (!garden[rowIndex][colIndex]) return;
    
    const newGarden = [...garden];
    newGarden[rowIndex][colIndex] = null;
    setGarden(newGarden);
  };
  
  // Clear the entire garden
  const handleClearGarden = (): void => {
    setGarden(
      Array(selectedPlotSize.rows).fill(null).map(() => Array(selectedPlotSize.cols).fill(null))
    );
  };

  // Change plot size
  const handlePlotSizeChange = (plotSizeId: string): void => {
    const newPlotSize = plotSizes.find(size => size.id === plotSizeId);
    if (newPlotSize) {
      setSelectedPlotSize(newPlotSize);
    }
  };

  // Filter plants based on local filtering (not API search)
  const filteredPlants = plantTypes.filter(plant => 
    !searchTerm || plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Print garden plan
  const handlePrintGarden = () => {
    window.print();
  };

  return (
    <div className="garden-planner">
      <h1>Square Foot Garden Planner</h1>
      <p className="intro-text">Plan your garden using 1×1 foot squares. Each square can hold different numbers of plants based on spacing requirements.</p>
      <div className="garden-layout">
        <div className="garden-controls">
          {/* Search Bar and Plot Size Selector */}
          <div className="controls-row">
            <div className="search-container">
              <form onSubmit={handleSearchSubmit} className="search-form">
                <input
                  type="text"
                  placeholder="Search plants..."
                  className="search-input"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <button 
                  type="submit" 
                  className="search-button"
                  disabled={isSearching}
                >
                  {isSearching ? "..." : "Search"}
                </button>
              </form>
              
              {/* API Key Notice */}
              {!PERENUAL_API_KEY && (
                <div className="search-error">
                  API key not found. Check your .env file.
                </div>
              )}
              
              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="search-results">
                  <h4>Search Results:</h4>
                  {searchResults.map(plant => (
                    <div 
                      key={plant.id}
                      className="search-result-item"
                      onClick={() => addPlantToPalette({ ...plant, image: plant.image || '' })}
                    >
                      <div className="result-image-container">
                        <img 
                          src={plant.image} 
                          alt={plant.name}
                          className="result-image"
                        />
                      </div>
                      <div className="result-details">
                        <div className="result-name">{plant.name}</div>
                        <div className="result-info">
                          Plants per sq ft: {plant.plantsPerSquareFoot}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {searchError && (
                <div className="search-error">{searchError}</div>
              )}
            </div>
            
            <div className="plot-size-selector">
              <label htmlFor="plotSize">Plot Size:</label>
              <select 
                id="plotSize" 
                value={selectedPlotSize.id}
                onChange={(e) => handlePlotSizeChange(e.target.value)}
                className="plot-size-select"
              >
                {plotSizes.map(size => (
                  <option key={size.id} value={size.id}>
                    {size.name}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              className="clear-button"
              onClick={handleClearGarden}
            >
              Clear Garden
            </button>
            <button
              className="print-button"
              onClick={handlePrintGarden}
            >
              Print Garden Plan
            </button>
          </div>
          
          {/* Selected Plant Info */}
          {selectedPlant && (
            <div className="selected-plant-info">
              <div className="selected-plant-header">
                <div className="selected-plant-image">
                  <img src={selectedPlant.image} alt={selectedPlant.name} />
                </div>
                <h3>Selected: {selectedPlant.name}</h3>
              </div>
              <div className="plant-quick-info">
                <span>Spacing: {selectedPlant.spacing} inches</span> | 
                <span>Plants per square foot: {selectedPlant.plantsPerSquareFoot}</span> | 
                <span>Sunlight: {selectedPlant.sunlight}</span> | 
                <span>Water: {selectedPlant.water}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Garden Grid (main content) */}
        <div className="garden-area">
          <div className="garden-title-print">
            <h3>Square Foot Garden Plan</h3>
            <p>Grid size: {selectedPlotSize.rows} × {selectedPlotSize.cols} feet</p>
          </div>
          <div className="garden-grid-container">
            <div 
              className="garden-grid" 
              data-cols={selectedPlotSize.cols}
            >
              {garden.map((row, rowIndex) => (
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="grid-cell"
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      handleRemovePlant(rowIndex, colIndex);
                    }}
                  >
                    {cell && (
                      <div
                        className="plant-in-grid"
                        style={{ 
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          textAlign: 'center'
                        }}
                      >
                        <div className="plant-image-container" style={{ position: 'relative' }}>
                          <img 
                            src={cell.image} 
                            alt={cell.name}
                            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                          />
                          <div style={{ 
                            position: 'absolute', 
                            top: '-5px', 
                            right: '-5px', 
                            backgroundColor: 'black',
                            color: 'white',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {cell.plantsPerSquareFoot}
                          </div>
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '4px' }}>
                          {cell.name}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ))}
            </div>
          </div>
          
          <div className="grid-info">
            <p>Left click to place a plant. Right click to remove.</p>
            <p>Grid size: {selectedPlotSize.rows} × {selectedPlotSize.cols} feet (Each square = 1 sq ft)</p>
          </div>
        </div>
        
        {/* Plant Selection (bottom) */}
        <div className="plant-selection-bottom">
          <div className="plant-items" style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            {filteredPlants.map((plant) => (
              <div
                key={plant.id}
                className={`plant-item ${selectedPlant?.id === plant.id ? 'plant-item-selected' : ''}`}
                style={{ 
                  backgroundColor: 'white', 
                  border: selectedPlant?.id === plant.id ? '2px solid #4CAF50' : '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '5px',
                  width: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => handlePlantSelect({ ...plant, image: plant.image || '' })}
              >
                <img 
                  src={plant.image} 
                  alt={plant.name}
                  style={{ width: '30px', height: '30px', marginBottom: '4px' }}
                />
                <span style={{ fontSize: '12px', textAlign: 'center' }}>{plant.name}</span>
                <div className="plant-per-foot" style={{ 
                  fontSize: '10px', 
                  color: '#666',
                  backgroundColor: '#f0f0f0',
                  padding: '2px 5px',
                  borderRadius: '10px',
                  marginTop: '2px'
                }}>
                  {plant.plantsPerSquareFoot} per sq ft
                </div>
              </div>
            ))}
          </div>
          
          <div className="legend">
            <h3>Legend</h3>
            <div className="legend-items" style={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              {/* Only show used plants in the legend */}
              {Array.from(new Set(garden.flat().filter(Boolean).map(plant => plant?.id)))
                .map(id => {
                  const plant = plantTypes.find(p => p.id === id);
                  if (!plant) return null;
                  
                  return (
                    <div key={plant.id} className="legend-item" style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '5px',
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}>
                      <img 
                        src={plant.image} 
                        alt={plant.name}
                        style={{ width: '25px', height: '25px', marginRight: '8px' }}
                      />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{plant.name}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {plant.plantsPerSquareFoot} plants per square foot
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
        @media print {
          .garden-controls, .search-container, .plant-selection-bottom, .clear-button, .print-button {
            display: none !important;
          }
          
          .garden-title-print {
            display: block !important;
            text-align: center;
            margin-bottom: 20px;
          }
          
          .grid-info {
            margin-top: 20px;
          }
          
          @page {
            size: landscape;
            margin: 1cm;
          }
        }
        `}
      </style>
    </div>
  );
};

export default GardenPlanner;