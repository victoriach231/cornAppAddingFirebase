import React, { Component, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref as sRef, onValue, getDatabase, get, child, ref, update } from 'firebase/database';
import { UserAuth } from '../../context/AuthContext';
import { Table } from 'react-bootstrap';
import { database } from '../../firebase';
import Toast from 'react-bootstrap/Toast';

const db = getDatabase();

// store the currently selected class and export it to other files
let newClass = "";

const RealTimeData = () => {
    const [tableData, setTableData] = useState([]);
    // store the class selected within the table, local
    const [chosenClass, setChosenClass] = useState('');

    const userTable = UserAuth();
    const navigate = useNavigate();

    // refresh when enroll in new classes or create a new class
    useEffect(() => {
        // get all classes user is enrolled in
        const dbRef = sRef(db, 'users/' + userTable.user.uid + '/classesEnrolled/');

        onValue(dbRef, (snapshot) => {
            let userRecords = [];
            snapshot.forEach(childSnapshot => {
                let keyName = childSnapshot.key;
                let data = childSnapshot.val();
                userRecords.push({ "key": keyName, "data": data });
            });

            // get all classes in firebase
            const dbRef2 = sRef(db, 'classes/');


            onValue(dbRef2, (snapshot) => {
                let records = [];
                snapshot.forEach(childSnapshot => {
                    let classKeyName = childSnapshot.key;
                    let classData = childSnapshot.val();

                    userRecords.forEach((userRecord) => {
                        // check if current class equals the current enrolled in class (to get display name)
                        if (userRecord.key == classKeyName) {
                            records.push({ "key": classKeyName, "data": [classData, "🎓"] });
                        }
                    });

                    // check if current user is admin of the current class
                    if (userTable.user.uid == classData.admin) {
                        records.push({ "key": classKeyName, "data": [classData, "🍎"] });
                    }
                });
                setTableData(records);
            });
        });
    }, []);


    // set what class is currently selected
    useEffect(() => {
        newClass = chosenClass;
    }, [chosenClass]);

    // get the display name of the currently selected class
    let chosenClassDisplayName = "";
    const displayNameRef = ref(db, 'classes/' + chosenClass + "/className/");
    onValue(displayNameRef, (snapshot) => {
        const data = snapshot.val();
        chosenClassDisplayName = data;
    });

    // join a session
    // TODO use selected class ID
    const joinSession = (selectedClassID) => {
        get(child(ref(getDatabase()), 'classes/' + selectedClassID + '/sessionActive')).then((snapshot) => {
            if (snapshot.exists()) {
                if (snapshot.val()['sessionActive'] === true) {
                    const newStudent = {
                        user: userTable.user.uid,
                        name: userTable.user.displayName
                    };


                    const updates = {};
                    updates['classes/' + selectedClassID + '/sessionActive/activeStudents/' + userTable.user.uid] = newStudent;

                    update(ref(getDatabase()), updates);
                }


            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });

    };

    // navigate to the class page, depending on whether the user is an instructor or student
    const goToClassPage = (selectedClassID) => {
        // if admin, move to class page
        get(child(ref(getDatabase()), 'classes/' + selectedClassID)).then((snapshot) => {
            if (snapshot.exists()) {
                // if the user is an instructor or a TA of a class, navigate to the class page
                if (snapshot.val()['admin'].includes(userTable.user.uid)) {
                    navigate('/class');
                }
                else if (snapshot.val()['tas']) {
                    if (snapshot.val()['tas'].hasOwnProperty(userTable.user.uid)) {
                        navigate('/class');
                    }
                    // if student, move to session page if class session is active
                    else if (snapshot.val()['sessionActive']['sessionActive'] === true) {
                        joinSession(selectedClassID);
                        navigate('/session-student-view');
                    }
                    // user is a student and session not active, TODO display popup that session not started
                    else {
                        setNoSession(true);
                    }
                }
                // if student, move to session page if class session is active
                else if (snapshot.val()['sessionActive']['sessionActive'] === true) {
                    joinSession(selectedClassID);
                    navigate('/session-student-view');
                }
                // user is a student and session not active, TODO display popup that session not started
                else {
                    setNoSession(true);
                }
                
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    };
    const [showNoSession, setNoSession] = useState(false);

    return (
        <div>
            {/* Joining Class Session When Not Active*/}
            <div className="toast-container
                position-absolute
                top-30 start-50
                translate-middle-x">
                <Toast onClose={() => setNoSession(false)} show={showNoSession} delay={3000} autohide='true'>
                    <Toast.Header>
                        <strong className="me-auto">Class Session</strong>
                    </Toast.Header>
                    <Toast.Body>The session for {chosenClassDisplayName} has not started yet. </Toast.Body>
                </Toast>
            </div>
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
                            <tr key={index}>
                                <td onClick={() => { setChosenClass(rowdata.key); goToClassPage(rowdata.key) }}>{rowdata.data[1]}</td>
                                <td onClick={() => { setChosenClass(rowdata.key); goToClassPage(rowdata.key) }}> {rowdata.data[0].className}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>

        </div>
    );
}

export { RealTimeData, newClass };


