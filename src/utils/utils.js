const EXP_LEVEL_ONE = 100;
const DIFFICULTY = 0.70;

function calculateLevel(exp) {
    const level = (exp * DIFFICULTY) / EXP_LEVEL_ONE;
    return level;
}

module.exports = {
    calculateLevel
}