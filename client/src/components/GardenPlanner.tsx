import React, { useState, useEffect } from 'react';
import './GardenPlanner.css';
import axios from 'axios';

// Define interfaces
interface Plant {
  id: string;
  name: string;
  color: string;
  width: number;
  height: number;
  spacing: number;
  sunlight: string;
  water: string;
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

// Get API key and URL from environment variables
const PERENUAL_API_KEY = process.env.REACT_APP_PERENUAL_API_KEY || '';
const PERENUAL_API_BASE_URL = process.env.REACT_APP_PERENUAL_API_URL || 'https://perenual.com/api';

const GardenPlanner: React.FC = () => {
  // Available plot sizes
  const plotSizes: PlotSize[] = [
    { id: 'small', name: 'Small (6 x 6)', rows: 6, cols: 6 },
    { id: 'medium', name: 'Medium (10 x 10)', rows: 10, cols: 10 },
    { id: 'large', name: 'Large (12 x 12)', rows: 12, cols: 12 },
    { id: 'xl', name: 'Extra Large (15 x 15)', rows: 15, cols: 15 },
    { id: 'custom1', name: 'Rectangular (8 x 12)', rows: 8, cols: 12 },
    { id: 'custom2', name: 'Rectangular (12 x 8)', rows: 12, cols: 8 },
  ];
  
  // Default plant types
  const defaultPlantTypes: Plant[] = [
    { id: 'tomato', name: 'Tomato', color: '#e77c7c', width: 1, height: 1, spacing: 2, sunlight: 'Full sun', water: 'Regular' },
    { id: 'carrot', name: 'Carrot', color: '#e9a978', width: 1, height: 1, spacing: 1, sunlight: 'Full sun', water: 'Moderate' },
    { id: 'lettuce', name: 'Lettuce', color: '#8dd8b9', width: 1, height: 1, spacing: 1, sunlight: 'Partial shade', water: 'Regular' },
    { id: 'cucumber', name: 'Cucumber', color: '#78c2a4', width: 1, height: 1, spacing: 2, sunlight: 'Full sun', water: 'Regular' },
    { id: 'zucchini', name: 'Zucchini', color: '#7fb3da', width: 2, height: 2, spacing: 3, sunlight: 'Full sun', water: 'Regular' },
    { id: 'sunflower', name: 'Sunflower', color: '#ecd279', width: 1, height: 1, spacing: 2, sunlight: 'Full sun', water: 'Moderate' },
    { id: 'basil', name: 'Basil', color: '#97c283', width: 1, height: 1, spacing: 1, sunlight: 'Partial shade', water: 'Moderate' },
    { id: 'pepper', name: 'Pepper', color: '#e28b89', width: 1, height: 1, spacing: 2, sunlight: 'Full sun', water: 'Moderate' },
    
    // Additional vegetables
    { id: 'broccoli', name: 'Broccoli', color: '#89bb9e', width: 1, height: 1, spacing: 2, sunlight: 'Full sun', water: 'Regular' },
    { id: 'cauliflower', name: 'Cauliflower', color: '#e0e0e0', width: 1, height: 1, spacing: 2, sunlight: 'Full sun', water: 'Regular' },
    { id: 'onion', name: 'Onion', color: '#b8c4d0', width: 1, height: 1, spacing: 1, sunlight: 'Full sun', water: 'Moderate' },
    { id: 'garlic', name: 'Garlic', color: '#d5d8dd', width: 1, height: 1, spacing: 1, sunlight: 'Full sun', water: 'Low' },
    { id: 'potato', name: 'Potato', color: '#c4b396', width: 1, height: 1, spacing: 2, sunlight: 'Full sun', water: 'Moderate' },
    { id: 'sweetPotato', name: 'Sweet Potato', color: '#d49c82', width: 1, height: 1, spacing: 2, sunlight: 'Full sun', water: 'Moderate' },
    { id: 'pumpkin', name: 'Pumpkin', color: '#e2a173', width: 3, height: 3, spacing: 4, sunlight: 'Full sun', water: 'Regular' },
    { id: 'corn', name: 'Corn', color: '#e6d7a1', width: 1, height: 1, spacing: 2, sunlight: 'Full sun', water: 'Regular' },
    
    // Leafy greens
    { id: 'spinach', name: 'Spinach', color: '#a1d6a1', width: 1, height: 1, spacing: 1, sunlight: 'Partial shade', water: 'Regular' },
    { id: 'kale', name: 'Kale', color: '#9cb6da', width: 1, height: 1, spacing: 1, sunlight: 'Full sun', water: 'Regular' },
    { id: 'swissChard', name: 'Swiss Chard', color: '#a1b5c4', width: 1, height: 1, spacing: 1, sunlight: 'Partial shade', water: 'Regular' },
    { id: 'arugula', name: 'Arugula', color: '#a7d8ad', width: 1, height: 1, spacing: 1, sunlight: 'Partial shade', water: 'Regular' },
    
    // Beans and peas
    { id: 'greenBean', name: 'Green Bean', color: '#77b580', width: 1, height: 2, spacing: 1, sunlight: 'Full sun', water: 'Moderate' },
    { id: 'pea', name: 'Pea', color: '#b6cf9b', width: 1, height: 2, spacing: 1, sunlight: 'Partial shade', water: 'Moderate' },
    { id: 'lima', name: 'Lima Bean', color: '#d8e0a3', width: 1, height: 1, spacing: 2, sunlight: 'Full sun', water: 'Moderate' },
    
    // Root vegetables
    { id: 'radish', name: 'Radish', color: '#d99a9a', width: 1, height: 1, spacing: 1, sunlight: 'Partial shade', water: 'Regular' },
    { id: 'turnip', name: 'Turnip', color: '#d0d5dd', width: 1, height: 1, spacing: 1, sunlight: 'Full sun', water: 'Regular' },
    { id: 'beet', name: 'Beet', color: '#b793c1', width: 1, height: 1, spacing: 1, sunlight: 'Full sun', water: 'Regular' },
    { id: 'parsnip', name: 'Parsnip', color: '#e7e7e0', width: 1, height: 1, spacing: 1, sunlight: 'Full sun', water: 'Regular' },
    
    // Herbs
    { id: 'cilantro', name: 'Cilantro', color: '#a6d0b1', width: 1, height: 1, spacing: 1, sunlight: 'Partial shade', water: 'Moderate' },
    { id: 'mint', name: 'Mint', color: '#c1dbae', width: 1, height: 1, spacing: 2, sunlight: 'Partial shade', water: 'Regular' },
    { id: 'rosemary', name: 'Rosemary', color: '#a3afb9', width: 1, height: 1, spacing: 2, sunlight: 'Full sun', water: 'Low' },
    { id: 'thyme', name: 'Thyme', color: '#b4c2cc', width: 1, height: 1, spacing: 1, sunlight: 'Full sun', water: 'Low' },
    { id: 'oregano', name: 'Oregano', color: '#a6b0b1', width: 1, height: 1, spacing: 1, sunlight: 'Full sun', water: 'Low' },
    
    // Flowers and companion plants
    { id: 'marigold', name: 'Marigold', color: '#e6c187', width: 1, height: 1, spacing: 1, sunlight: 'Full sun', water: 'Moderate' },
    { id: 'nasturtium', name: 'Nasturtium', color: '#e0a989', width: 1, height: 1, spacing: 1, sunlight: 'Full sun', water: 'Moderate' },
    { id: 'lavender', name: 'Lavender', color: '#bba6d7', width: 1, height: 1, spacing: 2, sunlight: 'Full sun', water: 'Low' },
    { id: 'chamomile', name: 'Chamomile', color: '#e9e2c0', width: 1, height: 1, spacing: 1, sunlight: 'Partial shade', water: 'Moderate' },
    
    // Fruits
    { id: 'strawberry', name: 'Strawberry', color: '#da9197', width: 1, height: 1, spacing: 1, sunlight: 'Full sun', water: 'Regular' },
    { id: 'blackberry', name: 'Blackberry', color: '#7c8591', width: 1, height: 2, spacing: 3, sunlight: 'Full sun', water: 'Regular' },
    { id: 'raspberry', name: 'Raspberry', color: '#d7a0af', width: 1, height: 2, spacing: 3, sunlight: 'Full sun', water: 'Regular' },
    { id: 'melon', name: 'Melon', color: '#a8d9b7', width: 2, height: 2, spacing: 3, sunlight: 'Full sun', water: 'Regular' },
    { id: 'blueberry', name: 'Blueberry', color: '#90a1d6', width: 1, height: 2, spacing: 3, sunlight: 'Full sun', water: 'Regular' },
  ];
  // State
  const [selectedPlotSize, setSelectedPlotSize] = useState<PlotSize>(plotSizes[1]); // Default to medium
  const [garden, setGarden] = useState<(Plant | null)[][]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [plantTypes, setPlantTypes] = useState<Plant[]>(defaultPlantTypes);
  const [searchResults, setSearchResults] = useState<Plant[]>([]);
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
            
            const mappedPlant = {
              id: `api-${plant.id}`,
              name: plant.common_name,
              color: color,
              width: 1,
              height: 1,
              spacing: 2, // Default spacing
              sunlight: Array.isArray(plant.sunlight) && plant.sunlight.length > 0 
                ? plant.sunlight.join(', ') 
                : 'Unknown',
              water: plant.watering || 'Unknown'
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
    newGarden[rowIndex][colIndex] = { ...selectedPlant };
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

  return (
    <div className="garden-planner">
      <h1>Garden Planner</h1>
      
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
                      onClick={() => addPlantToPalette(plant)}
                    >
                      <div 
                        className="result-color" 
                        style={{ backgroundColor: plant.color }}
                      ></div>
                      <div className="result-details">
                        <div className="result-name">{plant.name}</div>
                        <div className="result-info">
                          Water: {plant.water}, Sunlight: {plant.sunlight}
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
          </div>
          
          {/* Selected Plant Info */}
          {selectedPlant && (
            <div className="selected-plant-info">
              <h3>Selected: {selectedPlant.name}</h3>
              <div className="plant-quick-info">
                <span>Spacing: {selectedPlant.spacing} ft</span> | 
                <span>Sunlight: {selectedPlant.sunlight}</span> | 
                <span>Water: {selectedPlant.water}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Garden Grid (main content) */}
        <div className="garden-area">
          <div className="garden-grid-container">
            <div 
              className="garden-grid" 
              style={{ 
                gridTemplateColumns: `repeat(${selectedPlotSize.cols}, 1fr)`,
                maxWidth: `${Math.min(800, selectedPlotSize.cols * 50)}px` 
              }}
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
                        style={{ backgroundColor: cell.color }}
                      >
                        <span>{cell.name[0]}</span>
                      </div>
                    )}
                  </div>
                ))
              ))}
            </div>
          </div>
          
          <div className="grid-info">
            <p>Left click to place a plant. Right click to remove.</p>
            <p>Grid size: {selectedPlotSize.rows} x {selectedPlotSize.cols} feet</p>
          </div>
        </div>
        
        {/* Plant Selection (bottom) */}
        <div className="plant-selection-bottom">
          <div className="plant-items">
            {filteredPlants.map((plant) => (
              <div
                key={plant.id}
                className={`plant-item ${selectedPlant?.id === plant.id ? 'plant-item-selected' : ''}`}
                style={{ backgroundColor: plant.color }}
                onClick={() => handlePlantSelect(plant)}
              >
                <span>{plant.name}</span>
              </div>
            ))}
          </div>
          
          <div className="legend">
            <h3>Legend</h3>
            <div className="legend-items">
              {plantTypes.map((plant) => (
                <div key={plant.id} className="legend-item">
                  <div 
                    className="legend-color" 
                    style={{ backgroundColor: plant.color }}
                  ></div>
                  <span>{plant.name} (spacing: {plant.spacing}')</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GardenPlanner;