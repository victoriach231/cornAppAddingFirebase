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

// creates the rows of data to export to csv file
const getSessionExportCSVDataNotAnonymousPolling = (presentStudents, studentScores, studentResponses) => {

    if ((presentStudents.length === studentResponses.length) && (presentStudents.length === studentScores.length)) {
        const rows = [];


        for (let i = 0; i < presentStudents.length; i++) {
            // add the student's name and session score to a csv row
            const row = [presentStudents[i], studentScores[i]];
            // add all of the student's answers as seprate enties/cells in the csv
            for (let j = 0; j < studentResponses[i].length; j++) {
                row.push(studentResponses[i][j]);
            }
            rows.push(row);
        }

        return rows;
    }
    return [];
};

// create the headings for the exported csv file
const getSessionExportCSVDataHeaders = (numQuestionsInSession) => {
    const headers = ["Student Name", "Session Score"];

    for (let i = 1; i <= numQuestionsInSession; i++) {
        const questionHeader = "Question " + i;
        headers.push(questionHeader);
    }
    return headers;

};

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

//const downloadCSVFileNotAnonymousPolling = (rows) => {
//    return "";
//};

module.exports = { calculateScore, getSessionExportCSVDataNotAnonymousPolling, getSessionExportCSVDataHeaders, download }


