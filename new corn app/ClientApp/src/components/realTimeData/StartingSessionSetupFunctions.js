// fills in needed information for initial session setup
const createSessionSetup = (selectedLaunchQSetKey) => {
    return {
        activeQSet: selectedLaunchQSetKey,
        sessionActive: true,
        currentQuestion: 0,
        nextQuestion: 0,
        timerToggled: false
    }
};

module.exports = { createSessionSetup }
