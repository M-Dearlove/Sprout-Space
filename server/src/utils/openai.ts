import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define interface for pest information
export interface PestInfo {
  name: string;
  description: string;
  treatment: string;
  image?: string;
}

// Define interface for OpenAI response
interface OpenAIPestResponse {
  pests: PestInfo[];
}

export async function getPlantCareParagraph(plantName: string): Promise<string> {
  const prompt = `Write a short and clear paragraph on how to grow and care for ${plantName} in a backyard garden. Include sunlight, watering, spacing, maintenance and growing tips.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 200,
    });

    return response.choices[0].message.content || 'No care guide found.';
  } catch (error: any) {
    console.error("OpenAI API Error:", error?.response?.data || error?.message || error);
    return 'Failed to fetch plant care information.';
  }
}

/**
 * Gets pest information for a specific plant using OpenAI
 * @param {string} plantName - The name of the plant
 * @returns {Promise<PestInfo[]>} - Array of pest objects with name, description, and treatment
 */
export async function getPlantPestInformation(plantName: string): Promise<PestInfo[]> {
  try {
    const prompt = `
      Provide information about the 3 most common pests that affect ${plantName} plants in home gardens.
      
      For each pest, include:
      1. The pest name
      2. A brief description of the pest and how it damages the plant
      3. Organic treatment methods
      
      Format your response as a JSON object with a "pests" property containing an array with objects containing "name", "description", and "treatment" properties.
      Example format:
      {
        "pests": [
          {
            "name": "Pest Name",
            "description": "Description of the pest and damage",
            "treatment": "Organic treatment methods"
          }
        ]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo", // or whichever model you're currently using
      messages: [
        {
          role: "system",
          content: "You are a gardening expert providing accurate information about plant pests and organic treatments. Respond only with the requested JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    // Extract the JSON content from the response
    const content = response.choices[0].message.content;
    
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }
    
    // Parse the JSON response
    const parsedData = JSON.parse(content) as OpenAIPestResponse;
    
    // Ensure the response contains an array of pests
    if (parsedData && parsedData.pests && Array.isArray(parsedData.pests)) {
      // Add image URLs for the pests
      return parsedData.pests.map((pest: PestInfo) => ({
        ...pest,
        // Generate placeholder image URLs - replace with real pest image URLs if available
        image: `https://source.unsplash.com/300x200/?garden,${encodeURIComponent(pest.name.toLowerCase())}`
      }));
    }
    
    throw new Error("Unexpected response format from OpenAI");
    
  } catch (error) {
    console.error("Error fetching pest information from OpenAI:", error);
    // Return default pest data as fallback
    return getDefaultPestData(plantName);
  }
}

/**
 * Provides default pest data if the OpenAI call fails
 * @param {string} plantName - The name of the plant
 * @returns {PestInfo[]} - Array of pest objects
 */
function getDefaultPestData(plantName: string): PestInfo[] {
  // This is a simplified version of the mock data from before
  const commonPests: Record<string, PestInfo[]> = {
    'Tomato': [
      {
        name: 'Tomato Hornworm',
        description: 'Large green caterpillars that can quickly defoliate tomato plants.',
        treatment: 'Handpick from plants, use Bacillus thuringiensis (Bt), or introduce natural predators like parasitic wasps.',
      },
      {
        name: 'Aphids',
        description: 'Small, pear-shaped insects that cluster on new growth and undersides of leaves.',
        treatment: 'Spray with strong water jet, use insecticidal soap, or introduce ladybugs.',
      }
    ],
    'Celery': [
      {
        name: 'Aphids',
        description: 'Small sap-sucking insects that can stunt growth and transmit diseases.',
        treatment: 'Use insecticidal soap, neem oil, or strong water spray to remove them.',
      },
      {
        name: 'Celery Leaf Miner',
        description: 'Fly larvae that tunnel between leaf surfaces creating distinctive trails.',
        treatment: 'Remove and destroy affected leaves, use row covers during fly season, or apply organic spinosad spray.',
      }
    ],
    // More default data could be added here
  };
  
  // Return specific pests if we have them, otherwise return generic pests
  const defaultPests: PestInfo[] = [
    {
      name: 'Aphids',
      description: 'Small sap-sucking insects that can affect almost any plant.',
      treatment: 'Spray with water, use insecticidal soap, or introduce beneficial insects.',
    },
    {
      name: 'Spider Mites',
      description: 'Tiny spider-like pests that cause stippling on leaves and fine webbing.',
      treatment: 'Increase humidity, spray with water, or use insecticidal soap or neem oil.',

    }
  ];
  
  return commonPests[plantName] || defaultPests;
}