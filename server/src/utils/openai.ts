import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
