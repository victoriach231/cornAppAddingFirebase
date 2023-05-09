import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref , onValue, getDatabase, get, child, update } from 'firebase/database';
import { UserAuth } from '../../context/AuthContext';
import { newClass } from './index';
import { Table } from 'react-bootstrap';

const db = getDatabase()


// store the currently selected qSet and export it to other files
let selectedQSetKey = "";
let isNewSet = false;

const QSetRealTimeData = () => {
    const [tableData, setTableData] = useState([]);
    // store the qSet selected within the table, local

    const navigate = useNavigate();

    const currClass = newClass

    

    //populate table 
    useEffect(() => {
        // get all classes in firebase
        const dbRef2 = ref(db, 'classes/'+ currClass +'/questionSets');
        onValue(dbRef2, (snapshot) => {
            let records = [];
            snapshot.forEach(child => {
                let qSetKey = child.key
                let qSetName = child.child("name").val()

                records.push({key: qSetKey, name: qSetName})
            })
            setTableData(records)
        })
    }, [])

    // navigate to the qSetEditor, saving the key as we go
    const goToQSetEditor = (text) => {
        selectedQSetKey = text
        isNewSet = false
        navigate('/edit-questions')
    }
    
    //navigate to qSetEditor, with 
    const createNewQSet = () => {
        isNewSet = true;
        goToQSetEditor("")
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
                                <td onClick={() => { goToQSetEditor(rowdata.key) }}>{index}</td>
                                <td onClick={() => { goToQSetEditor(rowdata.key) }}>{rowdata.name}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <button className="btn btn-primary" onClick={() => {createNewQSet()}}>Add new Question Set</button>
            
        </div>
    )
}

export { QSetRealTimeData, selectedQSetKey, isNewSet };