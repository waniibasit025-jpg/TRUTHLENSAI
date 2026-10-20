import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clampScore,
  getVerdictFromScore,
  computeTextMetrics,
  segmentTextWithClaims,
  analyzeWithHeuristics,
  type DetectedClaim,
} from './analyzer.ts';

test('clampScore handles boundaries and NaN', () => {
  assert.equal(clampScore(120), 100);
  assert.equal(clampScore(-25), 0);
  assert.equal(clampScore(75.6), 76);
  assert.equal(clampScore(NaN), 50);
});

test('getVerdictFromScore correctly classifies ratings', () => {
  assert.equal(getVerdictFromScore(95), 'Reliable');
  assert.equal(getVerdictFromScore(80), 'Reliable');
  assert.equal(getVerdictFromScore(72), 'Mostly Credible');
  assert.equal(getVerdictFromScore(55), 'Questionable');
  assert.equal(getVerdictFromScore(30), 'High Risk');
  assert.equal(getVerdictFromScore(10), 'Fabricated / Misinformation');
});

test('computeTextMetrics extracts counts and ratios accurately', () => {
  const sample = 'BREAKING NEWS! Scientists discover MIRACLE cure.';
  const metrics = computeTextMetrics(sample);
  assert.equal(metrics.wordCount, 6);
  assert.ok(metrics.exclamationCount >= 1);
  assert.ok(metrics.uppercaseRatio > 0.3);
});

test('segmentTextWithClaims slices text non-destructively', () => {
  const rawText = 'The economy grew by 2 percent. Also this is a miracle cure for aging. The end.';
  const claims: DetectedClaim[] = [
    {
      id: 'c1',
      text: 'this is a miracle cure for aging',
      verdict: 'Dubious / Unsubstantiated',
      severity: 'high',
      explanation: 'Unsupported biological claim',
    },
  ];

  const segments = segmentTextWithClaims(rawText, claims);
  assert.ok(segments.length >= 3);
  const matched = segments.find(s => s.isClaim);
  assert.ok(matched);
  assert.equal(matched?.claim?.id, 'c1');
  // Full reconstruction must match rawText
  const reconstructed = segments.map(s => s.text).join('');
  assert.equal(reconstructed, rawText);
});

test('analyzeWithHeuristics generates structured report with user email', () => {
  const sensationalText = 'SHOCKING SECRET doctors dont want you to know! Outrageous hoax exposed immediately!';
  const result = analyzeWithHeuristics(sensationalText, 'wajhatbhai30@gmail.com', 'Sensational Leak');

  assert.equal(result.userEmail, 'wajhatbhai30@gmail.com');
  assert.ok(result.credibilityScore < 60);
  assert.ok(result.claims.length > 0);
  assert.ok(result.emotionalManipulation.score > 40);
  assert.equal(result.dimensions.neutrality <= 60, true);
});
