/**
 * Pure analytical and heuristic logic for TruthLens AI.
 * Fully decoupled from DOM/browser for deterministic unit testing.
 */

export interface CredibilityDimension {
  name: string;
  score: number; // 0 - 100
  benchmark: string;
  description: string;
}

export interface DetectedClaim {
  id: string;
  text: string;
  verdict: 'Verified Factual' | 'Dubious / Unsubstantiated' | 'Misleading' | 'False / Fabricated' | 'Manipulative Tone';
  severity: 'low' | 'medium' | 'high';
  explanation: string;
  factCheckQuery?: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  title: string;
  sourceUrl?: string;
  rawText: string;
  credibilityScore: number; // 0 - 100
  verdict: 'Reliable' | 'Mostly Credible' | 'Questionable' | 'High Risk' | 'Fabricated / Misinformation';
  summary: string;
  emotionalManipulation: {
    score: number; // 0 - 100 (higher = more manipulative)
    level: 'Minimal' | 'Moderate' | 'Severe';
    tacticsDetected: string[];
    explanation: string;
  };
  biasRating: {
    spectrum: 'Extreme Left' | 'Lean Left' | 'Center / Balanced' | 'Lean Right' | 'Extreme Right' | 'Partisan Sensationalism';
    score: number; // -100 (left) to +100 (right), or 0 for balanced
    explanation: string;
  };
  dimensions: {
    factuality: number;
    sourceRigor: number;
    neutrality: number;
    logicalConsistency: number;
    verifiability: number;
  };
  claims: DetectedClaim[];
  fallacies: string[];
  recommendations: string[];
  userEmail: string;
  modelUsed?: string;
}

/**
 * Normalizes and clamps numeric scores between 0 and 100
 */
export function clampScore(score: number): number {
  if (Number.isNaN(score)) return 50;
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Computes verbal verdict based on credibility score threshold
 */
export function getVerdictFromScore(score: number): AnalysisResult['verdict'] {
  const clamped = clampScore(score);
  if (clamped >= 80) return 'Reliable';
  if (clamped >= 65) return 'Mostly Credible';
  if (clamped >= 45) return 'Questionable';
  if (clamped >= 25) return 'High Risk';
  return 'Fabricated / Misinformation';
}

/**
 * Color and badge theme tokens based on verdict
 */
export function getVerdictTheme(verdict: AnalysisResult['verdict']) {
  switch (verdict) {
    case 'Reliable':
      return {
        badgeBg: 'bg-emerald-500/15',
        badgeBorder: 'border-emerald-500/30',
        badgeText: 'text-emerald-400',
        colorHex: '#10B981',
        label: 'Reliable & Factual',
        shortDescription: 'Substantiated by verified data, neutral tone, and standard journalistic rigor.',
      };
    case 'Mostly Credible':
      return {
        badgeBg: 'bg-teal-500/15',
        badgeBorder: 'border-teal-500/30',
        badgeText: 'text-teal-400',
        colorHex: '#14B8A6',
        label: 'Mostly Credible',
        shortDescription: 'Core points are sound, though minor unsubstantiated assumptions or context gaps exist.',
      };
    case 'Questionable':
      return {
        badgeBg: 'bg-amber-500/15',
        badgeBorder: 'border-amber-500/30',
        badgeText: 'text-amber-400',
        colorHex: '#F59E0B',
        label: 'Questionable / Mixed',
        shortDescription: 'Contains unsupported assertions, emotional framing, or cherry-picked premises.',
      };
    case 'High Risk':
      return {
        badgeBg: 'bg-orange-500/15',
        badgeBorder: 'border-orange-500/30',
        badgeText: 'text-orange-400',
        colorHex: '#F97316',
        label: 'High Risk / Misleading',
        shortDescription: 'Significant red flags: manipulative rhetoric, misleading correlations, or lack of source proof.',
      };
    case 'Fabricated / Misinformation':
    default:
      return {
        badgeBg: 'bg-rose-500/15',
        badgeBorder: 'border-rose-500/30',
        badgeText: 'text-rose-400',
        colorHex: '#EF4444',
        label: 'Fabricated / Misinformation',
        shortDescription: 'Blatant falsehoods, deceptive conspiracy framing, or fabricated statistics.',
      };
  }
}

/**
 * Text statistics extraction
 */
export function computeTextMetrics(text: string) {
  const trimmed = text.trim();
  if (!trimmed) {
    return { wordCount: 0, sentenceCount: 0, charCount: 0, uppercaseRatio: 0, exclamationCount: 0 };
  }
  const words = trimmed.split(/\s+/).filter(Boolean);
  const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const letters = trimmed.replace(/[^a-zA-Z]/g, '');
  const uppercaseLetters = trimmed.replace(/[^A-Z]/g, '');
  const exclamations = (trimmed.match(/!/g) || []).length;

  const uppercaseRatio = letters.length > 0 ? uppercaseLetters.length / letters.length : 0;

  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    charCount: trimmed.length,
    uppercaseRatio: Math.round(uppercaseRatio * 100) / 100,
    exclamationCount: exclamations,
  };
}

