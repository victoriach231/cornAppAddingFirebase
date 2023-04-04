import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { database } from '../firebase';
import { getDatabase, ref, set, child, get, push, update } from "firebase/database";
import { ChangeEvent, useState } from "react";

const Account = () => {
    const { user, logout } = UserAuth();
    const navigate = useNavigate();
    const [inputText, setInputText] = useState("");

    const handleClassInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        // 👇 Store the input value to local state
        setInputText(e.target.value);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
            console.log('You are logged out')
        } catch (e) {
            console.log(e.message);
        }
    };

    const pushData = () => {
        console.log("test");
        console.log(inputText);
        const db = getDatabase();
        set(ref(db, 'classes/' + inputText), {
            className: inputText,
            students: [],
            admin: [
                user.uid
            ]
        });


        const dbRef = ref(getDatabase());
        get(child(dbRef, 'classes/' + inputText)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });


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

        </div>
    );
};

export default Account;
