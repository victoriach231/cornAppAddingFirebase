﻿import React from 'react';
import { RealTimeData } from "./realTimeData/ClassDisplay";
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { getDatabase, ref, set, child, get, push, update } from "firebase/database";
import { useState } from "react";
import './CSS/Account.css'
import Dropdown from 'react-bootstrap/Dropdown';
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

    const handleClassInputChange = (e) => {
        // store the input value to local state
        setInputText(e.target.value);
    };

    // input to store class code entered
    const handleClassCodeInputChange = (e) => {
        // store the input value to local state
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
    const createClass = () => {
        const classCode = classFunctions.generateClassCode();
        set(ref(getDatabase(), 'classes/' + newClassKey), classFunctions.createClassSetup(inputText, user.uid, classCode));
    };


    // join a already existing class
    const joinClass = () => {
        get(child(ref(getDatabase()), 'classes/')).then((snapshot) => {
            if (snapshot.exists()) {
                let classMatch = false;

                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.val().classCode === classCodeInput) {
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
                        classMatch = true;
                    }
                });
                if (classMatch == false) {
                    setJoin(false);
                    setIncorrectJoin(true);
                }
            } else {
                setJoin(false);
            }
        }).catch((error) => {
            console.error(error);
            setJoin(false);
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

    // set up toasts
    const [showCreateToast, setCreate] = useState(false);
    const [showJoinToast, setJoin] = useState(false);
    const [showIncorrectJoin, setIncorrectJoin] = useState(false);

    return (
        <div>
            {/* Confirmation of Class Creation */}
            <div className="toast-container
                position-absolute
                top-30 start-50
                translate-middle-x">
                <Toast onClose={() => setCreate(false)} show={showCreateToast} delay={3000} bg="white" autohide='true'>
                <Toast.Header>
                    <strong className="me-auto">Class Creation</strong>
                </Toast.Header>
                <Toast.Body>{inputText} created sucessfully!</Toast.Body>
                </Toast>
            </div>
            {/* Confirmation of Joining Class */}
            <div className="toast-container
                position-absolute
                top-30 start-50
                translate-middle-x">
                <Toast onClose={() => setJoin(false)} show={showJoinToast} delay={3000} bg="white" autohide='true'>
                    <Toast.Header>
                        <strong className="me-auto">Joining Class</strong>
                    </Toast.Header>
                    <Toast.Body>Class joined sucessfully!</Toast.Body>
                </Toast>
            </div>
            {/* Incorrect Code for Joining Class */}
            <div className="toast-container
                position-absolute
                top-30 start-50
                translate-middle-x
                "
            >
                
                <Toast className="incorrectCode" onClose={() => setIncorrectJoin(false)} show={showIncorrectJoin} delay={5000} autohide='true'>
                    
                    <Toast.Header>
                        <strong className="me-auto">Joining Class</strong>
                    </Toast.Header>
                        <Toast.Body>Incorrect Class Code. Try Again!</Toast.Body>
                    
                </Toast>
                
            </div>
            <br />
            <div className='drop'>
                <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic">
                        <div className='userInfo'>
                        <img src={user && user.photoURL} className="userImg" alt="default profile image" />

                        {user && user.displayName}
                        </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>   
                <div className='dropdownItems'>
                <Dropdown.Item onClick={updateProfile}>Update Profile</Dropdown.Item>
                            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                        </div> 
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <h1>Account</h1>
            
            <br />      

            <h2>Classes Enrolled</h2>
            <RealTimeData />

            <br />
            <Button variant="primary" onClick={handleShow}>Create a class!</Button>

            <Modal show={showCreateClass} onHide={handleClose} delay={3000} autohide='true'>
                <Modal.Header closeButton>
                    <Modal.Title>Create a new class!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className='accountClass'>
                    <h6>Enter class name:</h6>
                        <input className='createClass' type="text" onChange={handleClassInputChange} value={inputText} placeholder="enter class name" />
                    
                    <div className='mbtn'>
                        <button className="m" onClick={() => { createClass(); setCreate(true); handleClose() }}>Create Class</button>
                        </div>
                    </div>
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
                <div className='accountClass'>
                    <h6>Enter the class code:</h6>
                        <input type="text" onChange={handleClassCodeInputChange} value={classCodeInput} placeholder="enter class code"/>
                    <div className='mbtn'>
                        <button className="m" onClick={() => { joinClass(); setJoin(true); handleClassJoinClose() }}>Join Class</button>
                        </div>
                    </div>
                </Modal.Body>

            </Modal>

            <br />
            
        </div>
    );
};
export default Account;