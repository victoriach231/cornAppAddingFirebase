const MAX_CLASSCODE = 99999;
const MIN_CLASSCODE = 10000;

const generateClassCode = () => {

    return Math.floor(Math.random() * (MAX_CLASSCODE - MIN_CLASSCODE + 1) + MIN_CLASSCODE).toString();
};

module.exports = { generateClassCode }
