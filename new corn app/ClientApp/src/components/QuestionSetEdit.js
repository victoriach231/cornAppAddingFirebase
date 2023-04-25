import React from 'react';
import { RealTimeData } from "./realTimeData/index";
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { database } from '../firebase';
import { getDatabase, ref, set, child, get, push, update, query, onValue } from "firebase/database";
import { ChangeEvent, useState } from "react";
import Select from 'react-select';

const QuestionSetEdit = () => {
    const { user, logout } = UserAuth();
    const navigate = useNavigate();

    //TODO: question set selector

    //question text variable
    const [questionInput, setQuestionInput] = useState("");

    //question type variable
    const [questionType, setQuestionType] = useState(null)

    //qType event handler
    const handleTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuestionType(e.value)
    }

    //variable for qType to handle async nature
  //  const currentItem = useSelector(state => state.currentItem)

    //qType options
    const questionTypeOptions = [
        { value: "multiChoice", label: "Multiple Choice" },
        { value: "short", label: "Short Answer" },
        { value: "TF", label: "True/False" }
    ]

    //multiple choice variable

    //console log statement
    const getVars = () => {
        console.log(questionType)
    }

    return (
        <div>
            <Select
                isClearable="true"
                name="Question Type"
                options={questionTypeOptions}
                onChange={handleTypeChange}
            />
            <br />
            <button onClick={getVars }>log vars</button>
        </div>
    );
}

export default QuestionSetEdit;