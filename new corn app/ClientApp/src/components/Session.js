const sessionFunctions = require('./EndOfSessionFunctions');

const Session = () => {
    return (
        <div>
            <p> hi welcome to session</p>
            <br />

            <button onClick={() => { sessionFunctions.download(["a", "b"], "filee") }}>Download CSV</button>
        </div>
    );
};
export default Session;
