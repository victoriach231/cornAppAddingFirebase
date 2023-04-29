const sessionFunctions = require('./EndOfSessionFunctions');

describe("tests to calculate number of correct answers a users got after a session", function () {
    test('test multiple choice and T/F session answers', () => {
        const sessionAnswers = ["A", "C", "B", "T", "F"];
        const userAnswers = ["A", "D", "B", "T", "T"];
        expect(sessionFunctions.calculateScore(userAnswers, sessionAnswers)).toBe(3);

    });

    test('test multiple choice and T/F session answers - user skipped question', () => {
        const sessionAnswers = ["A", "C", "B"];
        const userAnswers = ["A", "", "B"];
        expect(sessionFunctions.calculateScore(userAnswers, sessionAnswers)).toBe(2);

    });

    test('test free response session answers', () => {
        const sessionAnswers = ["A", "", "B"];
        const userAnswers = ["A", "testing free response", "B"];
        expect(sessionFunctions.calculateScore(userAnswers, sessionAnswers)).toBe(2);

    });

    test('test user didnt answer any questions', () => {
        const sessionAnswers = ["A", "", "B"];
        const userAnswers = ["", "", ""];
        expect(sessionFunctions.calculateScore(userAnswers, sessionAnswers)).toBe(0);

    });

    test('test user answered all questions incorrectly', () => {
        const sessionAnswers = ["A", "C", "B"];
        const userAnswers = ["B", "A", "C"];
        expect(sessionFunctions.calculateScore(userAnswers, sessionAnswers)).toBe(0);

    });

    test('test user answered only free response questions', () => {
        const sessionAnswers = ["", "", ""];
        const userAnswers = ["test", "free", "responses"];
        expect(sessionFunctions.calculateScore(userAnswers, sessionAnswers)).toBe(0);

    });
});


describe("creating rows of data to export tests", function () {
    test('test rows for csv export formatted correctly', () => {
        const presentStudents = ["victoria", "josh", "b", "carina"];
        const studentScores = [3, 5, 8, 3];
        const studentResponses = [["A", "C", "B"], ["A", "", "B"], ["B", "C", "B"], ["A", "C", "D"]];

        const expectedRows = [["victoria", 3, "A", "C", "B"], ["josh", 5, "A", "", "B"], ["b", 8, "B", "C", "B"], ["carina", 3, "A", "C", "D"]];
        expect(sessionFunctions.getSessionExportCSVDataNotAnonymousPolling(presentStudents, studentScores, studentResponses)).toEqual(expectedRows);

    });

    test('test rows for csv export formatted correctly - number of rows correct', () => {
        const presentStudents = ["victoria", "josh", "b", "carina", "firestone"];
        const studentScores = [3, 5, 8, 3, 6];
        const studentResponses = [["A", "C", "B"], ["A", "", "B"], ["B", "C", "B"], ["A", "C", "D"], ["C", "C", "D"]];

        const expectedNumRows = 5;
        expect(sessionFunctions.getSessionExportCSVDataNotAnonymousPolling(presentStudents, studentScores, studentResponses).length).toEqual(expectedNumRows);

    });

    test('test rows for csv export formatted correctly - no student scores', () => {
        const presentStudents = ["victoria", "josh", "b", "carina"];
        const studentScores = [];
        const studentResponses = [["A", "C", "B"], ["A", "", "B"], ["B", "C", "B"], ["A", "C", "D"]];

        const expectedRows = [];
        expect(sessionFunctions.getSessionExportCSVDataNotAnonymousPolling(presentStudents, studentScores, studentResponses)).toEqual(expectedRows);

    });

    test('test rows for csv export formatted correctly - missing student response', () => {
        const presentStudents = ["victoria", "josh", "b", "carina"];
        const studentScores = [];
        const studentResponses = [["A", "C", "B"], ["A", "", "B"], ["B", "C", "B"]];

        const expectedRows = [];
        expect(sessionFunctions.getSessionExportCSVDataNotAnonymousPolling(presentStudents, studentScores, studentResponses)).toEqual(expectedRows);

    });

    test('test rows for csv export formatted correctly - missing all data', () => {
        const presentStudents = [];
        const studentScores = [];
        const studentResponses = [];

        const expectedRows = [];
        expect(sessionFunctions.getSessionExportCSVDataNotAnonymousPolling(presentStudents, studentScores, studentResponses)).toEqual(expectedRows);

    });
});


describe("test created csv headers properly", function () {
    test('test headers for csv export formatted correctly', () => {
        const numQuestionsInSession = 2;

        const expectedHeaders = ["Student Name", "Session Score", "Question 1", "Question 2"];
        expect(sessionFunctions.getSessionExportCSVDataHeaders(numQuestionsInSession)).toEqual(expectedHeaders);

    });

    test('test headers for csv export formatted correctly - no questions', () => {
        const numQuestionsInSession = 0;

        const expectedHeaders = ["Student Name", "Session Score"];
        expect(sessionFunctions.getSessionExportCSVDataHeaders(numQuestionsInSession)).toEqual(expectedHeaders);

    });

    test('test headers for csv export formatted correctly - negative questions', () => {
        const numQuestionsInSession = -1;

        const expectedHeaders = ["Student Name", "Session Score"];
        expect(sessionFunctions.getSessionExportCSVDataHeaders(numQuestionsInSession)).toEqual(expectedHeaders);

    });
});



