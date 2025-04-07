import { useLazyQuery, gql } from '@apollo/client';
import { useEffect } from 'react';

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
    <div className="bg-white p-4 w-80 h-full border-r border-gray-300 overflow-y-auto">
      <h2 className="text-lg font-bold mb-2">
        {plantName ? `How to Grow ${plantName}` : 'Select a Plant'}
      </h2>
      {loading && <p className="text-sm italic">Loading care info...</p>}
      {data?.getPlantCareInfo && (
        <p className="text-sm leading-relaxed whitespace-pre-line">
          {data.getPlantCareInfo}
        </p>
      )}
    </div>
  );
}
