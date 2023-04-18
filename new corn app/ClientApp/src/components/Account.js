import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RealTimeData } from "./realTimeData/index";
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { database } from '../firebase';
import { getDatabase, ref, set, child, get, push, update } from "firebase/database";
import { ChangeEvent, useState } from "react";

const Account = () => {
    const { user, logout } = UserAuth();
    const navigate = useNavigate();

    // variable storing the inputted new class name
    const [inputText, setInputText] = useState("");

    // creating a new random string of chars to refer to a newly created class
    const newClassKey = push(child(ref(getDatabase()), 'classes')).key;

    const handleClassInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        // 👇 Store the input value to local state
        setInputText(e.target.value);
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
            ]
        });


        // reads in a newly created class and prints its info to the dev tools console
        const dbRef = ref(getDatabase());
        get(child(dbRef, 'classes/' + newClassKey)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val().className);
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    };

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
    });


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

            <h2>List of Firebase Classes</h2>
            <RealTimeData />
        </div>
    );
};

export default Account;
