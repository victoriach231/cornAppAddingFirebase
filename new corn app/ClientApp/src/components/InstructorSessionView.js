import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { newClass } from './realTimeData/index';
import ListGroup from 'react-bootstrap/ListGroup';
import { getDatabase, ref, child, get, onValue, update } from "firebase/database";
import Form from 'react-bootstrap/Form';


//TODO: solve -1 error for seeing last questions responses
const sessionFunctions = require('./EndOfSessionFunctions');
// TODO import selected question set from class page
const db = getDatabase();

const InstructorSessionView = () => {
    // keep track of students in session in a list
    const [studentsInSession, setStudentsInSession] = useState([]);

    // get the id of the currently selected class
    const chosenClass = newClass;

    // toggle side bar that shows students currently in the session
    const [showStudentsBar, setShowStudentsBar] = useState(false);
    const handleStudentBarClose = () => setShowStudentsBar(false);
    const handleStudentBarShow = () => setShowStudentsBar(true);

    // get the id of the currently selected question set
    const chosenQuestionSet = "1234";
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [nextQuestionIndex, setNextQuestionIndex] = useState(0);

    const [currQuestionMap, setCurrQuestionMap] = useState();

    const [currQuestion, setCurrQuestion] = useState();
    const [nextQuestion, setNextQuestion] = useState();

    // keep track of question answers
    const [currQuestionAnswers, setCurrQuestionAnswers] = useState([]);

    // for timer
    let isSwitchOn = false;

    const [answerCountMap, setAnswerCountMap] = useState();

    // for timer
    const onSwitchAction = () => {
        console.log('IN THE TIMER SWITCH FUNCTION');
        isSwitchOn = !isSwitchOn;
        console.log(isSwitchOn);

        const updates = {};
        updates['classes/' + chosenClass + '/sessionActive/timerToggled'] = isSwitchOn;
        update(ref(db), updates);

    };

    const clearQuestionIndexDB = () => {
        const updates = {};
        updates['classes/' + chosenClass + '/sessionActive/currentQuestion'] = 0;
        update(ref(db), updates);
    };

    // update current question index in database
    const updateCurrQuestionIndexDB = (newIndex) => {
        const updates = {};
        updates['classes/' + chosenClass + '/sessionActive/currentQuestion'] = newIndex;
        update(ref(db), updates);
    };

    // get student answers to curr question TODO show / print frq student answers
    const getStudentAnswers = () => {
        get(child(ref(db), 'classes/' + chosenClass + '/sessionActive/activeStudents')).then((snapshot) => {
            if (snapshot.exists()) {
                console.log("start student answers");
                console.log(snapshot.val());

                // TODO put a if/else check here. do the stuff below if MC/TF
                let answerCount = new Map();
                    //answerList.forEach(answer => answerCount.set(answer, 0));
                console.log(currQuestionAnswers);

                currQuestionAnswers.forEach(answerOption => answerCount.set(answerOption, 0));
                console.log(currentQuestionIndex);

                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.val()) {
                        console.log(childSnapshot.val());
                        if (childSnapshot.val()['responses']) {
                            console.log(childSnapshot.val()['responses']);
                            if (childSnapshot.val()['responses'][currentQuestionIndex - 1]) {
                                console.log(childSnapshot.val());
                                console.log(currentQuestionIndex - 1);
                                console.log(childSnapshot.val()['responses']);
                                console.log(childSnapshot.val()['responses'][currentQuestionIndex - 1]);
                                const filteredArray = currQuestionAnswers.filter(value => childSnapshot.val()['responses'][currentQuestionIndex - 1].includes(value));
                                console.log(filteredArray);

                                filteredArray.forEach((answer => answerCount.set(answer, answerCount.get(answer) + 1)));

                                console.log(answerCount);
                                setAnswerCountMap(answerCount);
                            }
                        }
                    }
                });

                console.log(answerCount);
                //setAnswerCountMap(answerCount);

            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    };

    // get all the question set data, swap current / next question labels
    useEffect(() => {
        get(child(ref(getDatabase()), 'questionSets/' + chosenQuestionSet)).then((snapshot) => {

            if (snapshot.exists()) {

                if (nextQuestionIndex < snapshot.val().length) {

                    console.log(snapshot.val())
                    console.log("ah2");
                    console.log(nextQuestionIndex);
                    // displays first question in question set in the "next question" field
                    setNextQuestion(snapshot.val()[nextQuestionIndex]["qText"]);
                    if (nextQuestionIndex !== 0) {
                        console.log("in the if??????");
                        setCurrentQuestionIndex(nextQuestionIndex);
                        updateCurrQuestionIndexDB(nextQuestionIndex - 1);
                        setCurrQuestion(snapshot.val()[currentQuestionIndex]["qText"]);
                        console.log(currQuestion);

                        

                    }

                    //return snapshot.val();
                }
                // last swap
                else if (nextQuestionIndex === snapshot.val().length) {
                    console.log("in right place");
                    console.log(nextQuestionIndex);
                    console.log(currentQuestionIndex);
                    setCurrentQuestionIndex(nextQuestionIndex - 1);
                    updateCurrQuestionIndexDB(nextQuestionIndex - 1)
                    console.log(currentQuestionIndex);
                    setCurrQuestion(snapshot.val()[currentQuestionIndex]["qText"]);
                    console.log(currQuestion);
                    setNextQuestion();
                }
                else {
                    // no more questions left
                    console.log("in else");
                }

                // make curr question answer options show up

                if (nextQuestionIndex !== 0 || nextQuestionIndex === snapshot.val().length) {
                    // question is MC or TF
                    if (snapshot.val()[currentQuestionIndex]['answers']) {
                        let answerList = [];
                        const questionAnswers = snapshot.val()[currentQuestionIndex]['answers'];
                        questionAnswers.forEach(element => answerList.push(element['label']));
                        setCurrQuestionAnswers(answerList);
                        console.log("answer list:");
                        console.log(answerList);
                        console.log("question answers:");
                        console.log(questionAnswers);

                        console.log(answerList);
                        //let answerCount = new Map();
                        //answerList.forEach(answer => answerCount.set(answer, 0));
                        //console.log("ANSWER COUNT");
                        //console.log(answerCount);
                        //setAnswerCountMap(answerCount);
                        //console.log(answerCountMap);
                    }
                    else {
                        setCurrQuestionAnswers([]);
                    }

                    
                }


            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }, [nextQuestionIndex]);


    // grab the students that are in the session
    useEffect(() => {
        const studentsRef = ref(db, 'classes/' + chosenClass + '/sessionActive/activeStudents');
        onValue(studentsRef, (snapshot) => {
            console.log('for real');
            const data = snapshot.val();
            console.log(data);
            if (data != null) {
                

                //// count of responses
                //console.log(data);
                //console.log(currentQuestionIndex)
                //console.log(Object.values(data));
                //console.log('8888888888888');
                ////Object.values(data).forEach(user => console.log(user['responses'][currentQuestionIndex]));

                //Object.values(data).forEach(user => {
                //    //console.log(user['responses'][currentQuestionIndex]);
                //    //console.log(user['responses'][currentQuestionIndex][currentQuestionIndex]);
                //    let response = user['responses'][currentQuestionIndex][currentQuestionIndex];

                //    answerCountMap.set(response, answerCountMap.get(response) + 1);

                //});
                //answerCountMap.get(currentQuestionIndex)

                //console.log('ansswers.....');
                //console.log(answerCountMap);


 

                const idsOfStudentsInSession = Object.keys(data);
                const allUsers = get(child(ref(db), 'users/')).then((snapshot) => {
                    if (snapshot.exists()) {


                        let studentNameList = [];


                        idsOfStudentsInSession.forEach(element => studentNameList.push(snapshot.val()[element]['name']));


                        console.log(studentNameList);
                        setStudentsInSession(studentNameList);

                        return snapshot.val();
                    } else {
                        console.log("No data available");
                    }
                });
            }
        });
    }, []);


    

    return (
        <div>
            <p> hi welcome to instructor view of session </p>
            <br />

            <Button variant="primary" onClick={handleStudentBarShow}>
                See students in the session
            </Button>

            <Offcanvas show={showStudentsBar} onHide={handleStudentBarClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Students in the session:</Offcanvas.Title>
                </Offcanvas.Header>
                <div>
                    <Offcanvas.Body>
                        <h6>Number of students joined: {studentsInSession.length}</h6>
                        <ListGroup>
                            {studentsInSession.map((element, index) => {
                                return (
                                    <div key={index}>
                                        <ListGroup.Item>{element}</ListGroup.Item>
                                    </div>
                                );
                            })}

                        </ListGroup>
                    </Offcanvas.Body>
                </div>
            </Offcanvas>
            <p>Current question:</p>
            <p>{currQuestion}</p>
            <br />
            <ListGroup>
                {currQuestionAnswers.map((element, index) => {
                    return (
                        <div key={index}>
                            <ListGroup.Item>{element} &nbsp;&nbsp;&nbsp; {answerCountMap ? answerCountMap.get(element) : "Why here??"}</ListGroup.Item>
                        </div>
                    );
                })}

            </ListGroup>

            <br />

            <p>Next question:</p>
            <p>{nextQuestion}</p>
            <Form.Check // prettier-ignore
                type="switch"
                id="custom-switch"
                label="Set timer?"
                onChange={onSwitchAction}
            />
            <Button onClick={() => { setNextQuestionIndex(nextQuestionIndex + 1); setAnswerCountMap(new Map()) }}>Display Question</Button>

            <br />
            <button onClick={clearQuestionIndexDB}>clear curr question index</button>
            <br />
            <Button onClick={getStudentAnswers}>See current student answers</Button>

            

            <button onClick={() => { sessionFunctions.download(["a", "b"], "filee") }}>Download CSV</button>
        </div>
    );
};
export default InstructorSessionView;

