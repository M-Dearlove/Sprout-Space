import * as React from 'react';
import { useState } from 'react';
import '../styles/gardentoolkit.css';

/**
 * Interface defining a vegetable's properties
 */
interface Vegetable {
  readonly name: string;
  readonly density: number;
  readonly category: string;
  readonly spacing: string;
  readonly water: string;
  readonly waterDetails: string;
  readonly sunlight: string;
}

/**
 * Complete vegetable data based on provided list
 */
const vegetables: ReadonlyArray<Vegetable> = [
    { name: 'Tomato', density: 0.5, category: 'Vegetable', spacing: '16-18"', water: '1-2 inches per week', waterDetails: 'Deep watering 2-3 times weekly; more during fruiting', sunlight: 'Full sun' },
    { name: 'Carrot', density: 16, category: 'Vegetable', spacing: '3"', water: '1 inch per week', waterDetails: 'Consistent moisture; critical during germination', sunlight: 'Full sun' },
    { name: 'Lettuce', density: 4, category: 'Vegetable', spacing: '6"', water: '1 inch per week', waterDetails: 'Frequent light watering; soil should never dry out', sunlight: 'Partial shade' },
    { name: 'Cucumber', density: 1, category: 'Vegetable', spacing: '12"', water: '1-2 inches per week', waterDetails: 'Even moisture; increase when fruiting', sunlight: 'Full sun' },
    { name: 'Zucchini', density: 0.5, category: 'Vegetable', spacing: '16-18"', water: '1-2 inches per week', waterDetails: 'Regular deep watering twice weekly', sunlight: 'Full sun' },
    { name: 'Sunflower', density: 1, category: 'Flower', spacing: '12"', water: '1 inch per week', waterDetails: 'Deep watering; drought tolerant when established', sunlight: 'Full sun' },
    { name: 'Basil', density: 9, category: 'Herb', spacing: '4"', water: '1 inch per week', waterDetails: 'Water when top inch of soil is dry', sunlight: 'Full sun' },
    { name: 'Pepper', density: 1, category: 'Vegetable', spacing: '12"', water: '1-2 inches per week', waterDetails: 'Keep soil consistently moist', sunlight: 'Full sun' },
    { name: 'Broccoli', density: 0.5, category: 'Vegetable', spacing: '16-18"', water: '1-1.5 inches per week', waterDetails: 'Consistent moisture', sunlight: 'Full sun' },
    { name: 'Cauliflower', density: 0.5, category: 'Vegetable', spacing: '16-18"', water: '1-1.5 inches per week', waterDetails: 'Consistent moisture', sunlight: 'Full sun' },
    { name: 'Onion', density: 9, category: 'Vegetable', spacing: '4"', water: '1 inch per week', waterDetails: 'Regular watering until tops begin to fall over', sunlight: 'Full sun' },
    { name: 'Garlic', density: 9, category: 'Vegetable', spacing: '4"', water: '0.5-1 inch per week', waterDetails: 'Water weekly until bulb formation', sunlight: 'Full sun' },
    { name: 'Potato', density: 1, category: 'Vegetable', spacing: '12"', water: '1-2 inches per week', waterDetails: 'Critical during flowering and tuber formation', sunlight: 'Full sun' },
    { name: 'Sweet Potato', density: 1, category: 'Vegetable', spacing: '12"', water: '1 inch per week', waterDetails: 'Water deeply weekly', sunlight: 'Full sun' },
    { name: 'Pumpkin', density: 0.25, category: 'Vegetable', spacing: '24-36"', water: '1-2 inches per week', waterDetails: 'Deep watering twice weekly', sunlight: 'Full sun' },
    { name: 'Corn', density: 1, category: 'Vegetable', spacing: '12"', water: '1-1.5 inches per week', waterDetails: 'Critical during silking and ear development', sunlight: 'Full sun' },
    { name: 'Asparagus', density: 1, category: 'Vegetable', spacing: '12"', water: '1-1.5 inches per week', waterDetails: 'Deep watering; needs consistent moisture first 2 years', sunlight: 'Full sun' },
    { name: 'Beet', density: 9, category: 'Vegetable', spacing: '4"', water: '1 inch per week', waterDetails: 'Even, consistent moisture', sunlight: 'Full sun' },
    { name: 'Bell Pepper', density: 1, category: 'Vegetable', spacing: '12"', water: '1-2 inches per week', waterDetails: 'Keep soil consistently moist', sunlight: 'Full sun' },
    { name: 'Celery', density: 4, category: 'Vegetable', spacing: '6"', water: '1.5-2 inches per week', waterDetails: 'Never allow soil to dry out', sunlight: 'Partial shade' },
    { name: 'Cabbage', density: 1, category: 'Vegetable', spacing: '12"', water: '1-1.5 inches per week', waterDetails: 'Even moisture; critical during head formation', sunlight: 'Full sun' },
    { name: 'Eggplant', density: 0.5, category: 'Vegetable', spacing: '16-18"', water: '1-1.5 inches per week', waterDetails: 'Consistent moisture', sunlight: 'Full sun' },
    { name: 'Kale', density: 1, category: 'Vegetable', spacing: '12"', water: '1-1.5 inches per week', waterDetails: 'Consistent moisture', sunlight: 'Full sun' },
    { name: 'Spinach', density: 16, category: 'Vegetable', spacing: '3"', water: '1-1.5 inches per week', waterDetails: 'Keep soil consistently moist', sunlight: 'Partial shade' },
    { name: 'Strawberry', density: 4, category: 'Fruit', spacing: '6"', water: '1-1.5 inches per week', waterDetails: 'Critical during fruit development', sunlight: 'Full sun' },
    { name: 'Blueberry', density: 0.5, category: 'Fruit', spacing: '16-18"', water: '1-2 inches per week', waterDetails: 'Consistent moisture; needs acidic soil', sunlight: 'Full sun' },
    { name: 'Raspberry', density: 0.5, category: 'Fruit', spacing: '16-18"', water: '1-2 inches per week', waterDetails: 'Deep watering 2-3 times weekly', sunlight: 'Full sun' },
    { name: 'Watermelon', density: 0.25, category: 'Fruit', spacing: '24-36"', water: '1-2 inches per week', waterDetails: 'Deep watering; reduce as fruits ripen', sunlight: 'Full sun' },
    { name: 'Cantaloupe', density: 0.25, category: 'Fruit', spacing: '24-36"', water: '1-2 inches per week', waterDetails: 'Deep watering; reduce as fruits ripen', sunlight: 'Full sun' },
    { name: 'Radish', density: 16, category: 'Vegetable', spacing: '3"', water: '1 inch per week', waterDetails: 'Keep soil consistently moist', sunlight: 'Full sun' },
    { name: 'Peas', density: 9, category: 'Vegetable', spacing: '4"', water: '1-1.5 inches per week', waterDetails: 'Consistent moisture during flowering and pod formation', sunlight: 'Full sun' },
    { name: 'Beans', density: 9, category: 'Vegetable', spacing: '4"', water: '1 inch per week', waterDetails: 'Regular watering during flowering and pod development', sunlight: 'Full sun' },
    { name: 'Okra', density: 1, category: 'Vegetable', spacing: '12"', water: '1 inch per week', waterDetails: 'Drought tolerant once established', sunlight: 'Full sun' },
    { name: 'Brussels Sprouts', density: 0.5, category: 'Vegetable', spacing: '16-18"', water: '1-1.5 inches per week', waterDetails: 'Consistent moisture', sunlight: 'Full sun' },
    { name: 'Artichoke', density: 0.25, category: 'Vegetable', spacing: '24-36"', water: '1-2 inches per week', waterDetails: 'Deep watering; needs consistent moisture during bud development', sunlight: 'Full sun' },
    { name: 'Turnip', density: 9, category: 'Vegetable', spacing: '4"', water: '1 inch per week', waterDetails: 'Consistent moisture during root development', sunlight: 'Full sun' },
    { name: 'Squash', density: 0.25, category: 'Vegetable', spacing: '24-36"', water: '1-2 inches per week', waterDetails: 'Deep watering twice weekly', sunlight: 'Full sun' },
    { name: 'Mint', density: 9, category: 'Herb', spacing: '4"', water: '1-1.5 inches per week', waterDetails: 'Keep soil consistently moist', sunlight: 'Partial shade' },
    { name: 'Rosemary', density: 1, category: 'Herb', spacing: '12"', water: '0.5 inch per week', waterDetails: 'Drought tolerant; allow soil to dry between waterings', sunlight: 'Full sun' },
    { name: 'Thyme', density: 4, category: 'Herb', spacing: '6"', water: '0.5 inch per week', waterDetails: 'Drought tolerant; water when top inch of soil is dry', sunlight: 'Full sun' },
    { name: 'Cherry Tomato', density: 0.5, category: 'Vegetable', spacing: '16-18"', water: '1-2 inches per week', waterDetails: 'Deep watering 2-3 times weekly', sunlight: 'Full sun' }
  ];