/**
 * Highlighting segmentation: slices raw text into safe segments with detected claim annotations
 */
export interface TextHighlightSegment {
  text: string;
  isClaim: boolean;
  claim?: DetectedClaim;
}

export function segmentTextWithClaims(rawText: string, claims: DetectedClaim[]): TextHighlightSegment[] {
  if (!claims || claims.length === 0 || !rawText) {
    return [{ text: rawText, isClaim: false }];
  }

  // Find occurrences of claims in rawText
  interface Match {
    start: number;
    end: number;
    claim: DetectedClaim;
  }

  const matches: Match[] = [];

  for (const claim of claims) {
    if (!claim.text || claim.text.trim().length < 4) continue;
    const cleanNeedle = claim.text.trim();
    let searchIndex = 0;
    while (searchIndex < rawText.length) {
      const idx = rawText.indexOf(cleanNeedle, searchIndex);
      if (idx === -1) {
        // Try case-insensitive fallback if exact match fails
        const lowerRaw = rawText.toLowerCase();
        const lowerNeedle = cleanNeedle.toLowerCase();
        const fallbackIdx = lowerRaw.indexOf(lowerNeedle, searchIndex);
        if (fallbackIdx !== -1) {
          matches.push({
            start: fallbackIdx,
            end: fallbackIdx + cleanNeedle.length,
            claim,
          });
          searchIndex = fallbackIdx + cleanNeedle.length;
        }
        break;
      }
      matches.push({
        start: idx,
        end: idx + cleanNeedle.length,
        claim,
      });
      searchIndex = idx + cleanNeedle.length;
    }
  }

  if (matches.length === 0) {
    return [{ text: rawText, isClaim: false }];
  }

  // Sort matches by start position and resolve overlaps
  matches.sort((a, b) => a.start - b.start);

  const nonOverlapping: Match[] = [];
  let lastEnd = 0;

  for (const m of matches) {
    if (m.start >= lastEnd) {
      nonOverlapping.push(m);
      lastEnd = m.end;
    }
  }

  const segments: TextHighlightSegment[] = [];
  let cursor = 0;

  for (const m of nonOverlapping) {
    if (m.start > cursor) {
      segments.push({
        text: rawText.slice(cursor, m.start),
        isClaim: false,
      });
    }
    segments.push({
      text: rawText.slice(m.start, m.end),
      isClaim: true,
      claim: m.claim,
    });
    cursor = m.end;
  }

  if (cursor < rawText.length) {
    segments.push({
      text: rawText.slice(cursor),
      isClaim: false,
    });
  }

  return segments;
}

/**
 * Deterministic NLP Heuristic analyzer fallback when offline or API token isn't configured
 */
