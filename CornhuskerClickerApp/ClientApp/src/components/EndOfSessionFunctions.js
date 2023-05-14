// calculate how many questions a student got right in a session
const calculateScore = (studentResponses, sessionCorrectAnswers) => {
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

// downloads a csv file to the user's computer with the given data
const download = (data, fileName) => {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', fileName + '.csv');
    a.textContent = 'click to download';
    document.querySelector('body').append(a);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

module.exports = { calculateScore, download }