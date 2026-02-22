import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize the Google GenAI SDK
// It automatically picks up GEMINI_API_KEY from the environment
const ai = new GoogleGenAI({});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { profile, schemes } = body;

    if (!profile || !schemes || schemes.length === 0) {
      return NextResponse.json({ error: 'Missing profile details or schemes data' }, { status: 400 });
    }

    const prompt = `
You are an expert Indian Agricultural Financial Advisor. 
Your goal is to evaluate a farmer's specific profile and match them with the absolutely best government schemes from the provided list.

FARMER PROFILE:
- Primary Crop: ${profile.crop}
- Land Holding: ${profile.land} Acres
- Annual Income: ₹${profile.incomeVal.toLocaleString("en-IN")}
- State/Location: ${profile.state || 'India'}

AVAILABLE SCHEMES TO EVALUATE: (JSON Array)
${JSON.stringify(schemes.map((s: any) => ({
      id: s.id,
      title: s.title,
      category: s.category,
      eligibility_criteria: s.eligibility_criteria,
      target_demographic: s.target_demographic,
      target_crops: s.target_crops,
      min_land: s.min_land_area,
      max_land: s.max_land_area,
      max_income: s.max_income
    })), null, 2)}

INSTRUCTIONS:
1. Hard Filter: Immediately eliminate any schemes where the farmer's land holding or income EXCEEDS the scheme's strict maximums, or where their state absolutely does not match the state applicability (if specified).
2. Rank the remaining schemes based on how perfectly they match the farmer's profile, crop focus, and demographic.
3. Select the Top 5 best matches.
4. For each selected scheme, generate a custom 1-2 sentence 'matchReason' explaining EXACTLY why the farmer qualifies based on their provided profile data and the scheme's deep eligibility criteria. Write this directly to the farmer (e.g., "Because you farm 12 acres of Wheat in MP, you perfectly qualify for...").
5. Return the result STRICTLY as a raw JSON array of objects. Do not use markdown blocks or text outside the array.

EXPECTED JSON FORMAT:
[
  {
    "id": "scheme-uuid",
    "matchScore": 95,
    "matchReason": "Explanation..."
  }
]
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.2, // Low temperature for factual, deterministic matching
        responseMimeType: 'application/json',
      }
    });

    const aiText = response.text || "[]";
    const parsedMatches = JSON.parse(aiText);

    return NextResponse.json({ matches: parsedMatches });

  } catch (error: any) {
    console.error("Gemini Scheme Matching Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to match schemes via AI' }, { status: 500 });
  }
}
