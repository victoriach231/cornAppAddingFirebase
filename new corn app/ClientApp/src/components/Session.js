// calculate how many questions a student got right in a session
function calculateScore(studentResponses, sessionCorrectAnswers) {
    let numQuestionsCorrect = 0;
    const numQuestions = sessionCorrectAnswers.length;

    for (let i = 0; i < numQuestions; i++) {
        // if the session question is not free response, check if the user's answer is equal to the session correct response
        // if the session question is a free response type, can accept any answer for now. instructor will go back and add point if correct

        if (sessionCorrectAnswers[i] !== "") {
            if (studentResponses[i] === sessionCorrectAnswers[i]) {
                numQuestionsCorrect += 1;
            }
        }        
        
    }
    return numQuestionsCorrect;
}

module.exports = calculateScore
