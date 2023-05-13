const startingSessionFunctions = require('./StartingSessionSetupFunctions');

describe("test session setup correctly", function () {
    test('test that generated session info is formatted well', () => {
        const selectedLaunchQSetKey = "-ABC";

        const generatedSessionInfoJSON = startingSessionFunctions.createSessionSetup(selectedLaunchQSetKey);
        const expectedSessionInfoJSON = {
            activeQSet: selectedLaunchQSetKey,
            sessionActive: true,
            currentQuestion: 0,
            nextQuestion: 0,
            timerToggled: false
        };

        expect(generatedSessionInfoJSON).toEqual(expectedSessionInfoJSON);

    });

    test('test that generated session info is formatted well - has the correct number of elements', () => {
        const selectedLaunchQSetKey = "-ABC";

        const generatedSessionInfoJSON = startingSessionFunctions.createSessionSetup(selectedLaunchQSetKey);
        const expectedSessionInfoJSON = {
            activeQSet: selectedLaunchQSetKey,
            sessionActive: true,
            currentQuestion: 0,
            nextQuestion: 0,
            timerToggled: false
        };

        expect(generatedSessionInfoJSON).toMatchObject(expectedSessionInfoJSON);

    });

    test('test that generated session info is formatted well - fully check same structure and type', () => {
        const selectedLaunchQSetKey = "-ABC";

        const generatedSessionInfoJSON = startingSessionFunctions.createSessionSetup(selectedLaunchQSetKey);
        const expectedSessionInfoJSON = {
            activeQSet: selectedLaunchQSetKey,
            sessionActive: true,
            currentQuestion: 0,
            nextQuestion: 0,
            timerToggled: false
        };

        expect(generatedSessionInfoJSON).toStrictEqual(expectedSessionInfoJSON);

    });

    test('test that generated session info is formatted well - no qSet name entered', () => {
        const selectedLaunchQSetKey = "";

        const generatedSessionInfoJSON = startingSessionFunctions.createSessionSetup(selectedLaunchQSetKey);
        const expectedSessionInfoJSON = {
            activeQSet: selectedLaunchQSetKey,
            sessionActive: true,
            currentQuestion: 0,
            nextQuestion: 0,
            timerToggled: false
        };

        expect(generatedSessionInfoJSON).toEqual(expectedSessionInfoJSON);

    });

    test('test that generated session info is formatted well - objects fully equal structure, check undefined properties', () => {
        const selectedLaunchQSetKey = undefined;

        const generatedSessionInfoJSON = startingSessionFunctions.createSessionSetup(selectedLaunchQSetKey);
        const expectedSessionInfoJSON = {
            activeQSet: selectedLaunchQSetKey,
            sessionActive: true,
            currentQuestion: 0,
            nextQuestion: 0,
            timerToggled: false
        };

        expect(generatedSessionInfoJSON).toStrictEqual(expectedSessionInfoJSON);

    });
    
});