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

  // Incorrect position but on podium points
  votePrediction.forEach((driver, index) => {
    if (resultPodium.includes(driver) && votePrediction[index] !== resultPodium[index]) {
      points += 3;
    }
  });

  return points;
};