/**
 * Props for the vegetable card component
 */
interface VegetableCardProps {
  vegetable: Vegetable;
  isSelected: boolean;
  onSelect: (vegetable: Vegetable) => void;
}

/**
 * Component to display a single vegetable card
 */
const VegetableCard: React.FC<VegetableCardProps> = ({ 
  vegetable, 
  isSelected, 
  onSelect 
}): React.ReactElement => {
  
  // Get density category class
  const getDensityCategoryClass = (density: number): string => {
    if (density <= 0.25) return "density-very-low";
    if (density <= 0.5) return "density-low";
    if (density <= 1) return "density-medium";
    if (density <= 4) return "density-high";
    if (density <= 9) return "density-very-high";
    return "density-ultra-high";
  };
  
  // Get density category text
  const getDensityCategory = (density: number): string => {
    if (density <= 0.25) return "Very Low";
    if (density <= 0.5) return "Low";
    if (density <= 1) return "Medium";
    if (density <= 4) return "High";
    if (density <= 9) return "Very High";
    return "Ultra High";
  };

  return (
    <div 
      onClick={() => onSelect(vegetable)}
      className={`vegetable-card ${getDensityCategoryClass(vegetable.density)} ${isSelected ? 'vegetable-card-selected' : ''}`}
    >
      <h3 className="vegetable-title">{vegetable.name}</h3>
      <div className="vegetable-details">
        <div className="density-info">
          <span><strong>Density:</strong> {vegetable.density}</span>
          <span className={`density-tag ${isSelected ? 'density-tag-selected' : ''}`}>
            {getDensityCategory(vegetable.density)}
          </span>
        </div>
        <p className="spacing-info"><strong>Spacing:</strong> {vegetable.spacing}</p>
        <p className="water-info"><strong>Water:</strong> {vegetable.water}</p>
        {isSelected && (
          <div className="expanded-info">
            <p><strong>Category:</strong> {vegetable.category}</p>
            <p><strong>Sunlight:</strong> {vegetable.sunlight}</p>
            <p className="watering-details"><strong>Watering:</strong> {vegetable.waterDetails}</p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Main Garden Toolkit component
 */
const GardenToolkit: React.FC = (): React.ReactElement => {
  // State for the collapsible panel
  const [isOpen, setIsOpen] = useState<boolean>(false); // Default to closed to save space
  
  // State for the selected vegetable
  const [selectedVegetable, setSelectedVegetable] = useState<Vegetable | null>(null);
  
  // State for category filter
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  
  // State for search term
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Filter vegetables based on category and search term
  const filteredVegetables = vegetables.filter(veg => {
    const matchesCategory = categoryFilter === 'All' || veg.category === categoryFilter;
    const matchesSearch = veg.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Sort vegetables by name
  const sortedVegetables = [...filteredVegetables].sort((a, b) => 
    a.name.localeCompare(b.name)
  );
  
  // Get unique categories from vegetables
  const categories = ['All', ...new Set(vegetables.map(veg => veg.category))];
  
  // Toggle the open/closed state
  const toggleOpen = (): void => {
    setIsOpen(!isOpen);
  };
  
  // Handle vegetable selection
  const handleSelect = (vegetable: Vegetable): void => {
    setSelectedVegetable(
      selectedVegetable?.name === vegetable.name ? null : vegetable
    );
  };
  
  return (
    <div className="garden-toolkit-container">
      <button 
        onClick={toggleOpen}
        className="toolkit-toggle-button"
      >
        <span>Planting Guide</span>
        <span>{isOpen ? '▼' : '►'}</span>
      </button>
      
      {isOpen && (
        <div className="toolkit-content">
          {/* Search input */}
          <div className="toolkit-search-container">
            <input
              type="text"
              placeholder="Search plants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="toolkit-search-input"
            />
          </div>
          
          {/* Category filter buttons */}
          <div className="filter-buttons">
            <span className="filter-label">Filter:</span>
            {categories.map(category => (
              <button 
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`filter-button ${categoryFilter === category ? 'filter-button-active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Plants heading with count */}
          <h3 className="plants-heading">Plants ({sortedVegetables.length})</h3>
          <p className="plants-instructions">Click for details</p>
          
          {/* Density legend */}
          <div className="density-legend">
            <h4 className="legend-title">Planting Density</h4>
            <div className="density-indicators">
              <span className="density-indicator density-very-low">Very Low (0-0.25)</span>
              <span className="density-indicator density-low">Low (0.26-0.5)</span>
              <span className="density-indicator density-medium">Medium (0.51-1)</span>
              <span className="density-indicator density-high">High (1.1-4)</span>
              <span className="density-indicator density-very-high">Very High (4.1-9)</span>
              <span className="density-indicator density-ultra-high">Ultra High (9.1-16)</span>
            </div>
          </div>
          
          {sortedVegetables.length === 0 ? (
            <p className="no-results">No plants match your search or filter</p>
          ) : (
            <div className="vegetable-grid">
              {/* Vegetable cards */}
              {sortedVegetables.map((vegetable: Vegetable): React.ReactElement => (
                <VegetableCard 
                  key={vegetable.name}
                  vegetable={vegetable}
                  isSelected={selectedVegetable?.name === vegetable.name}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          )}
          
          {/* Watering information */}
          <div className="watering-info">
            <h4 className="watering-info-title">Watering Guide</h4>
            <p><strong>1 inch of water</strong> = 0.62 gallons per square foot</p>
            <p><strong>Measuring:</strong> Use rain gauge or can when watering</p>
            <p><strong>Converting to gallons:</strong></p>
            <ul className="watering-info-list">
              <li>12" container: 1" water = 0.6 gal</li>
              <li>16" container: 1" water = 0.9 gal</li>
              <li>24" container: 1" water = 1.9 gal</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default GardenToolkit;