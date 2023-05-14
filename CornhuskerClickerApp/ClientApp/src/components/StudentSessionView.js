import { newClass } from './realTimeData/ClassDisplay';
import { getDatabase, ref, child, get, onValue, update } from "firebase/database";
import { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { UserAuth } from '../context/AuthContext';
import { Button } from 'react-bootstrap';
import Countdown from 'react-countdown';
import { useNavigate } from 'react-router-dom';
import './CSS/StudentSessionView.css'
import Spinner from 'react-bootstrap/Spinner';

const db = getDatabase();

const StudentSessionView = () => {
    const navigate = useNavigate();

    const { user } = UserAuth();

    // get the id of the currently selected class
    const chosenClass = newClass;

    // get the display name of the currently selected class
    let chosenClassDisplayName = "";
    const displayNameRef = ref(db, 'classes/' + chosenClass + "/className/");
    onValue(displayNameRef, (snapshot) => {
        const data = snapshot.val();
        chosenClassDisplayName = data;
    });

    // get the id of the currently selected question set
    let chosenQuestionSet = "";
    const sessionQSetRef = ref(db, 'classes/' + chosenClass + "/sessionActive/")
    onValue(sessionQSetRef, (snapshot) => {
        chosenQuestionSet = snapshot.val()['activeQSet']
    })


    // current question displayed to students
    const [currQuestion, setCurrQuestion] = useState();
    const [currQuestionIndex, setCurrQuestionIndex] = useState(0);
    const [nextQuestionIndex, setNextQuestionIndex] = useState(0);

    // keep track of question answers
    const [currQuestionAnswers, setCurrQuestionAnswers] = useState([]);

    // keep track of answer selected
    const [answerSelected, setAnswerSelected] = useState();


    const [submitAnswerDisabled, setSubmitAnswerDisabled] = useState(false);

    const [restartTimer, setRestartTimer] = useState(Date.now());

    const [timerState, setTimerState] = useState();

    const [isFRQ, setIsFRQ] = useState();

    // user free response q answer
    const [inputText, setInputText] = useState("");

    // get next question index
    useEffect(() => {
        const nextQuestionIndexRef = ref(db, 'classes/' + chosenClass + '/sessionActive/nextQuestion');
        onValue(nextQuestionIndexRef, (snapshot) => {
            const data = snapshot.val();
            if (data != null) {
                setNextQuestionIndex(data);

            }
        });
    }, [nextQuestionIndex]);

    // update displayed question prompt to match currQuestion index in DB
    useEffect(() => {
        get(child(ref(db), 'questionSets/' + chosenQuestionSet + '/qSet')).then((snapshot2) => {
            if (snapshot2.exists()) {
                return snapshot2.val();
            } else {
                console.log("No data available");
            }
        }).then((questionSetAll) => {
            const questionRef = ref(db, 'classes/' + chosenClass + '/sessionActive/currentQuestion');
            onValue(questionRef, (snapshot) => {
                setSubmitAnswerDisabled(false);
                setRestartTimer(Date.now());
                const currentQuestion = snapshot.val();
                setCurrQuestionIndex(currentQuestion);
                setAnswerSelected();
                setCurrQuestion(questionSetAll[currentQuestion]['qText']);

                if (questionSetAll[currentQuestion]['qType']['value'] === "short") {
                    setIsFRQ(true);
                }
                else {
                    setIsFRQ(false);

                    // updating the current questions' answer choices on the list group
                    let answerList = [];
                    const questionAnswers = questionSetAll[currentQuestion]['answers'];
                    questionAnswers.forEach(element => answerList.push(element['label']));
                    setCurrQuestionAnswers(answerList);
                }
            });
        }).then(() => {
            const timerRef = ref(db, 'classes/' + chosenClass + '/sessionActive/');
            onValue(timerRef, (snapshot) => {
                setTimerState(snapshot.val()['timerToggled']);
            });
        });
    }, []);

    // add user's answer to firebase
    const registerUserAnswer = (answer) => {
        setSubmitAnswerDisabled(true);
        const updates = {};
        updates['classes/' + chosenClass + '/sessionActive/activeStudents/' + user.uid + '/responses/' + currQuestionIndex] = answer;
        update(ref(db), updates);

    };

    const handleClassInputChange = (e) => {
        // store the input value to local state
        setInputText(e.target.value);
    };

    const backNavigate = e => {
        navigate('/account');
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
            </div>

            <div className='drop'>
                <Button>
                    <div className='userInfo'>
                        <img src={user && user.photoURL} class="userImg" alt="default profile image" />

                        {user && user.displayName}
                    </div>
                </Button>
            </div>
          
            <div className="titles">
            <h2>Class: {chosenClassDisplayName}</h2>
            <h1>Student Session</h1>
            </div>
            
            <br />
            <div className='box'>
                
            <div className='sQuestions'>
            <p><b>Current question:</b></p>
                    <div>
                        {
                            (nextQuestionIndex > 0) ?
                                (
                                    isFRQ ?
                                        <div>
                                            <p>{currQuestion}</p>
                                            <input type="text" onChange={handleClassInputChange} value={inputText} />
                                            <Button disabled={submitAnswerDisabled} onClick={() => { registerUserAnswer(inputText) }}>Submit Answer</Button>
                                        </div>

                                        :
                                        <div>
                                            <p>{currQuestion}</p>

                                            <ListGroup>
                                                {currQuestionAnswers.map((element, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <ListGroup.Item action active={String(element) == answerSelected} onClick={() => { setAnswerSelected(element) }}>{String(element)}</ListGroup.Item>
                                                        </div>
                                                    );


                                                })}

                                            </ListGroup>
                                            <Button disabled={submitAnswerDisabled} onClick={() => { registerUserAnswer(answerSelected) }}>Submit Answer</Button>
                                        </div>
                                )
                                :
                                <div className='waiting'>
                                    <p> Waiting for your instructor to ask a question...</p>
                                    <Spinner animation="border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>

                                </div>
                        }
                    </div>
            </div>
            </div>
            {
                timerState ?
                    <Countdown
                        key={restartTimer}
                        date={restartTimer + 10000}
                        onComplete={() => { setSubmitAnswerDisabled(true) }}
                    />
                    : null
            }
        </div>
    );
};

export default StudentSessionView;