import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { database } from '../firebase';
import { getDatabase, ref, set, child, get, push, update, query } from "firebase/database";
import { ChangeEvent, useState } from "react";

const Account = () => {
    const { user, logout } = UserAuth();
    const navigate = useNavigate();

    // variable storing the inputted new class name
    const [inputText, setInputText] = useState("");

    // variable storing the inputted class code 
    const [classCodeInput, setClassCodeInput] = useState("");

    // creating a new random string of chars to refer to a newly created class
    const newClassKey = push(child(ref(getDatabase()), 'classes')).key;

    // input box to store new class name
    const handleClassInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        // 👇 Store the input value to local state
        setInputText(e.target.value);
    };

    // input to store class code entered
    const handleClassCodeInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        // 👇 Store the input value to local state
        setClassCodeInput(e.target.value);
    };

    // logs out a user currently signed in
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
            console.log('You are logged out')
        } catch (e) {
            console.log(e.message);
        }
    };

    // creates/adds a new class to the database
    const pushData = () => {
        console.log("test");
        console.log(inputText);
        set(ref(getDatabase(), 'classes/' + newClassKey), {
            className: inputText,
            students: [],
            admin: [
                user.uid
            ],
            classCode: (Math.floor(Math.random() * 10).toString()
                + Math.floor(Math.random() * 10).toString()
                + Math.floor(Math.random() * 10).toString()
                + Math.floor(Math.random() * 10).toString()
                + Math.floor(Math.random() * 10).toString())
        });


        // reads in a newly created class and prints its info to the dev tools console
        const dbRef = ref(getDatabase());
        get(child(dbRef, 'classes/' + newClassKey)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    };

    // join a already existing class
    const joinClass = () => {
        console.log("hi");
        get(child(ref(getDatabase()), 'classes/')).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                console.log(snapshot.val()[0]);

                snapshot.forEach(function (childSnapshot) {
                    if (childSnapshot.val().classCode === classCodeInput) {
                        console.log("YES");
                        // TODO: add class to user list and update class rosters
                        //childSnapshot.classesEnrolled
                    }
                });
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });

    };

    // navigate to the class page
    const goToClassPage = () => {
        try {
            navigate('/class');
            console.log('went to class')
        } catch (e) {
            console.log(e.message);
        }

    };


    return (
        <div>
            <h1>Account</h1>
            <p>User Email: {user && user.email}</p>
            <p>Display Name: {user && user.displayName}</p>
            <img src={user && user.photoURL} alt="default profile image" />
            <br />

            <button onClick={handleLogout}>Logout</button>
            <br />
            <br />

            
            <input type="text" onChange={handleClassInputChange} value={inputText} />
            <button onClick={pushData}>Add class to Firebase</button>
            <br />

            <input type="text" onChange={handleClassCodeInputChange} value={classCodeInput} />
            <button onClick={joinClass}>Join Class</button>

            <br />
            <button onClick={goToClassPage}>Go to the class page!</button>


        </div>
    );
};

export default Account;
