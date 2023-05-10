import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { newClass } from './realTimeData/index';
import { launchedQSetKey } from './realTimeData/questionSetDisplay';
import ListGroup from 'react-bootstrap/ListGroup';
import { getDatabase, ref, child, get, onValue, update } from "firebase/database";
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import './CSS/InstructorSessionView.css'


//TODO: solve -1 error for seeing last questions responses
const sessionFunctions = require('./EndOfSessionFunctions');
// TODO import selected question set from class page
const db = getDatabase();



const InstructorSessionView = () => {
    const navigate = useNavigate();

    // keep track of students in session in a list
    const [studentsInSession, setStudentsInSession] = useState([]);

    // get the id of the currently selected class
    const chosenClass = newClass;

    // get the display name of the currently selected class
    let chosenClassDisplayName = "";
    const displayNameRef = ref(db, 'classes/' + chosenClass + "/className/");
    onValue(displayNameRef, (snapshot) => {
        const data = snapshot.val();
        chosenClassDisplayName = data;
    });

    // toggle side bar that shows students currently in the session
    const [showStudentsBar, setShowStudentsBar] = useState(false);
    const handleStudentBarClose = () => setShowStudentsBar(false);
    const handleStudentBarShow = () => setShowStudentsBar(true);

    // get the id of the currently selected question set
    const chosenQuestionSet = launchedQSetKey;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [nextQuestionIndex, setNextQuestionIndex] = useState(0);
    const [currQuestionType, setCurrQuestionType] = useState();
    const [FRQResponses, setFRQResponses] = useState([]);

    const [currQuestionMap, setCurrQuestionMap] = useState();

    const [currQuestion, setCurrQuestion] = useState("");
    const [nextQuestion, setNextQuestion] = useState("");

    // keep track of question answers (all of the possible answer options)
    const [currQuestionAnswers, setCurrQuestionAnswers] = useState([]);

    // for timer
    let isSwitchOn = false;

    // for anonymous session
    const [anonymousState, setAnonymousState] = useState(false);

    const [answerCountMap, setAnswerCountMap] = useState();

    // TODO is this timer code used?? or just student session view timer code?
    // for timer
    const onSwitchAction = () => {
        console.log('IN THE TIMER SWITCH FUNCTION');
        isSwitchOn = !isSwitchOn;
        console.log(isSwitchOn);

        const updates = {};
        updates['classes/' + chosenClass + '/sessionActive/timerToggled'] = isSwitchOn;
        update(ref(db), updates);

    };

    // for anonymous session
    const onAnonymousAction = () => {
        setAnonymousState(!anonymousState);
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

    // get student answers to curr question 
    const getStudentAnswers = () => {
        console.log("qtype");
        console.log(currQuestionType);

        get(child(ref(db), 'classes/' + chosenClass + '/sessionActive/activeStudents')).then((snapshot) => {
            if (snapshot.exists()) {


                if ((currQuestionType === 'multi') || (currQuestionType === 'TF')) {
                    let answerCount = new Map();
                    //answerList.forEach(answer => answerCount.set(answer, 0));
                    currQuestionAnswers.forEach(answerOption => answerCount.set(answerOption, 0));

                    snapshot.forEach((childSnapshot) => {
                        if (childSnapshot.val()) {
                            if (childSnapshot.val()['responses']) {
                                if (childSnapshot.val()['responses'][currentQuestionIndex]) {
                                    console.log(" curr index");
                                    console.log(currentQuestionIndex);
                                    // TODO add an if check to handle if one of the students in the sesion hasn't answered the curr question yet
                                    console.log(childSnapshot.val()['responses'][currentQuestionIndex][currentQuestionIndex]);
                                    console.log(currQuestionAnswers);
                                    const filteredArray = currQuestionAnswers.filter(value => childSnapshot.val()['responses'][currentQuestionIndex][currentQuestionIndex].includes(value));
                                    console.log("filtered Array");
                                    console.log(filteredArray);

                                    filteredArray.forEach((answer => answerCount.set(answer, answerCount.get(answer) + 1)));
                                    console.log("ansewr count");
                                    console.log(answerCount);
                                    setAnswerCountMap(answerCount);
                                }
                            }
                        }
                    });

                    console.log(answerCount);
                    //setAnswerCountMap(answerCount);
                }
                else if (currQuestionType === "short") {
                    let studentFRQAnswers = [];
                    snapshot.forEach((childSnapshot) => {
                        if (childSnapshot.val()) {
                            if (childSnapshot.val()['responses']) {
                                if (childSnapshot.val()['responses'][currentQuestionIndex]) {
                                    studentFRQAnswers.push(childSnapshot.val()['responses'][currentQuestionIndex][currentQuestionIndex]);
                                    setFRQResponses(studentFRQAnswers);
                                }
                            }
                        }
                    });
                }


            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    };

    // get all the question set data, swap current / next question labels
    useEffect(() => {
        get(child(ref(getDatabase()), 'questionSets/' + chosenQuestionSet + '/qSet')).then((snapshot) => {

            if (snapshot.exists()) {
                let currIndex = nextQuestionIndex - 1;
                console.log(currIndex);
                if (nextQuestionIndex < snapshot.val().length) {


                    // displays first question in question set in the "next question" field
                    setNextQuestion(snapshot.val()[nextQuestionIndex]["qText"]);
                    if (nextQuestionIndex !== 0) {

                        console.log("curr index");
                        console.log(currentQuestionIndex);
                        setCurrentQuestionIndex(currIndex);
                        console.log(currentQuestionIndex);
                        console.log("next index");
                        console.log(nextQuestionIndex);
                        updateCurrQuestionIndexDB(currIndex);
                        console.log(nextQuestionIndex);
                        console.log(currentQuestionIndex);


                        const currQJSON = snapshot.val()
                        console.log(currQJSON[currentQuestionIndex].qText)
                        setCurrQuestion(currQJSON[currIndex].qText);

                        // TODO PRINTING ONE QUESTION BEHIND
                        setCurrQuestionType(snapshot.val()[currIndex]["qType"]["value"]);
                        console.log(snapshot.val()[currIndex]["qType"]["value"]);
                        console.log(currQuestionType);


                    }

                    //return snapshot.val();
                }
                // last swap
                else if (nextQuestionIndex === snapshot.val().length) {
                    console.log("curr index");
                    console.log(currentQuestionIndex);

                    setCurrentQuestionIndex(currIndex);
                    console.log(currentQuestionIndex);
                    updateCurrQuestionIndexDB(currIndex)
                    console.log(currentQuestionIndex);

                    setCurrQuestion(snapshot.val()[currIndex]["qText"]);
                    setCurrQuestionType(snapshot.val()[currIndex]["qType"]["value"]);
                    setNextQuestion();
                }
                else {
                    // no more questions left
                    console.log("in else");
                }

                // make curr question answer options show up
                // || nextQuestionIndex === snapshot.val().length
                if (nextQuestionIndex !== 0 || nextQuestionIndex === snapshot.val().length) {
                    // question is MC or TF
                    if (snapshot.val()[currIndex]['answers']) {
                        let answerList = [];
                        const questionAnswers = snapshot.val()[currIndex]['answers'];
                        questionAnswers.forEach(element => answerList.push(element['label']));
                        setCurrQuestionAnswers(answerList);

                        //let answerCount = new Map();
                        //answerList.forEach(answer => answerCount.set(answer, 0));
                        //console.log("ANSWER COUNT");
                        //console.log(answerCount);
                        //setAnswerCountMap(answerCount);
                        //console.log(answerCountMap);
                    }
                    else {
                        console.log("why HERE");
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
        const studentsRef = ref(db, 'classes/' + chosenClass + '/sessionActive');
        onValue(studentsRef, (snapshot) => {
            console.log('for real');
            const data = snapshot.val();
            console.log(data['activeStudents']);
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


 

                const idsOfStudentsInSession = Object.keys(data['activeStudents']);
                const allUsers = get(child(ref(db), 'users/')).then((snapshot) => {
                    if (snapshot.exists()) {

                        let studentNameList = [];

                        // if not in anonymous session, show student answers in list of students in session
                        if (!anonymousState) {
                            idsOfStudentsInSession.forEach(element => studentNameList.push([snapshot.val()[element]['name'], data['activeStudents'][element]['responses'][currentQuestionIndex - 1]]));
                        } else {
                            // otherwise, show a checkmark indicating student has answered
                            idsOfStudentsInSession.forEach(element => studentNameList.push([snapshot.val()[element]['name'], "✅"]));    
                        }

                        setStudentsInSession(studentNameList);

                        return snapshot.val();
                    } else {
                        console.log("No data available");
                    }
                });
            }
        });
    }, [currentQuestionIndex]);

    const backNavigate = e => {
        navigate('/Class');
    };
    

    return (
        <div>
            <div class='header'>
                <div class='corner'>
                    <button onClick={backNavigate}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="arrow-back" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                        </svg>

                    </button>

                </div>
                <h1> Instructor Session View: {chosenClassDisplayName} </h1>
                

                
            </div>
           
            

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
                                        <ListGroup.Item>{element[0]}<Badge bg="primary" pill>{element[1]}</Badge></ListGroup.Item>
                                    </div>
                                );
                            })}

                        </ListGroup>
                    </Offcanvas.Body>
                </div>
            </Offcanvas>
            <div className='box'>
            <div className='questions'>
            <p><b>Current question:</b></p>
            <h1>{currQuestion}</h1>
            
            {
                (currQuestionType === "short") ?
                    <div>
                        <ListGroup>
                            {FRQResponses.map((element, index) => {
                                return (
                                    <div key={index}>
                                        <ListGroup.Item>{element}</ListGroup.Item>
                                    </div>
                                );
                            })}

                        </ListGroup>
                    </div>

                    :
                    <div>
                        <ListGroup>
                            {currQuestionAnswers.map((element, index) => {
                                return (
                                    <div key={index}>
                                        <ListGroup.Item>{String(element)} &nbsp;&nbsp;&nbsp; {answerCountMap ? answerCountMap.get(element) : "Why here??"}</ListGroup.Item>
                                    </div>
                                );
                            })}

                        </ListGroup>
                            <Button class="btn btn-primary" onClick={getStudentAnswers}>See Current Student Responses</Button>
                        
                        


                    </div>
                    }
                </div>
                </div>

            <br />
            <div className='aBox'>
            <div className = 'questions'>
                    <p><b>Next question:</b></p>
                    <h1>{nextQuestion}</h1>
                </div>
            <div className='switches'>
            <Form.Check // prettier-ignore
                type="switch"
                id="custom-switch"
                label="Set timer?"
                onChange={onSwitchAction}
            />
            <Form.Check // prettier-ignore
                type="switch"
                id="custom-switch"
                label="Anonymous Session?"
                onChange={onAnonymousAction}
            />
            <Button onClick={() => { setNextQuestionIndex(nextQuestionIndex + 1); setAnswerCountMap(new Map()) }}>Display Next Question</Button>

                    
           </div>
            </div>
            <br />
            <Button variant="primary" onClick={handleStudentBarShow}>
                See Students in Session
                            </Button>
            

            

            <button class="btn btn-primary" onClick={() => { sessionFunctions.download(["a", "b"], "filee") }}>Download CSV</button>
        </div>
    );
};
export default InstructorSessionView;

