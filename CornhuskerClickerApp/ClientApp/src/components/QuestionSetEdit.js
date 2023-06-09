﻿import { selectedQSetKey, isNewSet } from './realTimeData/QuestionSetDisplay';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, set, child, get, push, update } from "firebase/database";
import { React, useState, useEffect } from "react";
import Select from 'react-select';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import { newClass } from './realTimeData/ClassDisplay';

const QuestionSetEdit = () => {
    const navigate = useNavigate();

    const currClass = newClass;
    const currQSetKey = selectedQSetKey; // existing key

    const isNewQSet = isNewSet;

    // default multiple choice options
    const defaultChoices = [
        { value: '', label: '' },
        { value: '', label: '' }
    ];

    const [questionIndex, setQuestionIndex] = useState(-1); // should change depending on the question selected

    const [questionSet, setQuestionSet] = useState([]);
    const [qSetName, setQSetName] = useState(""); // default should be whatever is passed on navigate


    // FIREBASE FUNCTIONALITY

    // generic save function
    const saveQuestion = (key) => {
        // set rewrites the entire key, update adds to the key (and/or rewrites children)
        // we will use set since we are basically rewriting question sets in order to edit them
        set(ref(getDatabase(), 'questionSets/' + key), { name: qSetName, qSet: questionSet });
    };

    // for new sets
    const addNewQuestionSet = () => {
        const newKey = push(child(ref(getDatabase()), 'questionSets')).key;

        //create new qset in database
        saveQuestion(newKey);

        //add new qSet to class
        update(ref(getDatabase(), 'classes/' + currClass + '/questionSets/' + newKey), { name: qSetName });

        navigate('/class');
    };

    //make sure no empty fields
    const validateQSet = () => {
        return qSetName !== "" && questionSet.length != 0;
    };

    //for existing sets
    const saveExistingQuestionSet = () => {
        //save qSet
        saveQuestion(currQSetKey);

        //change name
        update(ref(getDatabase(), 'classes/' + currClass + '/questionSets/' + currQSetKey), { name: qSetName });

        navigate('/class');
    };

    //save question handler
    const saveQuestionSetHandler = () => {
        if (validateQSet()) {
            if (isNewQSet) {
                addNewQuestionSet();
            } else {
                saveExistingQuestionSet();
            }
        } else {
            console.log("qset or name is empty");
        }
    };

    // cancel question edit
    const cancel = () => {
        navigate('/class');
    };

    //POP-UP FUNCTIONS
    
    // put the question adding fields in a popup (modal)
    const [showAddQuestionField, setShowAddQuestionField] = useState(false);
    // handle the popup open and close
    const handleClose = () => { 
        //clear all fields
        setQuestionType({ value: "", label: "" });
        setChoices(defaultChoices);
        setAnswerOptions([]);
        setCorrectAnswer({ value: "", label: "" });
        setQuestionText("");
        setQuestionIndex(-1);
        // close popup
        setShowAddQuestionField(false);
    };
    const handleShow = () => setShowAddQuestionField(true);

    const openQuestionAtIndex = (index, e) => {
        // set curr index
        setQuestionIndex(index);
        // get json
        let question = questionSet[index];
        // set variables
        setQuestionType(question.qType);
        setQuestionText(question.qText);
        setChoices(question.answers);
        setAnswerOptions(question.answers);
        setCorrectAnswer(question.trueAnswer);

        handleShow();
    };

    // handle save question
    const handleSaveQuesiton = () => {
        if (ensureFilled()) {
            let questionJSON = {
                qText: questionText,
                qType: questionType,
                answers: answerOptions,
                trueAnswer: correctAnswer
            };

            if (questionIndex === -1) {
                setQuestionSet([...questionSet, questionJSON]);
            }
            else {
                let newSet = [
                    ...questionSet.slice(0, questionIndex),
                    questionJSON,
                    ...questionSet.slice(questionIndex + 1)
                ];
                setQuestionSet(newSet);
            }
            handleClose();
        }
    };

    // quick check for filled
    const ensureFilled = () => {
        if ((questionText !== "") && (questionType != null)) {
            let allgood = true;
            switch (questionType.value) {
                case "multi":
                    allgood = checkAnswerChoices();
                case "TF":
                    allgood = correctAnswer !== null;
                case "short":
                    return allgood;
                default:
                    return false;
            }
        }
        else {
            console.log("qtype or qtext empty");
            return false;
        }
    };

    // ensure each option is filled
    const checkAnswerChoices = () => {
        let filled = true;
        answerOptions.forEach((e) => filled = (!filled || e.value !== ""));
        return filled;
    };
     
    // delete question function
    const deleteQuestion = (index) => {
        let data = [...questionSet];
        data.splice(index, 1);
        setQuestionSet(data);
    };

    // QUESTION EDIT FUNCTIONS

    // question type variable
    const [questionType, setQuestionType] = useState({ value: '', label: '' });

    // qType event handler
    const handleTypeChange = (e) => {
        setQuestionType(e);
        // test if changed
        if (e.value !== questionType.value) {
            // show and hide structures based on new Qtype --- done with jsx
            // clear correct answer
            setCorrectAnswer({ value: '', label: '' });
            // update correct answer options --- done in switch statement
            // clear multi-choices
            setChoices(defaultChoices);
            switch (e.value) {
                case "multi":
                    setAnswerOptions(choices);
                    break;
                case "TF":
                    setAnswerOptions(tfAnswerOptions);
                    break;
                case "short":
                    setAnswerOptions([]);
                    break;
            }
        }
    };

    let qte = "default";

    // question text variable
    const [questionText, setQuestionText] = useState("");

    // handle question text update
    const handleQTextChange = (e) => setQuestionText(e.target.value);

    // qType options
    const questionTypeOptions = [
        { value: "multi", label: "Multiple Choice" },
        { value: "short", label: "Short Answer" },
        { value: "TF", label: "True/False" }
    ];

    // correct answer selection (dependent on active qType)
    const [correctAnswer, setCorrectAnswer] = useState({ value: '', label: '' });

    // correct answer options
    const [answerOptions, setAnswerOptions] = useState([]);

    // MULTIPLE CHOICE

    // multiple choice variable
    const [choices, setChoices] = useState(defaultChoices);


    // handle options change
    const handleOptionChange = (index, event) => {
        let data = [...choices];
        data[index]['value'] = event.target.value;
        data[index]['label'] = event.target.value;
        setChoices(data);
        setAnswerOptions(choices);
    };

    // add additional multi-choice fields
    const addFields = () => {
        let newChoice = { value: '', label: '' };
        setChoices([...choices, newChoice]);
        setAnswerOptions(choices);
    };

    // remove multi-choice fields
    const removeFields = (index) => {
        let data = [...choices];
        if (data.length > 2) {
            data.splice(index, 1);
            setChoices(data);
            setAnswerOptions(choices);
        }
        else {
            console.log("have to have at least 2 questions");
        }
    };

    // TRUE FALSE
    // hard-coded T/F options
    const tfAnswerOptions = [
        { value: true, label: "True" },
        { value: false, label: "False" }
    ];


    // populate fields on load
    
    // get questionSet 
    useEffect(() => {
        if (!isNewQSet) {
            let newSet = [];
            get(child(ref(getDatabase()), 'questionSets/' + currQSetKey)).then((snapshot) => {
                if (snapshot.exists() && snapshot.hasChildren()) {
                    let name = snapshot.child("name").val();
                    setQSetName(name);
                    snapshot.child("qSet").forEach(questionSnap => {
                        let question = questionSnap.val();
                        if (snapshot.child("answers").exists()) {
                            let answerArr = [];
                            questionSnap.child("answers").forEach((answer) => {
                                answerArr.push(answer.val());
                            })
                            question.answers = answerArr;
                        }
                        newSet.push(question);
                    })
                }
            })
            setQuestionSet(newSet);
        }
    }, []);

    
    return (
        <div className="App">

            <input
                name="setName"
                placeholder="Question Set Name"
                value={qSetName}
                onChange={(e) => setQSetName(e.target.value)}
                cols={40}
            />

            <ListGroup>
                {questionSet.map((set, index) => {
                    return (
                        <div key={index}>
                            <ListGroup.Item onClick={(e) => openQuestionAtIndex(index, e)}>{set.qText}</ListGroup.Item>
                            <button onClick={() => deleteQuestion(index)} >Remove</button>
                        </div>
                    )
                })}
            </ListGroup>
            
            <Button variant="primary" onClick={handleShow}>Add Question</Button>

           
            <div>
                <Button onClick={cancel} variant='secondary'>Cancel</Button>
                <Button onClick={saveQuestionSetHandler} variant='primary'>Save & Exit</Button>
            </div>
            


            <Modal show={showAddQuestionField} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a Question!</Modal.Title>
                </Modal.Header>
                <Modal.Body>


                    <Select
                        name="Question Type"
                        options={questionTypeOptions}
                        value={questionType}
                        onChange={handleTypeChange}
                    />

                    <br />
                    <textarea
                        name="questionText"
                        placeholder="Question Text"
                        value={questionText}
                        onChange={handleQTextChange}
                        cols={40}
                    />

                    {questionType.value === "multi" &&
                    <div>
                        {choices.map((input, index) => {
                            return (
                                <div key={index}>
                                    <input
                                        name='answerChoice'
                                        placeholder='Answer Text'
                                        value={input.value}
                                        onChange={event => handleOptionChange(index, event)}
                                    />
                                    <button onClick={() => removeFields(index)} >Remove</button>
                                </div>
                            )
                        })}
                        <br/>
                        <button onClick={addFields}>add field</button>
                    </div>}
                    {(questionType.value === "multi" || questionType.value === "TF") &&
                    <div>
                        <br />
                        <Select
                            name="correctAnswer"
                            options={answerOptions}
                            value={correctAnswer}
                            onChange={(e) => setCorrectAnswer(e)}
                        />
                    </div>}

                    <br/>
                    

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button variant="primary" onClick={handleSaveQuesiton}>Save Question</Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}

export default QuestionSetEdit;