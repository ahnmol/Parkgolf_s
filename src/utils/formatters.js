export const formatFileName = (name, extension) => {
  return name
    ? `${name.replace(/\s+/g, '_')}.${extension}`
    : `tournament_data.${extension}`;
};

export const sanitizeScore = (score) => {
  return parseInt(score, 10) || 0;
}; 