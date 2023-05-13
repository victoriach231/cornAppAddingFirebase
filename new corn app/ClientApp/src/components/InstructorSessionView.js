import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { newClass } from './realTimeData/ClassDisplay';
import { launchedQSetKey, stopSession } from './realTimeData/questionSetDisplay';
import ListGroup from 'react-bootstrap/ListGroup';
import { getDatabase, ref, child, get, onValue, update } from "firebase/database";
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import { calculateScore } from './EndOfSessionFunctions';
import './CSS/InstructorSessionView.css'

const sessionFunctions = require('./EndOfSessionFunctions');
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

    // showing end session popup 
    const [showEndSession, setShowEndSession] = useState(false);
    const handleCloseEndSession = () => setShowEndSession(false);
    const handleShowEndSession = () => {
        getStudentResults()
        setShowEndSession(true)
    }

    //end session
    const handleEndSession = () => {
        stopSession(chosenClass)
        navigate('/class')
    }

    // for the csv formatted data
    const [csvFormattedData, setCsvFormattedData] = useState(["a", "b"]);
    let date = new Date().toJSON().slice(0, 10);

    // for timer
    let isSwitchOn = false;

    // for anonymous session
    const [anonymousState, setAnonymousState] = useState(false);

    const [answerCountMap, setAnswerCountMap] = useState();

    // for timer
    const onSwitchAction = () => {
        isSwitchOn = !isSwitchOn;

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

        const updates2 = {};
        updates2['classes/' + chosenClass + '/sessionActive/nextQuestion'] = newIndex + 1;
        update(ref(db), updates2);
    };

    // get student answers to curr question 
    const getStudentAnswers = () => {
        get(child(ref(db), 'classes/' + chosenClass + '/sessionActive/activeStudents')).then((snapshot) => {
            if (snapshot.exists()) {
                if ((currQuestionType === 'multi') || (currQuestionType === 'TF')) {
                    let answerCount = new Map();
                    currQuestionAnswers.forEach(answerOption => answerCount.set(answerOption, 0));

                    snapshot.forEach((childSnapshot) => {
                        if (childSnapshot.val()) {
                            if (childSnapshot.val()['responses']) {
                                if (childSnapshot.val()['responses'][currentQuestionIndex]) {
                                    const filteredArray = currQuestionAnswers.filter(value => childSnapshot.val()['responses'][currentQuestionIndex] === value);
                                 
                                    filteredArray.forEach((answer => answerCount.set(answer, answerCount.get(answer) + 1)));
                                    setAnswerCountMap(answerCount);
                                }
                            }
                        }
                    });
                }
                else if (currQuestionType === "short") {
                    let studentFRQAnswers = [];
                    snapshot.forEach((childSnapshot) => {
                        if (childSnapshot.val()) {
                            if (childSnapshot.val()['responses']) {
                                if (childSnapshot.val()['responses'][currentQuestionIndex]) {
                                    studentFRQAnswers.push(childSnapshot.val()['responses'][currentQuestionIndex]);
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
                if (nextQuestionIndex < snapshot.val().length) {
                    // displays first question in question set in the "next question" field
                    setNextQuestion(snapshot.val()[nextQuestionIndex]["qText"]);
                    if (nextQuestionIndex !== 0) {
                        setCurrentQuestionIndex(currIndex);
                        updateCurrQuestionIndexDB(currIndex);

                        const currQJSON = snapshot.val()
                        setCurrQuestion(currQJSON[currIndex].qText);

                        setCurrQuestionType(snapshot.val()[currIndex]["qType"]["value"]);
                    }
                }
                // last swap
                else if (nextQuestionIndex === snapshot.val().length) {
                    setCurrentQuestionIndex(currIndex);
                    updateCurrQuestionIndexDB(currIndex)

                    setCurrQuestion(snapshot.val()[currIndex]["qText"]);
                    setCurrQuestionType(snapshot.val()[currIndex]["qType"]["value"]);
                    setNextQuestion("");
                }
                else {
                    // no more questions left
                    console.log("No More Questions in Set");
                }

                // make curr question answer options show up
                if (nextQuestionIndex !== 0 || nextQuestionIndex === snapshot.val().length) {
                    // question is MC or TF
                    if (snapshot.val()[currIndex]['answers']) {
                        let answerList = [];
                        const questionAnswers = snapshot.val()[currIndex]['answers'];
                        questionAnswers.forEach(element => answerList.push(element['label']));
                        setCurrQuestionAnswers(answerList);
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
        const studentsRef = ref(db, 'classes/' + chosenClass + '/sessionActive');
        onValue(studentsRef, (snapshot) => {
            const data = snapshot.val();
            if (data['activeStudents'] != null) {
                const idsOfStudentsInSession = Object.keys(data['activeStudents']);
                const allUsers = get(child(ref(db), 'users/')).then((snapshot) => {
                    if (snapshot.exists()) {
                        let studentNameList = [];

                        // if not in anonymous session, show student answers in list of students in session
                        if (!anonymousState) {
                            idsOfStudentsInSession.forEach((studentKey) => {
                                // need to check if responses table exists
                                if(data['activeStudents'][studentKey]['responses'] !== undefined) {
                                    studentNameList.push([snapshot.val()[studentKey]['name'], data['activeStudents'][studentKey]['responses'][currentQuestionIndex]])
                                } else {
                                    studentNameList.push([snapshot.val()[studentKey]['name']])
                                }
                            });
                        } else {
                            // otherwise, show a checkmark indicating student has answered
                            // check that student has answered first
                            idsOfStudentsInSession.forEach(studentKey => {
                                if (data['activeStudents'][studentKey]['responses'][currentQuestionIndex] !== undefined) {
                                    studentNameList.push([snapshot.val()[studentKey]['name'], "✅"])
                                } else {
                                    // otherwise, push student names but no checkmark (because hasn't answered yet)
                                    studentNameList.push([snapshot.val()[studentKey]['name'], ""])
                                }
                            });
                        }
                        setStudentsInSession(studentNameList);
                    } else {
                        console.log("No data available");
                    }
                });
            }
        });
    }, [currentQuestionIndex, anonymousState]);

    const backNavigate = e => {
        navigate('/Class');
    };
    
    //score list
    const [studentScores, setStudentScores] = useState([])
    const [numShort, setNumShort] = useState(0)
    const [numGraded, setNumGraded] = useState(0)
    const [numQuestions, setNumQuestions] = useState(0)

    //student score functions
    const getStudentResults = async () => {
        //format student answer json and true answer json into proper format for function
        let trueAnswers = []
        let numShort = 0
        const snapshot = await get(ref(db, 'questionSets/' + chosenQuestionSet + '/qSet'));
        snapshot.forEach((question) => {
            let answer = question.val().trueAnswer.label
            if (answer === "") {
                numShort++
            }
            trueAnswers.push(answer)
        })
        
        setNumQuestions(trueAnswers.length)
        setNumShort(numShort)
        setNumGraded(trueAnswers.length - numShort)

        let answerData = []
        const snapshot2 = await get(ref(db, 'classes/' + chosenClass + '/sessionActive/'));
        if (snapshot2.child('activeStudents').exists()) {
            snapshot2.child('activeStudents').forEach((student) => {         
                answerData.push({score: calculateScore(student.val().responses, trueAnswers), name: student.val().name})
            })
        }
        setStudentScores(answerData)
        formatStudentScores(answerData)
    }


    // convert studentScores into an array that the csv download can read
    const formatStudentScores = (studentAnswerData) => {
        let csvData = [];
        studentAnswerData.forEach(student => csvData.push([student.name, student.score]));
        setCsvFormattedData(csvData);
    }


    return (
        <div>
            <div class='header'>
                <div class='corner'>
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
                        <Button class="btn btn-primary" onClick={getStudentAnswers}>See Current Student Responses</Button>
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
                </div>
                <div class="text-center">
            <Button onClick={() => { setNextQuestionIndex(nextQuestionIndex + 1); setAnswerCountMap(new Map()) }} disabled={nextQuestion === ""}>Display Next Question</Button>
            </div>
                    
           
            </div>
            <br />
            <Button variant="primary" onClick={handleStudentBarShow}>
                See Students in Session
                            </Button>
            
            <Button onClick={handleShowEndSession}>End Session</Button>

            <Modal show={showEndSession} onHide={handleCloseEndSession}>
                <Modal.Header closeButton>
                    <Modal.Title>Session Summary</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                
                <ListGroup>
                    <h1>Student Scores</h1>
                    {studentScores.map((student, index) => {
                        return (
                            <div key={index}>
                                <ListGroup.Item>{student.name} got {student.score}/{numGraded}</ListGroup.Item>
                            </div>
                        )
                    })}
                    <div>There are {numShort} ungraded short response questions</div>
                </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEndSession}>
                        Close
                </Button>
                    <Button onClick={() => { sessionFunctions.download(csvFormattedData, chosenClassDisplayName + " on " + date) }}>Download CSV</Button>
                    <Button variant="primary" onClick={handleEndSession}>
                        End Session
                </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};
export default InstructorSessionView;