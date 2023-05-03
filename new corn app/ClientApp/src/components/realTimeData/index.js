import React, { Component } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref as sRef, onValue, getDatabase, get, child, ref } from 'firebase/database';
import { UserAuth } from '../../context/AuthContext';
import { Table } from 'react-bootstrap';
import { database } from '../../firebase';

const db = getDatabase();
const ClassContext = createContext();

const RealTimeData = () => {
    const [tableData, setTableData] = useState([]);
    const [chosenClass, setChosenClass] = useState('');

    const handleClassInputChange = (classID, event) => {
        // 👇 Store the input value to local state
        console.log(event.target.lastChild.data);
        setChosenClass(event.target.lastChild.data);
        console.log("in handle class");
        console.log(chosenClass);
    };

    const userTable = UserAuth();
    const navigate = useNavigate();


    // get all classes user is enrolled in and refresh when classes added
    useEffect(() => {
        const dbRef = sRef(db, 'users/' + userTable.user.uid + '/classesEnrolled/');

        onValue(dbRef, (snapshot) => {
            let records = [];
            snapshot.forEach(childSnapshot => {
                let keyName = childSnapshot.key;
                let data = childSnapshot.val();
                records.push({ "key": keyName, "data": data });
                //console.log(data.class);
                //console.log((sRef(db, 'classes/' + data.class + '/')).childSnapshot);
            });
            setTableData(records);
        });

        /*
        tableData.forEach(function (record) {
            const dbRef1 = sRef(db, 'classes/' + record.childSnapshot.val() + '/');
            console.log(record.childSnapshot.val());
            onValue(dbRef1, (snapshot) => {
                let classNames = [];
                snapshot.forEach(childSnapshot => {
                    let keyName = childSnapshot.key;
                    let data = childSnapshot.val();
                    classNames.push({ "key": keyName, "data": data });
                    console.log(data);
                });
                setTableData(classNames);
            });
        })*/
        console.log('*************');
        console.log(chosenClass);
    }, [chosenClass]);


    // navigate to the class page. TODO takes in the class id of the selected class in the table
    const goToClassPage = (selectedClassID) => {
        console.log("hiiiiii");
        console.log(selectedClassID);
        console.log("chosen class:");
        console.log(chosenClass);


        // TODO check if user logged in is a class instructor or a student
        // if admin, move to class page
        get(child(ref(getDatabase()), 'classes/' + selectedClassID)).then((snapshot) => {

            if (snapshot.exists()) {
                console.log(snapshot.val())
                console.log(snapshot.val()['admin']);
                if (snapshot.val()['admin'].includes(userTable.user.uid)) {
                    console.log("omgg???");
                    navigate('/class');
                }
                // if student, move to session page if class session is active
                else if (snapshot.val()['sessionActive']['sessionActive'] === true) {
                    // call joinSession()
                    // navigate to session page
                    console.log("sad student logic");
                }
                // user is a student and session not active, TODO display popup that session not started
                else {
                    console.log("user is a student and session not active");
                }
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    };

    const classSelectedd = () => {
        console.log("AHHHHHHH");
        console.log(chosenClass);
        window.globalVariable = 'HELLO KELVIN';
        console.log(userTable.user.uid);
        // goToClassPage(rowdata.data.class)
    };

    return (
        <div>
            
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Class Name</th>
                </tr>
            </thead>

            <tbody>
                {tableData.map((rowdata, index) => {
                    return (
                        <ClassContext.Provider value={chosenClass}>
                            <tr>
                                <td onClick={() => { let temp = rowdata.data.class; setChosenClass((temp) => temp + ' '); classSelectedd(); handleClassInputChange(rowdata.data.class); goToClassPage(rowdata.data.class) }}> {index}</td>
                                <td onClick={event => { let temp = rowdata.data.class; setChosenClass((temp) => temp + ' '); classSelectedd(); handleClassInputChange(rowdata.data.class, event); goToClassPage(rowdata.data.class) }}> {rowdata.key}</td>
                                <td onClick={() => { let temp = rowdata.data.class; setChosenClass((temp) => temp + ' '); classSelectedd(); handleClassInputChange(rowdata.data.class); goToClassPage(rowdata.data.class) }}> {rowdata.data.email}</td>
                            </tr>
                        </ClassContext.Provider>

                    )
                })}
            </tbody>
        </Table>
            <p> {chosenClass}</p>
            </div>
    );
}
const ClassSelected = () => {
    return useContext(ClassContext);
};

export { RealTimeData, ClassSelected, ClassContext};

//                                 <td onClick={() => { let temp = rowdata.data.class; setChosenClass((temp) => temp + ' '); classSelectedd(); handleClassInputChange(rowdata.data.class); goToClassPage(rowdata.data.class) }}> {rowdata.key}</td>
