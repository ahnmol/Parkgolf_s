export const calculateScores = (allScores) => {
  const processedScores = {};
  Object.keys(allScores).forEach(courseKey => {
    processedScores[courseKey] = allScores[courseKey].map(val => {
      if (val === '' || isNaN(val)) return 0;
      return parseInt(val, 10);
    });
  });
  return processedScores;
};

export const calculateTotalScore = (courses) => {
  return Object.values(courses).reduce((sum, courseScores) => {
    return sum + courseScores.reduce((courseSum, score) => courseSum + score, 0);
  }, 0);
}; 