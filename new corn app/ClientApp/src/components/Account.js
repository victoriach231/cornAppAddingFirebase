import React from 'react';
import { RealTimeData } from "./realTimeData/index";
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { database } from '../firebase';
import { getDatabase, ref, set, child, get, push, update, query, onValue  } from "firebase/database";
import { ChangeEvent, useState } from "react";
import './CSS/Account.css'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Modal, Button } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast';

const classFunctions = require('./AddingClassFunctionality');
const Account = () => {

    const { user, logout } = UserAuth();
    const navigate = useNavigate();

    // variable storing the inputted new class name
    const [inputText, setInputText] = useState("");

    // variable storing the inputted class code 
    const [classCodeInput, setClassCodeInput] = useState("");

    // creating a new random string of chars to refer to a newly created class
    const newClassKey = push(child(ref(getDatabase()), 'classes')).key;

    const handleClassInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        // 👇 Store the input value to local state
        setInputText(e.target.value);
    };

    // input to store class code entered
    const handleClassCodeInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        // 👇 Store the input value to local state
        setClassCodeInput(e.target.value);
    };

    // navigate to the page to change email/photo/password
    const updateProfile = () => {
        navigate('/update-profile');
    };

    // logs out a user currently signed in
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (e) {
            console.log(e.message);
        }
    };


    // creates/adds a new class to the database
    const pushData = () => {
        set(ref(getDatabase(), 'classes/' + newClassKey), {
            className: inputText,
            sessionActive: false,
            students: [],
            admin: [
                user.uid
            ],
            classCode: classFunctions.generateClassCode()
        
        });
    };

    


    /* // TESTING PURPOSES
    const nameList = []
    const dbRef = ref(getDatabase());
    get(child(dbRef, `classes`)).then((snapshot) => {
        if (snapshot.exists()) {
            let test = snapshot.val();
            for (let key in test) {
                console.log(test[key].className);
                nameList.push(test[key].className);

            }
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    }); */


    // join a already existing class
    const joinClass = () => {
        get(child(ref(getDatabase()), 'classes/')).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                console.log(snapshot.val()[0]);

                snapshot.forEach(function (childSnapshot) {
                    if (childSnapshot.val().classCode === classCodeInput) {
                        console.log(childSnapshot.val().classCode);
                        console.log(childSnapshot.key);

                        // TODO: add class to user list and update class rosters
                        //childSnapshot.classesEnrolled


                        /*)
                        const postListRef = ref(getDatabase(), 'classes/' + childSnapshot.key + '/students'); */

                        // add student to class list
                        const newStudent = {
                            user: user.uid
                        };

                        const updates = {};
                        updates['classes/' + childSnapshot.key + '/students/' + user.uid] = newStudent;

                        update(ref(getDatabase()), updates);

                        // add class to student's list
                        const newClass = {
                            class: childSnapshot.key
                        };

                        const update2 = {};
                        update2['users/' + user.uid + '/classesEnrolled/' + childSnapshot.key] = newClass;

                        update(ref(getDatabase()), update2);


                    }
                });
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });

    };

    

    // start/end a session
    const startSession = () => {
        get(child(ref(getDatabase()), 'classes/-NU2IaOonHDJBsY0oGkB/sessionActive')).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val()['sessionActive']);
                set(ref(getDatabase(), 'classes/-NU2IaOonHDJBsY0oGkB/sessionActive'), {

                    sessionActive: !snapshot.val()['sessionActive']
                });

            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });



    };

    // join a session
    // TODO use selected class ID
    const joinSession = () => {
        get(child(ref(getDatabase()), 'classes/-NU2IaOonHDJBsY0oGkB/sessionActive')).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val()['sessionActive']);
                if (snapshot.val()['sessionActive'] === true) {
                    const newStudent = {
                        user: user.uid
                    };
                    const updates = {};
                    updates['classes/-NU2IaOonHDJBsY0oGkB/sessionActive/activeStudents/' + user.uid] = newStudent;

                    update(ref(getDatabase()), updates);
                }


            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });

    };

    // TODO use current class ID
    const showSessionUsers = () => {
        const starCountRef = ref(getDatabase(), 'classes/-NU2IaOonHDJBsY0oGkB/sessionActive/activeStudents');
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            console.log(data);
        });
    };



    // set up class creation popup
    const [showCreateClass, setShowCreateClass] = useState(false);
    const handleClose = () => setShowCreateClass(false);
    const handleShow = () => setShowCreateClass(true);

    // set up class joining popup
    const [showJoinClass, setShowJoinClass] = useState(false);
    const handleClassJoinClose = () => setShowJoinClass(false);
    const handleClassJoinShow = () => setShowJoinClass(true);

    const [showCreateToast, setCreate] = useState(false);
    //const [showB, setShowB] = useState(true);

    //const toggleShowCreate = () => setCreate(!showCreateToast);
    //const toggleShowB = () => setShowB(!showB);

    return (
       
        <div>
            <br />
            <div class='drop'>
                <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic">
                        <div class='userInfo'>
                        <img src={user && user.photoURL} class="userImg" alt="default profile image" />

                        {user && user.displayName}
                        </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>   
                <div class='dropdownItems'>
                <Dropdown.Item onClick={updateProfile}>Update Profile</Dropdown.Item>
                            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                        </div> 
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <h1>Account</h1>
            
            
            <br />           
            <br />

            <h2>Classes Enrolled</h2>
            <RealTimeData />

            <br />
            <Button variant="primary" onClick={handleShow}>Create a class!</Button>

            <Modal show={showCreateClass} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a new class!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h6>Type in your class name:</h6>
                    <input type="text" onChange={handleClassInputChange} value={inputText} />
                    <Toast onClose={() => setCreate(false)} show={showCreateToast} delay={3000} autohide>
                        <Toast.Header>
                            <strong className="me-auto">Class Creation</strong>
                        </Toast.Header>
                        <Toast.Body>{inputText} created sucessfully!</Toast.Body>
                    </Toast>
                    <mbtn>
                        <button class="m" onClick={() => { pushData(); setCreate(true) }}>Create Class</button>
                    </mbtn>
                </Modal.Body>

            </Modal>

            <br />

            <br />
            <Button variant="primary" onClick={handleClassJoinShow}>Join a class!</Button>

            <Modal show={showJoinClass} onHide={handleClassJoinClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Join a class!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h6>Enter the class code:</h6>
                    <input type="text" onChange={handleClassCodeInputChange} value={classCodeInput} />
                    <mbtn>
                        <button class="m" onClick={joinClass}>Join Class</button>
                    </mbtn>
                </Modal.Body>

            </Modal>


            <br />

            <p>Testing buttons: </p>
            

            <br />
            <button onClick={startSession}>Start session</button>

            <br />
            <button onClick={joinSession}>Join session</button>

            <br />
            <button onClick={showSessionUsers}>Display users in the session</button>
            
        </div>
    );
};
export default Account;