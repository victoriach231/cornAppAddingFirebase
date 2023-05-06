import React, { Component, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref as sRef, onValue, getDatabase, get, child, ref } from 'firebase/database';
import { UserAuth } from '../../context/AuthContext';
import { Table } from 'react-bootstrap';
import { database } from '../../firebase';

const db = getDatabase();

// store the currently selected class and export it to other files
let newClass = "";

const RealTimeData = () => {
    const [tableData, setTableData] = useState([]);
    // store the class selected within the table, local
    const [chosenClass, setChosenClass] = useState('');

    const userTable = UserAuth();
    const navigate = useNavigate();

    // get all classes user is enrolled in and refresh when classes added
    useEffect(() => {
        const dbRef = sRef(db, 'users/' + userTable.user.uid + '/classesEnrolled/');

        onValue(dbRef, (snapshot) => {
            let userRecords = [];
            snapshot.forEach(childSnapshot => {
                let keyName = childSnapshot.key;
                let data = childSnapshot.val();
                userRecords.push({ "key": keyName, "data": data });
            });

            // add display names to records
            const dbRef2 = sRef(db, 'classes/');
            let records = [];
            userRecords.forEach((userRecord) => {
                onValue(dbRef2, (snapshot) => {
                    snapshot.forEach(childSnapshot => {
                        let classKeyName = childSnapshot.key;
                        let classData = childSnapshot.val();
                        if (userRecord.key == classKeyName) {
                            records.push({ "key": classKeyName, "data": classData });
                        }
                    });
                    setTableData(records);
                });
            });
        });
    }, []);


    // set what class is currently selected
    useEffect(() => {
        newClass = chosenClass;
    }, [chosenClass]);


    // navigate to the class page, depending on whether the user is an instructor or student
    const goToClassPage = (selectedClassID) => {
        // TODO check if user logged in is a class instructor or a student
        // if admin, move to class page
        get(child(ref(getDatabase()), 'classes/' + selectedClassID)).then((snapshot) => {

            if (snapshot.exists()) {
                console.log(snapshot.val())
                console.log(snapshot.val()['admin']);
                if (snapshot.val()['admin'].includes(userTable.user.uid)) {
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
                            <tr>
                                <td onClick={() => { setChosenClass(rowdata.key); goToClassPage(rowdata.key) }}> {index}</td>
                                <td onClick={() => { setChosenClass(rowdata.key); goToClassPage(rowdata.key) }}> {rowdata.data.className}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>

        </div>
    );
}

export { RealTimeData, newClass };


