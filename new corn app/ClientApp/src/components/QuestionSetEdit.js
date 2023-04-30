import React from 'react';
import { RealTimeData } from "./realTimeData/index";
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { database } from '../firebase';
import { getDatabase, ref, set, child, get, push, update, query, onValue } from "firebase/database";
import { ChangeEvent, useState } from "react";
import Select from 'react-select';
import { Modal, Button } from 'react-bootstrap';

const QuestionSetEdit = () => {
    const { user, logout } = UserAuth();
    const navigate = useNavigate();

    //TODO: question set selector

    //question type variable
    const [questionType, setQuestionType] = useState(null)

    //qType event handler
    const handleTypeChange = (e) => {
        setQuestionType(e.value)
        //test if changed
        if (e.value != questionType) {
            //show and hide structures based on new Qtype
            //clear correct answer
            //update correct answer options
            //clear multi-choices
            switch (e.value) {
                case "multi":
                    console.log("multi-switch")
                    break;
                case "TF":
                    console.log("tf-switch")
                    break;
                case "short":
                    console.log("short-switch")
                    break;
            }
        }
    }

    const addQuestion = () => {

    }

    //question text variable
    const [questionText, setQuestionText] = useState("")

    //handle question text update
    const handleQTextChange = (e) => {
        setQuestionText(e.target.value)
    }

    //qType options
    const questionTypeOptions = [
        { value: "multi", label: "Multiple Choice" },
        { value: "short", label: "Short Answer" },
        { value: "TF", label: "True/False" }
    ]

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
        { answerChoice: '' },
        { answerChoice: '' }
    ])

    //handle options change
    const handleOptionChange = (index, event) => {
        let data = [...choices]
        data[index][event.target.name] = event.target.value
        setChoices(data)
    }

    //add additional multi-choice fields
    const addFields = () => {
        let newChoice = { answerChoice: '' }
        setChoices([...choices, newChoice])
    }

    //remove multi-choice fields
    const removeFields = (index) => {
        let data = [...choices]
        if (data.length > 2) {
            data.splice(index, 1)
            setChoices(data)
        }
        else {
            //TODO: Show Error message, have to have at least 2 options
        }
    }

    //TRUE FALSE

    //hard-coded T/F options
    const tfAnswerOptions = () => [
        { value: true, label: "True" },
        { value: false, label: "False" }
    ]


    //debug functions


    //show choices variable
    const [showChoices, setShowChoices] = useState(true)

    //console log statement
    const getVars = (e) => {
        e.preventDefault()
        console.log(questionType)
    }

    //toggle show choices
    const toggleShowChoice = (e) => {
        e.preventDefault()
        setShowChoices(!showChoices)
        console.log(!showChoices)
    }

    // put the question adding fields in a popup (modal)
    const [showAddQuestionField, setShowAddQuestionField] = useState(false);
    // handle the popup open and close
    const handleClose = () => setShowAddQuestionField(false);
    const handleShow = () => setShowAddQuestionField(true);

    //TODO: css: make <form> background transparent
    //TODO: html: make buttons look better
    return (
        <div className="App">
            <Button variant="primary" onClick={handleShow}>
                Add Question/ launch pop up
            </Button>

            <Modal show={showAddQuestionField} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a Question!</Modal.Title>
                </Modal.Header>
                <Modal.Body>


                    <Select
                        name="Question Type"
                        options={questionTypeOptions}
                        onChange={handleTypeChange}
                        cols={40}
                    />

                    <br />
                    <button onClick={getVars}>log vars</button>

            <br />
            <textarea
                name="questionText"
                onChange={handleQTextChange}
                cols={40}
            />

            {questionType === "multi" && <div>hello</div>}

            <br />
            <div>
                {choices.map((input, index) => {
                    return (
                        <div key={index}>
                            <input
                                name='answerChoice'
                                placeholder='Answer Text'
                                value={input.answerChoice}
                                onChange={event => handleOptionChange(index, event)}
                            />
                            <button onClick={() => removeFields(index)} >Remove</button>
                        </div>
                    )
                })}

                <br />
                <Select
                    name="correctAnswer"
                    options={answerOptions}
                    onChange={handleCorrectAnswerChange}
                />

                        <br />
                        <button onClick={addFields}>add field</button>

                    </div>



                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button variant="primary" onClick={handleClose}>Save Question</Button>
                </Modal.Footer>
            </Modal>

        </div>
  
    );
}

export default QuestionSetEdit;