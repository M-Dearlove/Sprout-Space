import axios from 'axios';



export async function fetchPestData(plantName: string) {
  try {
    const response = await axios.get(`https://api.pests.example.com/search?plant=${plantName}`);
    return response.data.results.map((pest: any) => ({
      name: pest.name,
      description: pest.description,
      treatment: pest.treatment
    }));
  } catch (error) {
    console.error('Pest API error:', error);
    return [];
  }
}
