import { useLazyQuery, gql } from '@apollo/client';
import { useEffect } from 'react';
import '../styles/PlantCarePanel.css';

const GET_PLANT_CARE_INFO = gql`
  query GetPlantCareInfo($plantName: String!) {
    getPlantCareInfo(plantName: $plantName)
  }
`;

interface Props {
  plantName: string | null;
}

export default function PlantCarePanel({ plantName }: Props) {
  const [fetchInfo, { data, loading }] = useLazyQuery(GET_PLANT_CARE_INFO);

  useEffect(() => {
    if (plantName) {
      fetchInfo({ variables: { plantName } });
    }
  }, [plantName]);

  return (
    <div className="plant-care-panel">
      <h2 className="panel-title">
        {plantName ? `How to Grow ${plantName}` : 'Select a Plant'}
      </h2>
      {loading && <p className="loading-text">Loading care info...</p>}
      {data?.getPlantCareInfo && (
        <p className="care-info-text">
          {data.getPlantCareInfo}
        </p>
      )}
    </div>
  );
}
