export const calculatePoints = (vote: { prediction: string[] } | undefined, result: string[] | null) => {
  if (!vote || !result) {
    return 0;
  }

  let points = 0;
  const votePrediction = vote.prediction; // Changed from vote.podium
  const resultPodium = result;

  // Exact position points
  if (votePrediction[0] === resultPodium[0]) points += 10;
  if (votePrediction[1] === resultPodium[1]) points += 8;
  if (votePrediction[2] === resultPodium[2]) points += 5;

  // Pole Position points (index 3)
  if (votePrediction[3] && resultPodium[3] && votePrediction[3] === resultPodium[3]) {
    points += 5;
  }

  // Incorrect position but on podium points (only for indices 0, 1, 2)
  const votePodium = votePrediction.slice(0, 3);
  const actualPodium = resultPodium.slice(0, 3);

  votePodium.forEach((driver, index) => {
    if (actualPodium.includes(driver) && votePodium[index] !== actualPodium[index]) {
      points += 3;
    }
  });

  return points;
};