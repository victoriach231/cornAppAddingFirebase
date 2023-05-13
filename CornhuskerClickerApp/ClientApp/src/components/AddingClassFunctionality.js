const MAX_CLASSCODE = 99999;
const MIN_CLASSCODE = 10000;

// randomly generates 5 digit class code
const generateClassCode = () => {

    return Math.floor(Math.random() * (MAX_CLASSCODE - MIN_CLASSCODE + 1) + MIN_CLASSCODE).toString();
};

// fills in needed information for initial class setup
const createClassSetup = (inputedClassName, userID, classCodeToJoin) => {
    return {
        className: inputedClassName,
        sessionActive: false,
        students: [],
        admin: [
            userID
        ],
        classCode: classCodeToJoin
    }
};

module.exports = { generateClassCode, createClassSetup }
