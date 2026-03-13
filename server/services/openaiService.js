import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash',
  generationConfig: {
    temperature: 0.8,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 2048,
    responseMimeType: 'application/json',
  },
});

const textModel = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash',
  generationConfig: {
    temperature: 0.9,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 2048,
  },
});

/**
 * Match user's vibe to destinations using Gemini AI
 */
export const matchVibeToDestinations = async (budget, duration, vibe, availableDestinations) => {
  const destinationSummaries = availableDestinations.map((d) => ({
    id: d._id.toString(),
    city: d.city,
    country: d.country,
    vibeCategories: d.vibeCategories,
    vibeKeywords: d.vibeKeywords,
    description: d.description,
    averageCostPerDay: d.averageCostPerDay,
  }));

  const prompt = `You are VibeVoyage Elite's AI travel curator. A traveler has shared their preferences:

- Budget: ${budget}
- Duration: ${duration}
- Vibe: "${vibe}"

Here are the available destinations in our database:
${JSON.stringify(destinationSummaries, null, 2)}

Analyze each destination and select the TOP 3 that best match the traveler's vibe, budget, and duration. For each selected destination, provide:

1. "id" - the exact destination id from the database
2. "city" - city name
3. "country" - country name
4. "vibeMatchPercent" - a percentage (65-99) indicating how well it matches. Be honest and nuanced.
5. "explanation" - EXACTLY 2 sentences explaining why this destination matches their mood/vibe. Make it evocative and personal.
6. "vibeEmoji" - 1-2 emojis that capture the vibe of the match

Return ONLY valid JSON in this exact format:
{
  "matches": [
    {
      "id": "...",
      "city": "...",
      "country": "...",
      "vibeMatchPercent": 92,
      "explanation": "...",
      "vibeEmoji": "..."
    },
    {
      "id": "...",
      "city": "...",
      "country": "...",
      "vibeMatchPercent": 85,
      "explanation": "...",
      "vibeEmoji": "..."
    },
    {
      "id": "...",
      "city": "...",
      "country": "...",
      "vibeMatchPercent": 78,
      "explanation": "...",
      "vibeEmoji": "..."
    }
  ]
}

IMPORTANT: Return exactly 3 matches. Use only destination IDs that exist in the provided data.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Clean the response - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.slice(7);
    }
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith('```')) {
      cleanedText = cleanedText.slice(0, -3);
    }
    cleanedText = cleanedText.trim();

    const parsed = JSON.parse(cleanedText);
    return parsed.matches || [];
  } catch (error) {
    console.error('Gemini Vibe Match Error:', error.message);
    
    // Fallback: return top 3 destinations based on keyword matching
    console.log('⚠️  Using fallback vibe matching...');
    return getFallbackMatches(vibe, availableDestinations);
  }
};

/**
 * Generate a 3-day AI itinerary for a destination
 */
export const generateItinerary = async (destination, hotel, vibe, duration) => {
  const daysToGenerate = Math.min(parseInt(duration) || 3, 5);

  const prompt = `Create a ${daysToGenerate}-day travel itinerary for a traveler staying at "${hotel.name}" in ${destination.city}, ${destination.country}.

Their travel vibe is: "${vibe}"

Create a detailed, exciting itinerary that aligns with their vibe. For each day, include:
- Morning activity
- Afternoon activity  
- Evening activity
- A local food recommendation

Format it beautifully with emojis. Make it feel premium and curated. Keep each activity description to 1-2 sentences. Use this format:

🗓 Day 1: [Theme]
🌅 Morning: ...
☀️ Afternoon: ...
🌙 Evening: ...
🍽 Must-Try: ...

(repeat for each day)

End with a "✨ Pro Tip:" that's specific to the destination.`;

  try {
    const result = await textModel.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Itinerary Error:', error.message);
    return `Your ${daysToGenerate}-day adventure in ${destination.city} awaits! Contact our concierge for a personalized itinerary.`;
  }
};

/**
 * Fallback matching when AI fails - uses keyword similarity
 */
function getFallbackMatches(vibe, destinations) {
  const vibeWords = vibe.toLowerCase().split(/\s+/);
  
  const scored = destinations.map((dest) => {
    let score = 0;
    const allKeywords = [
      ...dest.vibeKeywords,
      ...dest.vibeCategories,
      dest.description.toLowerCase(),
    ].join(' ');

    vibeWords.forEach((word) => {
      if (allKeywords.includes(word)) {
        score += 10;
      }
    });

    // Partial matching
    dest.vibeKeywords.forEach((keyword) => {
      vibeWords.forEach((word) => {
        if (keyword.includes(word) || word.includes(keyword)) {
          score += 5;
        }
      });
    });

    return {
      id: dest._id.toString(),
      city: dest.city,
      country: dest.country,
      vibeMatchPercent: Math.min(65 + score, 95),
      explanation: `${dest.city} offers a unique blend of experiences that resonate with your desired vibe. ${dest.description.split('.')[0]}.`,
      vibeEmoji: '✨🌍',
      score,
    };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ score, ...rest }) => rest);
}

export default { matchVibeToDestinations, generateItinerary };