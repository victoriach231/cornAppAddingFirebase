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
