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
    const updateProfile = async () => {
        try {
            navigate('/update-profile');
        } catch (e) {
            console.log(e.message);
        }
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
            sessionActive: false,
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

    // navigate to the class page
    const goToClassPage = () => {
        try {
            navigate('/class');
            console.log('went to class')
        } catch (e) {
            console.log(e.message);
        }

    };

    // start/end a session
    const startSession = () => {
        console.log("hi32");
        get(child(ref(getDatabase()), 'classes/-NTAht6jKvRKebh2RZyl/sessionActive')).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val()['sessionActive']);
                set(ref(getDatabase(), 'classes/-NTAht6jKvRKebh2RZyl/sessionActive'), {

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
    const joinSession = () => {
        get(child(ref(getDatabase()), 'classes/-NTAht6jKvRKebh2RZyl/sessionActive')).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val()['sessionActive']);
                if (snapshot.val()['sessionActive'] === true) {
                    const newStudent = {
                        user: user.uid
                    };
                    const updates = {};
                    updates['classes/-NTAht6jKvRKebh2RZyl/sessionActive/activeStudents/' + user.uid] = newStudent;

                    update(ref(getDatabase()), updates);
                }


            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });

    };

    const showSessionUsers = () => {
        const starCountRef = ref(getDatabase(), 'classes/-NTAht6jKvRKebh2RZyl/sessionActive/activeStudents');
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            console.log("kdsajfhk;jasdjkl;afjklasdjkl;fsa");
            console.log(data);
        });
    };

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
            <input type="text" onChange={handleClassInputChange} value={inputText} />

            <button onClick={pushData}>Add class to Firebase</button>

            <h2>List of Firebase Classes</h2>
            <RealTimeData />

            <br />
            <input type="text" onChange={handleClassCodeInputChange} value={classCodeInput} />
            <button onClick={joinClass}>Join Class</button>

            <br />
            <button onClick={goToClassPage}>Go to the class page!</button>

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
