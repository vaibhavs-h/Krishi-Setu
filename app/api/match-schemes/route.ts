import { NextResponse } from 'next/server';

interface SchemeInput {
  id: string;
  title: string;
  category: string;
  eligibility_criteria: string;
  target_demographic: string;
  target_crops: string[] | null;
  state_applicability?: string[] | null;
}

interface Profile {
  crop: string;
  land: number;
  incomeVal: number;
  state?: string;
}

function scoreScheme(scheme: SchemeInput, profile: Profile): { matchScore: number; matchReason: string } {
  let score = 50; // base score
  const reasons: string[] = [];

  const eligText = (scheme.eligibility_criteria || '').toLowerCase();
  const demoText = (scheme.target_demographic || '').toLowerCase();
  const categoryText = (scheme.category || '').toLowerCase();
  const titleText = (scheme.title || '').toLowerCase();
  const cropLower = profile.crop.toLowerCase();

  // ── Crop matching ──────────────────────────────────────────
  const targetCrops = scheme.target_crops;
  const isAllCrops =
    !targetCrops ||
    targetCrops.length === 0 ||
    targetCrops.some(c => c.toLowerCase() === 'all');

  if (isAllCrops) {
    score += 10;
    reasons.push(`applies to all crops including your ${profile.crop}`);
  } else {
    const cropMatch = targetCrops.some(c => c.toLowerCase() === cropLower);
    if (cropMatch) {
      score += 30;
      reasons.push(`specifically targets ${profile.crop} farmers`);
    } else {
      // Crop mismatch penalties — scheme is for specific crops that don't match
      score -= 20;
    }
  }

  // ── Land area scoring ──────────────────────────────────────
  const isSmallFarmer = profile.land <= 2;
  const isMarginalFarmer = profile.land <= 1;

  if (demoText.includes('small') || demoText.includes('marginal')) {
    if (isSmallFarmer) {
      score += 20;
      reasons.push(`you're a small farmer (${profile.land} acres) which is this scheme's primary target`);
    } else {
      score -= 10;
    }
  } else {
    // General schemes give small boost to larger land holders
    if (profile.land >= 5) {
      score += 5;
    }
  }

  // ── Income-level scoring ───────────────────────────────────
  const incomeInLakhs = profile.incomeVal / 100000;
  const isLowIncome = incomeInLakhs < 2;
  const isMidIncome = incomeInLakhs >= 2 && incomeInLakhs <= 5;

  if (eligText.includes('below poverty') || eligText.includes('low income') || eligText.includes('bpl')) {
    if (isLowIncome) {
      score += 15;
      reasons.push(`your income (₹${profile.incomeVal.toLocaleString('en-IN')}) qualifies under the low-income criterion`);
    }
  }

  if (isMidIncome || isLowIncome) {
    score += 5; // most schemes target low-mid income farmers
  }

  // ── Category-specific boosts ───────────────────────────────
  if (categoryText === 'income support') {
    score += 10;
    reasons.push('provides direct income support to farmers');
  }
  if (categoryText === 'insurance') {
    score += 8;
    reasons.push(`covers crop losses for ${profile.crop} cultivation`);
  }
  if (categoryText === 'credit' || categoryText === 'loans') {
    score += 7;
  }
  if (categoryText === 'subsidy' || categoryText === 'input subsidy') {
    score += 8;
  }

  // ── Eligibility text keyword matching ──────────────────────
  if (eligText.includes(cropLower)) {
    score += 15;
    reasons.push(`eligibility criteria specifically mentions ${profile.crop}`);
  }

  // Aadhaar/bank bonuses (commonly available)
  if (eligText.includes('aadhaar') || eligText.includes('bank account')) {
    score += 3; // easy to meet requirement, slight positive
  }

  // ── State applicability ────────────────────────────────────
  const stateApplicability = scheme.state_applicability;
  if (stateApplicability && stateApplicability.length > 0 && profile.state) {
    const stateLower = profile.state.toLowerCase();
    const nationalScheme = stateApplicability.some(s => s.toLowerCase() === 'all' || s.toLowerCase() === 'national');
    const stateMatch = stateApplicability.some(s => s.toLowerCase().includes(stateLower));
    if (nationalScheme) {
      score += 5;
    } else if (stateMatch) {
      score += 20;
      reasons.push(`specifically available in ${profile.state}`);
    } else {
      score -= 25; // state-specific scheme for another state
    }
  }

  // Clamp score
  score = Math.max(10, Math.min(99, score));

  // Build match reason
  let matchReason = '';
  if (reasons.length > 0) {
    matchReason = `With ${profile.land} acres of ${profile.crop} and an annual income of ₹${profile.incomeVal.toLocaleString('en-IN')}, you qualify because this scheme ${reasons.slice(0, 2).join(' and ')}.`;
  } else {
    matchReason = `This scheme is broadly applicable to farmers like you with ${profile.land} acres growing ${profile.crop}.`;
  }

  return { matchScore: Math.round(score), matchReason };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { profile, schemes } = body;

    if (!profile || !schemes || schemes.length === 0) {
      return NextResponse.json({ error: 'Missing profile details or schemes data' }, { status: 400 });
    }

    // Score and rank all schemes
    const scored = (schemes as SchemeInput[])
      .map(scheme => {
        const { matchScore, matchReason } = scoreScheme(scheme, profile);
        return { id: scheme.id, matchScore, matchReason };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5); // Top 5

    return NextResponse.json({ matches: scored });

  } catch (error: any) {
    console.error("Scheme Matching Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to match schemes' }, { status: 500 });
  }
}
