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

    const currClassDir = "classes/-NTAht6jKvRKebh2RZyl" //change to be dynamic based on the last page
    const currQSetKey = "" //if new create key, if existing, should be existing key

    const [questionSet, setQuestionSet] = useState([])
    let qSetName = ""
    

    //POP-UP FUNCTIONS
    
    // put the question adding fields in a popup (modal)
    const [showAddQuestionField, setShowAddQuestionField] = useState(false);
    // handle the popup open and close
    const handleClose = () => { 
        //clear all fields
        setQuestionType(null)
        setChoices(defaultChoices)
        setAnswerOptions([])
        setCorrectAnswer(null)
        setQuestionText("")
        setQuestionIndex(-1)
        //close popup
        setShowAddQuestionField(false)
    };
    const handleShow = () => setShowAddQuestionField(true);

    const openQuestionAtIndex = (index, e) => {
        //set curr index
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
                trueAnswer: correctAnswer //may have to switch to index (prob not) 
            }
            console.log(questionJSON)
            
            //TODO: add edit question functionality
            if (questionIndex === -1) {
                setQuestionSet([...questionSet, questionJSON])
            }
            else {
                setQuestionSet([
                    ...questionSet.slice(0, questionIndex),
                    questionJSON,
                    ...questionSet.slice(questionIndex)
                ])
            }
            handleClose()
        }
    }

    //quick check for filled
    const ensureFilled = () => {
        if ((questionText !== "") && (questionType != null)) {
            let allgood = true
            switch (questionType) {
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

    //QUESTION EDIT FUNCTIONS

    const [questionIndex, setQuestionIndex] = useState(-1) //should change depending on the question selected

    //question type variable
    const [questionType, setQuestionType] = useState(null)

    //qType event handler
    const handleTypeChange = (e) => {
        setQuestionType(e.value)
        //test if changed
        if (e.value !== questionType) {
            //show and hide structures based on new Qtype --- done with jsx
            //clear correct answer
            setCorrectAnswer(null)
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

    //return select option based on value
    const getSelObject = (v, isQType) => {
        if(isQType) {
            switch(v){
                case "multi":
                    return { value: "multi", label: "Multiple Choice" }
                case "short":
                    return { value: "short", label: "Short Answer" }
                case "TF": 
                    return { value: "TF", label: "True/False" }
                default:
                    return { value: '', label: ''}
            }
        }
        else { //if not qType section, is answer section
            if(questionType === "TF") {
                if(v){
                    return { value: true, label: "True" }
                }
                else{
                    return { value: false, label: "False" }
                }
            }
            else{
                return {value: v, label: v}
            }
        }
    }

    //correct answer selection (dependent on active qType)
    const [correctAnswer, setCorrectAnswer] = useState(null)

    //handle correctAnswerChange
    const handleCorrectAnswerChange = (e) => {
        setCorrectAnswer(e.value)
    }

    //correct answer options
    const [answerOptions, setAnswerOptions] = useState([])

    //MULTIPLE CHOICE

    //multiple choice variable
    const [choices, setChoices] = useState([
        { value: '', label: '' },
        { value: '', label: '' }
    ])

    const defaultChoices = [
        { value: '', label: '' },
        { value: '', label: '' }
    ]

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
    }
    
    const logVars = () => {
        console.log(questionType)
    }


    //TODO: css: make <form> background transparent
    //TODO: html: make buttons look better
    return (
        <div className="App">

            <ListGroup>
                {questionSet.map((set, index) => {
                            return (
                                <div key={index}>
                                    <ListGroup.Item onClick={(e) => openQuestionAtIndex(index, e)}>{set.qText}</ListGroup.Item>
                                </div>
                            )
                        })}
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
                        defaultValue={getSelObject(questionType, true)}
                        onChange={handleTypeChange}
                    />

                    <br />
                    <textarea
                        name="questionText"
                        placeholder="Question Text"
                        defaultValue={questionText}
                        onChange={handleQTextChange}
                        cols={40}
                    />

                    {questionType === "multi" &&
                    <div>
                        {choices.map((input, index) => {
                            return (
                                <div key={index}>
                                    <input
                                        name='answerChoice'
                                        placeholder='Answer Text'
                                        value={input.value}
                                        defaultValue={(answerOptions[index] ? answerOptions[index].value : '')}
                                        onChange={event => handleOptionChange(index, event)}
                                    />
                                    <button onClick={() => removeFields(index)} >Remove</button>
                                </div>
                            )
                        })}
                        <br/>
                        <button onClick={addFields}>add field</button>
                    </div>}
                    {(questionType === "multi" || questionType === "TF") &&
                    <div>
                        <br />
                        <Select
                            name="correctAnswer"
                            options={answerOptions}
                            defaultValue={getSelObject(correctAnswer, false)}
                            onChange={handleCorrectAnswerChange}
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