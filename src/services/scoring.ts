export const calculatePoints = (vote: { prediction: string[] } | undefined, result: string[] | null) => {
  if (!vote || !result || !vote.prediction) {
    return 0;
  }

  let points = 0;
  const votePrediction = vote.prediction;
  const resultData = result;

  // 1. Exact position points (P1, P2, P3)
  // Only award points if the result for that position is actually set (non-empty string)
  if (resultData[0] && votePrediction[0] === resultData[0]) points += 10;
  if (resultData[1] && votePrediction[1] === resultData[1]) points += 8;
  if (resultData[2] && votePrediction[2] === resultData[2]) points += 5;

  // 2. Pole Position points (index 3)
  if (resultData[3] && votePrediction[3] === resultData[3]) {
    points += 5;
  }

  // 3. Incorrect position but on podium bonus (+3 pts)
  // Only for P1, P2, P3. We only check drivers that were NOT correctly guessed in their exact position.
  const votePodium = votePrediction.slice(0, 3).filter(id => id !== '');
  const actualPodium = resultData.slice(0, 3).filter(id => id !== '');

  votePodium.forEach((vDriver, vIdx) => {
    // If this driver is on the actual podium...
    if (actualPodium.includes(vDriver)) {
      // ...but NOT in the exact position the user guessed
      if (vDriver !== resultData[vIdx]) {
        points += 3;
      }
    }
  });

  return points;
};