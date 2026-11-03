function filterSkillsByCategory(skills, category) {
  if (category === 'All') {
    return skills;
  }
  return skills.filter(skill => skill.category === category);
}

function calculateTotalCosts(hourlyRate, hours) {
  return hourlyRate * hours;
}

function matchSkillsToUser(userNeeds, skills) {
  return skills.filter(skill => skill.category === userNeeds.category && skill.price <= userNeeds.maxPrice);
}

// Keep at bottom of file
if (typeof module !== 'undefined') {
    module.exports = { filterSkillsByCategory, calculateTotalCosts, matchSkillsToUser};
};
