export function calculateEmailScore(scenario, verdict, selectedFlags) {
  let score = 0;
  let isCorrect = false;

  const expectedType = scenario.type;
  const expectedFlags = scenario.redFlags || [];

  if (verdict === expectedType) {
    score += 50;
    isCorrect = true;
  } else if (expectedType === "phishing" && verdict === "suspicious") {
    score += 20;
  } else if (expectedType === "legitimate" && verdict === "suspicious") {
    score += 0;
  } else if (expectedType === "legitimate" && verdict === "phishing") {
    score -= 10;
  } else if (expectedType === "phishing" && verdict === "legitimate") {
    score -= 20;
  }

  const matchedFlags = selectedFlags.filter((flag) =>
    expectedFlags.includes(flag),
  );

  const falseFlags = selectedFlags.filter(
    (flag) => !expectedFlags.includes(flag),
  );

  score += matchedFlags.length * 8;
  score -= falseFlags.length * 3;

  if (expectedType === "phishing" && matchedFlags.length === 0) {
    score -= 10;
  }

  if (
    isCorrect &&
    falseFlags.length === 0 &&
    matchedFlags.length === expectedFlags.length
  ) {
    score += 10;
  }

  if (score < 0) score = 0;
  if (score > 100) score = 100;

  return {
    score,
    isCorrect,
    matchedFlags,
    falseFlags,
    missedFlags: expectedFlags.filter((flag) => !selectedFlags.includes(flag)),
  };
}

export function getFinalStats(results) {
  const totalScore = results.reduce((acc, item) => acc + item.score, 0);
  const correct = results.filter((item) => item.isCorrect).length;
  const phishingCaught = results.filter(
    (item) => item.expectedType === "phishing" && item.verdict === "phishing",
  ).length;
  const falsePositives = results.filter(
    (item) => item.expectedType === "legitimate" && item.verdict === "phishing",
  ).length;
  const falseNegatives = results.filter(
    (item) => item.expectedType === "phishing" && item.verdict === "legitimate",
  ).length;

  return {
    totalScore,
    accuracy: results.length ? Math.round((correct / results.length) * 100) : 0,
    phishingCaught,
    falsePositives,
    falseNegatives,
  };
}
