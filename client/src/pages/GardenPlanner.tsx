import PlantCarePanel from '../components/PlantCarePanel';
import React, { useState, useEffect } from 'react';
import '../styles/Gardenplanner.css';
//import defaultPlantTypes, { Plant } from '../utils/plantData';
import { useQuery, useMutation } from '@apollo/client';
import { SAVE_GARDEN_MUTATION } from '../graphQL/mutations';
import { SEARCH_PLANTS_QUERY, GET_GARDEN_BY_ID, GET_ALL_PLANTS } from '../graphQL/queries';
import { useLocation } from 'react-router-dom';


import '../styles/Gardensave.css'

//Define interfaces
// interface LocalPlant {
//   id: string;
//   name: string;
//   color: string;
//   width: number;
//   height: number;
//   spacing: number;
//   sunlight: string;
//   water: string;
//   plantsPerSquareFoot: number;
//   image?: string;
// }
interface DBPlant {
  _id: string;
  plantName: string;
  plantType: string;
  plantDescription: string;
  plantImage: string;
  plantWatering: string;
  plantLight: string;
  plantSoil: string;
  plantFertilizer: string;
  plantHumidity: string;
  plantTemperature: string;
  plantToxicity: string;
  plantPests: string;
  plantDiseases: string;
  spacing: number;
  plantsPerSquareFoot: number;
  color: string;
}

interface Plant {
  id: string;
  name: string;
  color: string;
  width: number;
  height: number;
  spacing: number;
  sunlight: string;
  water: string;
  plantsPerSquareFoot: number;
  image?: string;
}

interface PlotSize {
  id: string;
  name: string;
  rows: number;
  cols: number;
}


// Calculate plants per square foot based on spacing
const calculatePlantsPerSquareFoot = (spacing: number): number => {
  if (spacing >= 18) return 0.25; // 1 plant per 4 squares
  if (spacing >= 12) return 1;
  if (spacing >= 6) return 4;
  if (spacing >= 4) return 9;
  return 16; // 3 inches or less spacing
};

// Convert database plant to local plant format
const convertDbPlantToLocalPlant = (dbPlant: DBPlant): Plant => {
  return {
    id: dbPlant._id,
    name: dbPlant.plantName,
    color: dbPlant.color,
    width: 1,
    height: 1,
    spacing: dbPlant.spacing,
    sunlight: dbPlant.plantLight,
    water: dbPlant.plantWatering,
    plantsPerSquareFoot: dbPlant.plantsPerSquareFoot,
    image: dbPlant.plantImage
  };
};



