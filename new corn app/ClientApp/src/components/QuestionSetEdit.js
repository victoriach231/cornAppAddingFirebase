import React from 'react';
import { RealTimeData } from "./realTimeData/index";
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { database } from '../firebase';
import { getDatabase, ref, set, child, get, push, update, query, onValue } from "firebase/database";
import { ChangeEvent, useState } from "react";
import Select from 'react-select';
import { Modal, Button, ListGroup } from 'react-bootstrap';

const QuestionSetEdit = () => {
    const { user, logout } = UserAuth();
    const navigate = useNavigate();

    //TODO: discuss db structure

    const currClass = "-NTAht6jKvRKebh2RZyl" //change to be dynamic based on the last page
    const currQSetKey = "" //if new create key, if existing, should be existing key

    const isNewQuestion = true

    //default multiple choice options
    const defaultChoices = [
        { value: '', label: '' },
        { value: '', label: '' }
    ]

    const [questionIndex, setQuestionIndex] = useState(-1) //should change depending on the question selected

    const [questionSet, setQuestionSet] = useState([])
    const [qSetName, setQSetName] = useState("") //default should be whatever is passed on navigate


    //FIREBASE FUNCTIONALITY

    const addQuestion = () => {
        get(child(ref(getDatabase()), 'classes/')).then((snapshot) => {

        }).catch((error) => {
            console.error(error);
        })
    }

    const saveQuestion = () => {

    }

    //POP-UP FUNCTIONS
    
    // put the question adding fields in a popup (modal)
    const [showAddQuestionField, setShowAddQuestionField] = useState(false);
    // handle the popup open and close
    const handleClose = () => { 
        //clear all fields
        setQuestionType({value:"", label:""})
        setChoices(defaultChoices)
        setAnswerOptions([])
        setCorrectAnswer({value:"", label:""})
        setQuestionText("")
        setQuestionIndex(-1)
        //close popup
        setShowAddQuestionField(false)
    };
    const handleShow = () => setShowAddQuestionField(true);

    const openQuestionAtIndex = (index, e) => {
        //set curr index
        console.log(index)
        setQuestionIndex(index)
        //get json
        let question = questionSet[index]
        //set variables
        setQuestionType(question.qType)
        setQuestionText(question.qText)
        setChoices(question.answers)
        setAnswerOptions(question.answers)
        setCorrectAnswer(question.trueAnswer)
        
        handleShow()
    }

    //handle save question

    const handleSaveQuesiton = () => {
        if(ensureFilled()) {
            let questionJSON = {
                qText: questionText, 
                qType: questionType,
                answers: answerOptions,
                trueAnswer: correctAnswer  
            }
            console.log(questionJSON)
            console.log(questionIndex)
            
            //TODO: add edit question functionality
            if (questionIndex === -1) {
                setQuestionSet([...questionSet, questionJSON])
            }
            else {
                let newSet = [
                    ...questionSet.slice(0, questionIndex),
                    questionJSON,
                    ...questionSet.slice(questionIndex + 1)
                ]

                console.log("old")
                console.log(questionSet)
                console.log("new")
                console.log(newSet)
                setQuestionSet(newSet)
            }
            handleClose()
        }
    }

    //quick check for filled
    const ensureFilled = () => {
        if ((questionText !== "") && (questionType != null)) { //this needs to be changed to allow the user to understand whats wrong
            let allgood = true
            switch (questionType.value) {
                case "multi":
                    allgood = checkAnswerChoices()
                case "TF":
                    allgood = correctAnswer !== null
                case "short":
                    return allgood
                default:
                    console.log("how")
                    return false
            }
        }
        else {
            console.log("qtype or qtext empty")
            return false
        }
    }

    //ensure each option is filled
    const checkAnswerChoices = () => {
        let filled = true
        answerOptions.forEach((e) => filled = (!filled || e.value !== ""))
        return filled
    }

    //delete question function
    const deleteQuestion = (index) => {
        let data = [...questionSet]
        data.splice(index, 1)
        setQuestionSet(data)
    }

    //QUESTION EDIT FUNCTIONS

    //question type variable
    const [questionType, setQuestionType] = useState({ value: '', label: ''})

    //qType event handler
    const handleTypeChange = (e) => {
        setQuestionType(e)
        //test if changed
        if (e.value !== questionType.value) {
            //show and hide structures based on new Qtype --- done with jsx
            //clear correct answer
            setCorrectAnswer({value:'', label:''})
            //update correct answer options --- done in switch statement
            //clear multi-choices
            setChoices(defaultChoices)
            switch (e.value) {
                case "multi":
                    console.log("multi-switch")
                    setAnswerOptions(choices)
                    break;
                case "TF":
                    console.log("tf-switch")
                    setAnswerOptions(tfAnswerOptions)
                    break;
                case "short":
                    console.log("short-switch")
                    setAnswerOptions([])
                    break;
            }
        }
    }

    let qte = "default"

    //question text variable
    const [questionText, setQuestionText] = useState("")

    //handle question text update
    const handleQTextChange = (e) => setQuestionText(e.target.value)

    //qType options
    const questionTypeOptions = [
        { value: "multi", label: "Multiple Choice" },
        { value: "short", label: "Short Answer" },
        { value: "TF", label: "True/False" }
    ]

    //correct answer selection (dependent on active qType)
    const [correctAnswer, setCorrectAnswer] = useState({ value: '', label: ''})

    //correct answer options
    const [answerOptions, setAnswerOptions] = useState([])

    //MULTIPLE CHOICE

    //multiple choice variable
    const [choices, setChoices] = useState(defaultChoices)


    //handle options change
    const handleOptionChange = (index, event) => {
        let data = [...choices]
        data[index]['value'] = event.target.value
        data[index]['label'] = event.target.value
        setChoices(data)
        setAnswerOptions(choices)
    }

    //add additional multi-choice fields
    const addFields = () => {
        let newChoice = { value: '', label:'' }
        setChoices([...choices, newChoice])
        setAnswerOptions(choices)
    }

    //remove multi-choice fields
    const removeFields = (index) => {
        let data = [...choices]
        if (data.length > 2) {
            data.splice(index, 1)
            setChoices(data)
            setAnswerOptions(choices)
        }
        else {
            //TODO: Show Error message, have to have at least 2 options
            console.log("have to have at least 2 questions")
        }
    }

    //TRUE FALSE
    //hard-coded T/F options
    const tfAnswerOptions = [
        { value: true, label: "True" },
        { value: false, label: "False" }
    ]

    const logQSet = () => {
        console.log(questionSet)
        console.log(questionIndex)
    }
    
    const logVars = () => {
        console.log(questionType)
        console.log(correctAnswer)
        console.log("index")
        console.log(questionIndex)
    }


    //TODO: css: make <form> background transparent
    //TODO: html: make buttons look better
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
                {/* {questionSet.length === 0 ? <div><ListGroup.Item></ListGroup.Item></div> : questionSet.map((set, index) => {
                            return (
                                <div key={index}>
                                    <ListGroup.Item onClick={(e) => openQuestionAtIndex(index, e)}>{set.qText}</ListGroup.Item>
                                </div>
                            )
                        })} // this is for creating an empty default listing*/}
            </ListGroup>
            
            <Button variant="primary" onClick={handleShow}>
                Add Question/ launch pop up
            </Button>

            <br/>
            <button onClick={logQSet}>Log Correct Answer</button>

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
                    <button onClick={logVars}>logVars</button>

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