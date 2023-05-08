﻿import { newClass } from './realTimeData/index';
import { getDatabase, ref, child, get, onValue, update, set } from "firebase/database";
import { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { UserAuth } from '../context/AuthContext';
import { Button } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import Countdown from 'react-countdown';

const db = getDatabase();

const StudentSessionView = () => {
    const { user } = UserAuth();

    // get the id of the currently selected class
    const chosenClass = newClass;

    // get the id of the currently selected question set
    const chosenQuestionSet = "1234";

    // current question displayed to students
    const [currQuestion, setCurrQuestion] = useState();
    const [currQuestionIndex, setCurrQuestionIndex] = useState();

    // keep track of question answers
    const [currQuestionAnswers, setCurrQuestionAnswers] = useState([]);

    // keep track of answer selected
    const [answerSelected, setAnswerSelected] = useState();


    const [submitAnswerDisabled, setSubmitAnswerDisabled] = useState(false);

    const [restartTimer, setRestartTimer] = useState(Date.now());

    //let timerState = false;
    const [timerState, setTimerState] = useState();

    const [isFRQ, setIsFRQ] = useState();

    // user free response q answer
    const [inputText, setInputText] = useState("");


    //function timerTest({ timerStat }) {
    //    if (timerState) {
    //        console.log(" add timer");
    //        return <Countdown
    //            key={restartTimer}
    //            date={restartTimer + 10000}
    //            onComplete={() => { setSubmitAnswerDisabled(true); }}
    //        />;
    //    }
    //    else {
    //        console.log("dont add timer");

    //        return null;
    //    }
    //};

    // update displayed question prompt to match currQuestion index in DB
    useEffect(() => {
        const questionSetAll = get(child(ref(db), 'questionSets/' + chosenQuestionSet)).then((snapshot2) => {
            if (snapshot2.exists()) {
                console.log(snapshot2.val());
                return snapshot2.val();
                let studentNameList = [];


            } else {
                console.log("No data available");
            }
        }).then((questionSetAll) => {
            console.log(questionSetAll);
            console.log("in here");
            console.log(chosenClass);
            const questionRef = ref(db, 'classes/' + chosenClass + '/sessionActive/currentQuestion');
            onValue(questionRef, (snapshot) => {
                setSubmitAnswerDisabled(false);
                setRestartTimer(Date.now());
                const currentQuestion = snapshot.val();
                setCurrQuestionIndex(currentQuestion);
                setCurrQuestion(questionSetAll[currentQuestion]['qText']);

                if (questionSetAll[currentQuestion]['qType'] === "short") {
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
                console.log('LALALALALALALALA');
                console.log(snapshot.val()['timerToggled']);
                //timerState = snapshot.val()['timerToggled'];
                setTimerState(snapshot.val()['timerToggled']);
            });
        });
    }, []);

    // add user's answer to firebase
    const registerUserAnswer = (answer) => {
        setSubmitAnswerDisabled(true);
        console.log('registerUserAnswer');
        console.log(answer);
        console.log(chosenClass);
        console.log(user.uid);
        console.log(currQuestionIndex);
        //set(ref(db, 'classes/' + chosenClass + '/sessionActive/activeStudents/' + user.uid + '/responses'), {
        //    [currQuestionIndex]: answer
        //});

        const newResponse = {
            [currQuestionIndex]: answer,
        };
        const updates = {};
        updates['classes/' + chosenClass + '/sessionActive/activeStudents/' + user.uid + '/responses/' + currQuestionIndex] = newResponse;
        // updates['classes/' + chosenClass + '/sessionActive/activeStudents/ + user.uid + /responses/' + user.uid + '/' + currQuestionIndex]
        update(ref(db), updates);

    };

    const handleClassInputChange = (e) => {
        // 👇 Store the input value to local state
        setInputText(e.target.value);
    };

    return (
        <div>

            {
                timerState ? 
                <Countdown
                        key={restartTimer}
                        date={restartTimer + 10000}
                        onComplete={() => { setSubmitAnswerDisabled(true) }}
                />
                : null
            }
            
            <br />
            <p>student session view</p>
            <p>{currQuestion}</p>
            <br />

            {
                isFRQ ?
                    <div>
                    <input type="text" onChange={handleClassInputChange} value={inputText} />
                        <Button disabled={submitAnswerDisabled} onClick={() => { registerUserAnswer(inputText) }}>Submit Answer</Button>
                    </div>

                    :
                    <div>
                    <ListGroup>
                        {currQuestionAnswers.map((element, index) => {
                            return (
                                <div key={index}>
                                    <ListGroup.Item action onClick={() => { setAnswerSelected(element) }}>{element}</ListGroup.Item>
                                </div>
                            );
                        })}

                    </ListGroup>
                     <Button disabled={submitAnswerDisabled} onClick={() => { registerUserAnswer(answerSelected) }}>Submit Answer</Button>
                     </div>
            }

            



        </div>
        
    );
};

export default StudentSessionView;

//{
//    timerState &&
//        <Countdown
//            key={restartTimer}
//            date={restartTimer + 10000}
//            onComplete={() => { setSubmitAnswerDisabled(true); }}
//        />

//}