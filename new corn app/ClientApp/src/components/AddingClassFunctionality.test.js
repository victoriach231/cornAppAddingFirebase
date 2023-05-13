const classFunctions = require('./AddingClassFunctionality');

const MAX_CLASSCODE = 99999;
const MIN_CLASSCODE = 10000;

describe("test created class code correctly", function () {
    test('test that generated code is greater than the min code', () => {
        const generatedCodeAsInt = parseInt(classFunctions.generateClassCode());
        expect(generatedCodeAsInt).toBeGreaterThan(MIN_CLASSCODE);

    });

    test('test that generated code is less than the max code', () => {
        const generatedCodeAsInt = parseInt(classFunctions.generateClassCode());
        expect(generatedCodeAsInt).toBeLessThan(MAX_CLASSCODE);

    });

    test('test that generated code is defined', () => {
        const generatedCodeAsInt = parseInt(classFunctions.generateClassCode());
        expect(generatedCodeAsInt).toBeDefined();

    });

    test('test that generated code is not null', () => {
        const generatedCodeAsInt = parseInt(classFunctions.generateClassCode());
        expect(generatedCodeAsInt).not.toBeNull();

    });
});

describe("testing setting up class info when a new class is created", function () {
    test('test that generated class info is formatted well', () => {
        const inputedClassName = "my class name";
        const userID = "-ABC";
        const classCodeToJoin = "12345";

        const generatedClassInfoJSON = classFunctions.createClassSetup(inputedClassName, userID, classCodeToJoin);
        const expectedClassInfoJSON = {
            className: inputedClassName,
            sessionActive: false,
            students: [],
            admin: [
                userID
            ],
            classCode: classCodeToJoin
        };

        expect(generatedClassInfoJSON).toEqual(expectedClassInfoJSON);

    });

    test('test that generated class info is formatted well - has fully correct elements and data types', () => {
        const inputedClassName = "my class name";
        const userID = "-ABC";
        const classCodeToJoin = "12345";

        const generatedClassInfoJSON = classFunctions.createClassSetup(inputedClassName, userID, classCodeToJoin);
        const expectedClassInfoJSON = {
            className: inputedClassName,
            sessionActive: false,
            students: [],
            admin: [
                userID
            ],
            classCode: classCodeToJoin
        };

        expect(generatedClassInfoJSON).toMatchObject(expectedClassInfoJSON);

    });

    test('test that generated class info is formatted well - has all needed keys', () => {
        const inputedClassName = "my class name";
        const userID = "-ABC";
        const classCodeToJoin = "12345";

        const generatedClassInfoJSON = classFunctions.createClassSetup(inputedClassName, userID, classCodeToJoin);
        const generatedClassInfoJSONKeys = Object.keys(generatedClassInfoJSON);

        const expectedClassInfoJSON = {
            className: inputedClassName,
            sessionActive: false,
            students: [],
            admin: [
                userID
            ],
            classCode: classCodeToJoin
        };
        const expectedClassInfoJSONKeys = Object.keys(expectedClassInfoJSON);

        expect(generatedClassInfoJSONKeys).toMatchObject(expectedClassInfoJSONKeys);

    });

    test('test that generated class info is formatted well - fully check same structure and type', () => {
        const inputedClassName = "my class name";
        const userID = "-ABC";
        const classCodeToJoin = "12345";

        const generatedClassInfoJSON = classFunctions.createClassSetup(inputedClassName, userID, classCodeToJoin);
        const expectedClassInfoJSON = {
            className: inputedClassName,
            sessionActive: false,
            students: [],
            admin: [
                userID
            ],
            classCode: classCodeToJoin
        };

        expect(generatedClassInfoJSON).toStrictEqual(expectedClassInfoJSON);

    });

    test('test that generated class info is formatted well - no class name entered', () => {
        const inputedClassName = "";
        const userID = "-ABC";
        const classCodeToJoin = "12345";

        const generatedClassInfoJSON = classFunctions.createClassSetup(inputedClassName, userID, classCodeToJoin);
        const expectedClassInfoJSON = {
            className: "",
            sessionActive: false,
            students: [],
            admin: [
                userID
            ],
            classCode: classCodeToJoin
        };

        expect(generatedClassInfoJSON).toEqual(expectedClassInfoJSON);

    });

    test('test that generated class info is formatted well - objects fully equal structure, check undefined properties', () => {
        const inputedClassName = undefined;
        const userID = undefined;
        const classCodeToJoin = undefined;

        const generatedClassInfoJSON = classFunctions.createClassSetup(inputedClassName, userID, classCodeToJoin);
        const expectedClassInfoJSON = {
            className: inputedClassName,
            sessionActive: false,
            students: [],
            admin: [
                userID
            ],
            classCode: classCodeToJoin
        };

        expect(generatedClassInfoJSON).toStrictEqual(expectedClassInfoJSON);

    });

    
});