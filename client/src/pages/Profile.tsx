import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME, GET_USER_GARDENS } from '../graphQL/queries';
import { DELETE_GARDEN_MUTATION } from '../graphQL/mutations';
import '../styles/Profile.css';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ProfilePage = () => {
  const location = useLocation();
  
  const { loading: profileLoading, error: profileError, data: profileData } = useQuery(QUERY_ME);
  const { loading: gardensLoading, error: gardensError, data: gardensData, refetch: refetchGardens } = useQuery(GET_USER_GARDENS, {
    onError: (error) => {
      console.error("Error fetching gardens:", error);
    }
  });

  const [gardens, setGardens] = useState<GardenCardProps['garden'][]>([]);
  const [deleteInProgress, setDeleteInProgress] = useState<string | null>(null);

  // Add delete garden mutation
  const [deleteGarden] = useMutation(DELETE_GARDEN_MUTATION, {
    onCompleted: () => {
      setDeleteInProgress(null);
      refetchGardens(); // Refresh the garden list after deletion
    },
    onError: (error) => {
      console.error("Error deleting garden:", error);
      setDeleteInProgress(null);
    }
  });

  useEffect(() => {
    if (gardensData && gardensData.userGardens) {
      setGardens(gardensData.userGardens);
    }
  }, [gardensData]);

  useEffect(() => {
    // Refetch both queries when the location changes
    refetchGardens();
  }, [location.key, refetchGardens]);

  // Handle garden deletion
  const handleDeleteGarden = (gardenId: string) => {
    // Show confirmation before deleting
    if (window.confirm("Are you sure you want to delete this garden plan? This action cannot be undone.")) {
      setDeleteInProgress(gardenId);
      deleteGarden({ 
        variables: { id: gardenId }
      });
    }
  };

  if (profileLoading) return <p>Loading your profile...</p>;
  if (profileError) return <p>Error loading profile: {profileError.message}</p>;

  // Destructure profile data
  const { firstname } = profileData.me;
  const hasGardens = gardens.length > 0;

  return (
    <div className="profilePage-container">
      <div className="profile-container">
        <div className="profile-header">
          <h1>{firstname}'s Garden Plans</h1>
          <p>"The glory of gardening: hands in the dirt, head in the sun, heart with nature." - Alfred Austin </p>
        </div>
        <div className="savedPlot-container">
          {gardensLoading ? (
            <p>Loading your garden plans...</p>
          ) : gardensError ? (
            <div className="error-container">
              <p>Unable to load your garden plans.</p>
              <Link to="/planner" className="create-garden-btn">Create A New Garden</Link>
            </div>
          ) : hasGardens ? (
            <div className="garden-grid">
              {gardens.map(garden => (
                <GardenCard 
                  key={garden.id} 
                  garden={garden} 
                  onDelete={handleDeleteGarden}
                  isDeleting={deleteInProgress === garden.id}
                />
              ))}
            </div>
          ) : (
            <div className="no-gardens">
              <p>You have no garden plots saved</p>
              <Link to="/garden-planner" className="create-garden-btn">Create Your First Garden</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Updated Garden card component with delete functionality
interface GardenCardProps {
  garden: {
    id: string;
    name: string;
    rows: number;
    cols: number;
    plants?: {
      row: number;
      col: number;
      plantId: string;
      plantName?: string;
      color?: string;
      image?: string;
    }[];
  };
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const GardenCard = ({ garden, onDelete, isDeleting }: GardenCardProps) => {
  const plantCount = garden.plants ? garden.plants.length : 0;
  
  return (
    <div className="garden-card">
      <div className="garden-preview">
        <GardenPreview garden={garden} />
      </div>
      <div className="garden-info">
        <h3>{garden.name}</h3>
        <div className="garden-details">
          <span>{garden.rows} × {garden.cols} ft</span>
          <span>{plantCount} plants</span>
        </div>
        <div className="garden-actions">
          <Link to={`/garden-planner?gardenId=${garden.id}`} className="edit-garden-btn">
            Edit Garden
          </Link>
          <button 
            className="delete-garden-btn"
            onClick={() => onDelete(garden.id)}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Garden'}
          </button>
        </div>
      </div>
    </div>
  );
};


// Garden preview component remains unchanged
interface PlantInfo {
  id: string;
  plantName?: string;
  color?: string;
  image?: string;
}

interface Garden {
  rows: number;
  cols: number;
  plants?: {
    row: number;
    col: number;
    plantId: string;
    plantName?: string;
    color?: string;
    image?: string;
  }[];
}

const GardenPreview = ({ garden }: { garden: Garden }) => {
  const { rows, cols, plants } = garden;
  
  // Create a grid with null cells
  const grid: (PlantInfo | null)[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(null));
  
  // Place plants in the grid
  if (plants && plants.length > 0) {
    plants.forEach((plant) => {
      if (plant.row < rows && plant.col < cols) {
        grid[plant.row][plant.col] = { 
          id: plant.plantId,
          plantName: plant.plantName,
          color: plant.color || '#4CAF50', // Default green if no color provided
          image: plant.image
        };
      }
    });
  }
  
  return (
    <div 
      className="garden-preview-grid"
      style={{ 
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: '1px',
        backgroundColor: '#e0e0e0',
        width: '100%',
        height: '100%'
      }}
    >
      {grid.map((row, rowIndex) => 
        row.map((plant, colIndex) => {
          // Determine if we have a valid image URL to display
          const hasValidImage = plant?.image && plant.image.trim() !== '';
          
          return (
            <div 
              key={`${rowIndex}-${colIndex}`}
              className={`preview-cell ${hasValidImage ? 'with-image' : ''}`}
              style={{
                backgroundColor: hasValidImage ? 'transparent' : (plant ? plant.color : '#f9f9f9'),
                backgroundImage: hasValidImage ? `url(${plant.image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                aspectRatio: '1/1',
                position: 'relative'
              }}
              title={plant ? plant.plantName || 'Plant' : 'Empty space'}
            >
              {/* Optional: Add plant name overlay on hover */}
              {plant && plant.plantName && (
                <div className="plant-name-overlay">
                  {plant.plantName}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ProfilePage;