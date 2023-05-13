import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, onValue, getDatabase, get, child, set } from 'firebase/database';
import Select from 'react-select'
import { newClass } from './index';
import { Table } from 'react-bootstrap';

const sessionSetupFunctions = require('./StartingSessionSetupFunctions');

const db = getDatabase()

// store the currently selected qSet and export it to other files
let selectedEditQSetKey = "";
let isNewSet = false;

let selectedLaunchQSetKey = "";

const stopSession = (currClass) => {
    //stop session logic
    get(child(ref(getDatabase()), 'classes/' + currClass + '/sessionActive')).then((snapshot) => {
        if (snapshot.exists()) {                    
            set(ref(getDatabase(), 'classes/' + currClass + '/sessionActive'), {
                sessionActive: false,
                currentQuestion: 0,
                nextQuestion: 0,
                timerToggled: false
            });
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

const QSetRealTimeData = () => {
    const [tableData, setTableData] = useState([]);

    const navigate = useNavigate();
    const currClass = newClass

    // for selecting QSet for session
    const [selectedQSet, setSelectedQSet] = useState({value:'', label:''})
    const [sessionActive, setSessionActive] = useState(false)

    const startSession = () => {
        if(selectedQSet.value !== '') {
            //start session logic
            get(child(ref(getDatabase()), 'classes/' + currClass + '/sessionActive')).then((snapshot) => {
                if (snapshot.exists()) {                    
                    set(ref(getDatabase(), 'classes/' + currClass + '/sessionActive'), sessionSetupFunctions.createSessionSetup(selectedLaunchQSetKey));
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });
            setSessionActive(true)
            selectedLaunchQSetKey = selectedQSet.value
            goToSession()
        }
        else {
            // error logic
            console.log("Question Set not selected")
        }
    }

    const goToSession = () => {
        navigate('/session-instructor-view')
    }


    // do all onload stuff
    useEffect(() => {
        // get all question sets in this class to populate table
        const qSetDBRef = ref(db, 'classes/'+ currClass +'/questionSets');
        onValue(qSetDBRef, (snapshot) => {
            let records = [];
            snapshot.forEach(child => {
                let qSetKey = child.key
                let qSetName = child.child("name").val()

                records.push({value: qSetKey, label: qSetName})
            })
            setTableData(records)
        })

        // get and set session active
        const sessionDBRef = ref(db, 'classes/' + currClass + '/sessionActive/sessionActive');
        onValue(sessionDBRef, (snapshot) => {
            if(snapshot.exists()) {
                setSessionActive(snapshot.val())
            }
        })
    }, [])

    // navigate to the qSetEditor, saving the key as we go
    const goToQSetEditor = (text) => {
        isNewSet = false;
        selectedEditQSetKey = text
        navigate('/edit-questions')
    }
    
    // navigate to qSetEditor
    const createNewQSet = () => {
        isNewSet = true;
        selectedEditQSetKey = ""
        navigate('/edit-questions')
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
                                <td onClick={() => { goToQSetEditor(rowdata.value) }}>{index + 1}</td>
                                <td onClick={() => { goToQSetEditor(rowdata.value) }}>{rowdata.label}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <button className="btn btn-primary" onClick={() => {createNewQSet()}}>Add new Question Set</button>
            <Select
                name="Question Set Selector"
                options={tableData}
                value={selectedQSet}
                onChange={setSelectedQSet}
                isDisabled={sessionActive}
            />
            <br />
            <div className="sessionActivity">
            <button className="btn btn-primary" onClick={startSession} disabled={sessionActive}>Start session</button>
                <p>Session Active: {sessionActive.toString()} </p>
            </div>
            <button onClick={() => {setSessionActive(false); stopSession(currClass); }} disabled={!sessionActive}>Stop Session</button>
        </div>
    )
}

export { QSetRealTimeData, selectedEditQSetKey as selectedQSetKey, isNewSet, selectedLaunchQSetKey as launchedQSetKey, stopSession };