const GardenPlanner: React.FC = () => {
  // Available plot sizes
  const plotSizes: PlotSize[] = [
    { id: 'xxxs', name: 'Extra Extra Extra Small (1 x 1)', rows: 1, cols: 1 },
    { id: 'xxs', name: 'Extra Extra Small (2 x 2)', rows: 2, cols: 2 },
    { id: 'xs1', name: 'Extra Small (3 x 3)', rows: 3, cols: 3 },
    { id: 'xs2', name: 'Extra Small (4 x 4)', rows: 4, cols: 4 },
    { id: 'small', name: 'Small (6 x 6)', rows: 6, cols: 6 },
    { id: 'medium', name: 'Medium (10 x 10)', rows: 10, cols: 10 },
    { id: 'large', name: 'Large (12 x 12)', rows: 12, cols: 12 },
  ];

  // State
  const [selectedPlotSize, setSelectedPlotSize] = useState<PlotSize>(plotSizes[1]); // Default to xxs
  const [garden, setGarden] = useState<(Plant | null)[][]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [plantTypes, setPlantTypes] = useState<Plant[]>([]);
  const [searchResults, setSearchResults] = useState<Plant[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [executeSearch, setExecuteSearch] = useState(false);
  const [gardenName, setGardenName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isLoadingGarden, setIsLoadingGarden] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const gardenId = queryParams.get('gardenId');

// Query to get all plants from the database
// note - do not need data parameter from query at this time
  const { loading: plantsLoading, error: plantsError } = useQuery(GET_ALL_PLANTS, {
  onCompleted: (data) => {
    // Convert database plants to local plant format
    if (data && data.plants) {
      const convertedPlants = data.plants.map(convertDbPlantToLocalPlant);
      setPlantTypes(convertedPlants);
    }
  },
  onError: (error) => {
    console.error('Error loading plants:', error);
  }
});



  // Initialize garden grid when plot size changes
  useEffect(() => {
    // Only initialize an empty grid if we're not currently loading a garden
    if (!isLoadingGarden) {
      setGarden(
        Array(selectedPlotSize.rows).fill(null).map(() => Array(selectedPlotSize.cols).fill(null))
      );
    }
  }, [selectedPlotSize, isLoadingGarden]);

  // GraphQL query for searching plants
  const { error, refetch } = useQuery(SEARCH_PLANTS_QUERY, {
    variables: { searchTerm, limit: 8 },
    skip: !executeSearch || !searchTerm.trim(),
    onCompleted: (data) => {
      setExecuteSearch(false);
      setIsSearching(false);

      if (data && data.searchPlants && data.searchPlants.length > 0) {
        // Convert GraphQL plants to our plant format
        const graphqlPlants: Plant[] = data.searchPlants.map((plant: any) => {
          // Generate a color based on plant id
          const colors = ['#ff6b6b', '#ff9f43', '#1dd1a1', '#10ac84', '#2e86de', '#f9ca24', '#6ab04c', '#eb4d4b'];
          const plantId = parseInt(plant.id);
          const color = colors[plantId % colors.length];

          // Default spacing (can be adjusted)
          const spacing = 12;

          return {
            id: `gql-${plant.id}`,
            name: plant.commonName,
            color: color,
            width: 1,
            height: 1,
            spacing: spacing,
            plantsPerSquareFoot: calculatePlantsPerSquareFoot(spacing),
            sunlight: Array.isArray(plant.sunlight) && plant.sunlight.length > 0
              ? plant.sunlight.join(', ')
              : 'Unknown',
            water: plant.watering || 'Unknown',
            image: plant.defaultImage?.thumbnail || 'https://cdn-icons-png.flaticon.com/128/628/628324.png'
          };
        });

        setSearchResults(graphqlPlants);
      } else {
        setSearchError('No plants found matching your search.');
        setSearchResults([]);
      }
    }
  });

  useQuery(
    GET_GARDEN_BY_ID,
    {
      variables: { id: gardenId },
      skip: !gardenId,
      onCompleted: (data) => {
        if (data && data.garden) {
          setIsLoadingGarden(true);

          // Set garden name
          setGardenName(data.garden.name);

          // Set plot size
          const plotSize = plotSizes.find(
            size => size.rows === data.garden.rows && size.cols === data.garden.cols
          ) || plotSizes[1];
          setSelectedPlotSize(plotSize);

          // Create populated garden grid
          const newGarden = Array(data.garden.rows)
            .fill(null)
            .map(() => Array(data.garden.cols).fill(null));

          // Populate with plants
          data.garden.plants.forEach((plant: { row: any; col: any; plantId: any; plantName: any; color: any; spacing: any; plantsPerSquareFoot: any; sunlight: any; water: any; image: any; }) => {
            const rowIndex = Number(plant.row);
            const colIndex = Number(plant.col);

            // Make sure the indices are valid before assigning
            if (rowIndex >= 0 && rowIndex < data.garden.rows &&
              colIndex >= 0 && colIndex < data.garden.cols) {
              // Ensure all required plant properties are included
              newGarden[rowIndex][colIndex] = {
                id: plant.plantId,
                name: plant.plantName || "Plant",
                color: plant.color || "#4CAF50",
                width: 1,
                height: 1,
                spacing: plant.spacing || 12,
                plantsPerSquareFoot: plant.plantsPerSquareFoot || 1,
                sunlight: plant.sunlight || "Unknown",
                water: plant.water || "Unknown",
                image: plant.image || 'https://cdn-icons-png.flaticon.com/128/628/628324.png'
              };
            }
          });

          // Set the garden grid directly
          setGarden(newGarden);

          setIsLoadingGarden(false);
        }
      },
      onError: (error) => {
        console.error("Error loading garden:", error);
        setIsLoadingGarden(false);
      }
    }
  );

  // GraphQL mutation for saving gardens
  const [saveGarden, { loading: saveLoading }] = useMutation(SAVE_GARDEN_MUTATION, {
    onCompleted: (data) => {
      setSaveSuccess(`Garden "${data.saveGarden.name}" saved successfully!`);
      setShowSaveDialog(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess('');
      }, 3000);
    },
    onError: (err) => {
      setSaveError(`Error saving garden: ${err.message}`);
    }
  });

  // Handle GraphQL errors
  useEffect(() => {
    if (error) {
      console.error('GraphQL error:', error);
      setSearchError(`Error searching plants: ${error.message}. Please try again.`);
      setIsSearching(false);
    }
  }, [error]);

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
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setExecuteSearch(true);

    // Trigger the GraphQL query
    refetch({ searchTerm, limit: 8 });
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
    setGardenName('');
  };

  // Change plot size
  const handlePlotSizeChange = (plotSizeId: string): void => {
    const newPlotSize = plotSizes.find(size => size.id === plotSizeId);
    if (newPlotSize) {
      setSelectedPlotSize(newPlotSize);
    }
  };

  // Handle garden name change
  const handleGardenNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setGardenName(e.target.value);
  };

  // Open save dialog
  const handleOpenSaveDialog = (): void => {
    setSaveError('');
    setShowSaveDialog(true);
  };

  // Handle garden save
  const handleSaveGarden = (e: React.FormEvent): void => {
    e.preventDefault();

    if (!gardenName.trim()) {
      setSaveError('Please enter a name for your garden.');
      return;
    }

    // Format plants for the mutation, including additional details
    const plants = garden.flatMap((row, rowIndex) =>
      row.flatMap((plant, colIndex) =>
        plant ? [{
          plantId: plant.id,
          row: rowIndex,
          col: colIndex,
          // Include additional plant details for databse
          plantName: plant.name,
          color: plant.color,
          spacing: plant.spacing,
          plantsPerSquareFoot: plant.plantsPerSquareFoot,
          sunlight: plant.sunlight,
          water: plant.water,
          // Store image path instead of the binary image so not storing it multiple times per garden
          image: plant.image
        }] : []
      )
    );
    // Execute the mutation
    saveGarden({
      variables: {
        name: gardenName,
        rows: selectedPlotSize.rows,
        cols: selectedPlotSize.cols,
        plants: plants
      }
    });
  };

  // Print garden plan
  const handlePrintGarden = () => {
    window.print();
  };

  // Filter plants based on local filtering (not GraphQL search)
  const filteredPlants = plantTypes.filter(plant =>
    !searchTerm || plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="garden-planner">
      <h1>Square Foot Garden Planner</h1>
      <p className="intro-text">Plan your garden using 1×1 foot squares. Each square can hold different numbers of plants based on spacing requirements.</p>

      {/* Plants loading message */}
      {plantsLoading && (
        <div className="loading-message">Loading plants...</div>
      )}

      {/* Error message for plants */}
      {plantsError && (
        <div className="error-message">Error loading plants: {plantsError.message}</div>
      )}

      {/* Save Success Message */}
      {saveSuccess && (
        <div className="save-success">{saveSuccess}</div>
      )}

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

            {/* Garden name input */}
            <div className="garden-name-input">
              <input
                type="text"
                placeholder="Garden Name"
                value={gardenName}
                onChange={handleGardenNameChange}
                className="garden-name-field"
              />
            </div>

            {/* Save Garden Button */}
            <button
              className="save-button"
              onClick={handleOpenSaveDialog}
              disabled={saveLoading}
            >
              {saveLoading ? "Saving..." : "Save Garden"}
            </button>

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
            <h3>{gardenName || "Square Foot Garden Plan"}</h3>
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
                    <div
                      key={plant.id}
                      className="legend-item"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '5px',
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                      }}
                    >
                      <img
                        src={plant.image}
                        alt={plant.name}
                        style={{
                          width: '25px',
                          height: '25px',
                          marginRight: '8px',
                        }}
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
            <div className="plantcare-container">
            <PlantCarePanel
              plantName={selectedPlant?.name || ''}
            />
          </div>
          </div>
        </div>
      </div>

      {/* Save Garden Dialog */}
      {showSaveDialog && (
        <div className="save-dialog-overlay">
          <div className="save-dialog">
            <h3>Save Your Garden</h3>
            {saveError && <div className="save-error">{saveError}</div>}

            <form onSubmit={handleSaveGarden}>
              <div className="form-group">
                <label htmlFor="gardenName">Garden Name:</label>
                <input
                  type="text"
                  id="gardenName"
                  value={gardenName}
                  onChange={handleGardenNameChange}
                  placeholder="Enter a name for your garden"
                  required
                />
              </div>

              <div className="form-group">
                <p>
                  Size: {selectedPlotSize.rows} × {selectedPlotSize.cols} feet<br />
                  Plants: {garden.flat().filter(Boolean).length}
                </p>
              </div>

              <div className="dialog-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowSaveDialog(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-confirm-button"
                  disabled={saveLoading}
                >
                  {saveLoading ? "Saving..." : "Save Garden"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
        
        /* Styles for save dialog */
        .save-dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .save-dialog {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          width: 400px;
          max-width: 90%;
        }
        
        .save-error {
          color: #dc3545;
          margin-bottom: 15px;
          padding: 8px;
          background-color: #f8d7da;
          border-radius: 4px;
        }
        
        .save-success {
          color: #28a745;
          margin-bottom: 15px;
          padding: 8px;
          background-color: #d4edda;
          border-radius: 4px;
        }
        
        .dialog-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        
        .form-group input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        `}
      </style>
    </div>
  );
};

export default GardenPlanner;