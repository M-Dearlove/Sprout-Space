// PlantCarePanel.tsx
import { useLazyQuery, gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import '../styles/PlantCarePanel.css';

// Define interfaces for pest data
interface PestInfo {
  name: string;
  description: string;
  treatment: string;
  image?: string;
}

// Query for plant care information
const GET_PLANT_CARE_INFO = gql`
  query GetPlantCareInfo($plantName: String!) {
    getPlantCareInfo(plantName: $plantName)
  }
`;

// Query for pest information from OpenAI
const GET_PLANT_PESTS = gql`
  query GetPlantPests($plantName: String!) {
    getPlantPests(plantName: $plantName) {
      name
      description
      treatment
      image
    }
  }
`;

interface Props {
  plantName: string | null;
}

export default function PlantCarePanel({ plantName }: Props) {
  const [fetchInfo, { data: careData, loading: careLoading }] = useLazyQuery(GET_PLANT_CARE_INFO);
  const [fetchPests, { data: pestData, loading: pestLoading }] = useLazyQuery(GET_PLANT_PESTS);
  const [pests, setPests] = useState<PestInfo[]>([]);

  useEffect(() => {
    if (plantName) {
      fetchInfo({ variables: { plantName } });
      fetchPests({ variables: { plantName } });
    }
  }, [plantName, fetchInfo, fetchPests]);

  useEffect(() => {
    if (pestData?.getPlantPests) {
      setPests(pestData.getPlantPests);
    }
  }, [pestData]);

  return (
    <div className="plant-care-panel">
      <h2 className="panel-title">
        {plantName ? `How to Grow ${plantName}` : 'Select a Plant'}
      </h2>
      
      {/* Plant Care Information */}
      {careLoading && <p className="loading-text">Loading care info...</p>}
      {careData?.getPlantCareInfo && (
        <p className="care-info-text">
          {careData.getPlantCareInfo}
        </p>
      )}
      
      {/* Pest Information Section */}
      {plantName && (
        <div className="pest-section">
          <h3 className="pest-title">Common Pests & Problems</h3>
          
          {pestLoading && <p className="loading-text">Loading pest info...</p>}
          
          {pests.length > 0 ? (
            <div className="pest-list">
              {pests.map((pest, index) => (
                <div key={index} className="pest-item">
                    <h4 className="pest-name">{pest.name}</h4>
                    <p className="pest-description">{pest.description}</p>
                    <div className="pest-treatment">
                     <h5>Treatment</h5>
                     <p>{pest.treatment}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !pestLoading && <p>No common pests information available.</p>
          )}
        </div>
      )}
    </div>
  );
}