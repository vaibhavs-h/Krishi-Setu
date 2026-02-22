import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize with explicit API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
    })), null, 2)}

INSTRUCTIONS:
1. Evaluate each scheme based on the farmer's crop, land holding, income, and location against the eligibility criteria and target demographic/crops.
2. Schemes with "All Farmers" or "All Crops" in their targeting are broadly applicable.
3. Prioritize schemes that match the farmer's crop type and income level.
4. Select the Top 5 best matches.
5. For each selected scheme, generate a custom 1-2 sentence 'matchReason' explaining EXACTLY why the farmer qualifies based on their provided profile data and the scheme's eligibility criteria. Write this directly to the farmer (e.g., "Because you farm 12 acres of Wheat, you perfectly qualify for...").
6. Return the result STRICTLY as a raw JSON array of objects. Do not use markdown blocks or text outside the array.

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
      model: 'gemini-2.0-flash',
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