export function analyzeWithHeuristics(rawText: string, userEmail: string = 'wajhatbhai30@gmail.com', customTitle?: string): AnalysisResult {
  const metrics = computeTextMetrics(rawText);
  const lower = rawText.toLowerCase();

  const sensationalKeywords = [
    'shocking', 'unbelievable', 'miracle cure', 'secret doctors dont want you to know',
    'conspiracy', 'hoax', 'mainstream media lies', 'urgent alert', '100% proven cure',
    'they are hiding', 'wake up sheeple', 'banned', 'classified leak', 'exposed', 'deep state'
  ];

  const emotionalTriggers = [
    'outrage', 'furious', 'evil', 'destroy', 'catastrophe', 'treason',
    'terrifying', 'bloodbath', 'disaster', 'scam', 'corrupt', 'sickening'
  ];

  let flaggedSensationalCount = 0;
  for (const kw of sensationalKeywords) {
    if (lower.includes(kw)) flaggedSensationalCount++;
  }

  let flaggedEmotionalCount = 0;
  for (const kw of emotionalTriggers) {
    if (lower.includes(kw)) flaggedEmotionalCount++;
  }

  // Base score calculation
  let score = 82;

  // Penalties
  score -= flaggedSensationalCount * 14;
  score -= flaggedEmotionalCount * 8;
  if (metrics.uppercaseRatio > 0.15) score -= 12;
  if (metrics.exclamationCount > 2) score -= 8;

  score = clampScore(score);
  const verdict = getVerdictFromScore(score);

  // Fallacies & tactics
  const tactics: string[] = [];
  if (flaggedEmotionalCount > 0) tactics.push('Appeal to Fear & Outrage');
  if (metrics.uppercaseRatio > 0.1) tactics.push('Sensationalist Urgency');
  if (flaggedSensationalCount > 0) tactics.push('False Consensus & Conspiracy Framing');

  const claims: DetectedClaim[] = [];
  const sentences = rawText.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 15);

  let claimIdx = 1;
  for (const sentence of sentences) {
    const sLower = sentence.toLowerCase();
    const hasSensational = sensationalKeywords.some(kw => sLower.includes(kw));
    const hasEmotional = emotionalTriggers.some(kw => sLower.includes(kw));

    if (hasSensational || hasEmotional) {
      claims.push({
        id: `claim-${claimIdx++}`,
        text: sentence.trim(),
        verdict: hasSensational ? 'Dubious / Unsubstantiated' : 'Manipulative Tone',
        severity: hasSensational ? 'high' : 'medium',
        explanation: hasSensational
          ? 'Uses hyperbolic language without citing peer-reviewed empirical evidence or traceable primary sources.'
          : 'High emotional loading designed to induce outrage rather than report objective facts.',
        factCheckQuery: sentence.slice(0, 60).replace(/[^a-zA-Z0-9 ]/g, '') + ' fact check',
      });
      if (claims.length >= 4) break;
    }
  }

  const emotionalScore = clampScore(20 + flaggedEmotionalCount * 22 + (metrics.uppercaseRatio > 0.1 ? 25 : 0));

  return {
    id: `tl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    title: customTitle || (sentences[0]?.slice(0, 70) ? `${sentences[0].slice(0, 70)}...` : 'TruthLens Analysis Report'),
    rawText,
    credibilityScore: score,
    verdict,
    summary: score >= 65
      ? 'The submitted text demonstrates standard informational structure with relatively restrained vocabulary and verifiable claims.'
      : 'The submitted text displays markers frequently associated with misinformation or clickbait, including emotionally charged verbs and unsubstantiated generalizations.',
    emotionalManipulation: {
      score: emotionalScore,
      level: emotionalScore > 65 ? 'Severe' : emotionalScore > 35 ? 'Moderate' : 'Minimal',
      tacticsDetected: tactics.length > 0 ? tactics : ['Objective / Measured Tone'],
      explanation: emotionalScore > 50
        ? 'Rhetorical tone prioritizes sensational reactions and dramatic stakes over neutral factual attribution.'
        : 'Vocabulary remains reasonably neutral with minimal inflammatory adjectives.',
    },
    biasRating: {
      spectrum: flaggedSensationalCount > 1 ? 'Partisan Sensationalism' : 'Center / Balanced',
      score: 0,
      explanation: 'Algorithmic linguistic sweep detected balanced stylistic framing with minimal ideological polarization.',
    },
    dimensions: {
      factuality: clampScore(score + 4),
      sourceRigor: clampScore(score - 6),
      neutrality: clampScore(100 - emotionalScore),
      logicalConsistency: clampScore(score + 2),
      verifiability: clampScore(score - 4),
    },
    claims,
    fallacies: flaggedSensationalCount > 0 ? ['Hasty Generalization', 'Appeal to Emotion'] : [],
    recommendations: [
      'Cross-reference specific numerical statements with accredited wire services (AP, Reuters).',
      'Verify whether original quotes include complete contextual transcripts.',
      'Check if the publishing entity discloses editorial corrections and author credentials.'
    ],
    userEmail,
    modelUsed: 'TruthLens Multi-Heuristic NLP Engine',
  };
}
