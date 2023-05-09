import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref as sRef, onValue, getDatabase, get, child, ref, update } from 'firebase/database';
import { UserAuth } from '../../context/AuthContext';
import { newClass } from './index';
import { Table } from 'react-bootstrap';

const db = getDatabase()
const currClass = newClass

// store the currently selected qSet and export it to other files
let currQSetKey = "";
let isNewSet = false;

const QSetRealTimeData = () => {
    const [tableData, setTableData] = useState([]);
    // store the qSet selected within the table, local
    const [chosenQSet, setChosenQset] = useState('');

    const navigate = useNavigate();

    //set the current key when selected qSetChanges
    useEffect(() => {currQSetKey = chosenQSet}, [chosenQSet])

    //populate table 
    useEffect(() => {
        // get all classes in firebase
        const dbRef2 = sRef(db, 'classes/questionSets');
        onValue(dbRef2, (snapshot) => {
            let records = [];
            console.log("before")

            snapshot.forEach(child => {
                console.log(child.val())
                let qSetKey = child.key
                let qSetName = child.child("name").val()

                records.push({key: qSetKey, name: qSetName})
                

            })
            console.log("after")
            setTableData(records)
        })
    }, [])

    // navigate to the qSetEditor, theoretically the chosen set has been saved already
    const goToQSetEditor = () => {
        navigate('/edit-questions')
    }
    
    //navigate to qSetEditor, with 
    const createNewQSet = () => {
        isNewSet = true;
        goToQSetEditor()
    }

    return(
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Question Set Name</th>
                    </tr>
                </thead>

                <tbody>
                    {tableData.map((rowdata, index) => {
                        return (
                            <tr key={index}>
                                <td onClick={() => { setChosenQset(rowdata.key); goToQSetEditor() }}>{index}</td>
                                <td onClick={() => { setChosenQset(rowdata.key); goToQSetEditor() }}> {rowdata.name}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <button onClick={() => {createNewQSet()}}>Add new Question Set</button>
        </div>
    )
}

export { QSetRealTimeData, currQSetKey, isNewSet };