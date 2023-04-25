import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { getDatabase, ref, child, push, update } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import './CSS/Signup.css';
import logo from './images/CornHusker.png'

const Signup = () => {
    const [email, setEmail] = useState('');
    const [displayNameInput, setDisplayNameInput] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')
    const { createUser, finalizeUserSetup} = UserAuth();
    const navigate = useNavigate()
    const { user, logout } = UserAuth();

    // adding user to realtime database when a new user is created
    function writeNewUser(user, displayNameInput, email, userPhotoURL) {
        const db = getDatabase();

        // A user entry.
        const userData = {
            name: displayNameInput,
            email: email,
            picture: userPhotoURL,
            classesEnrolled: [],
            classesAdmin: []
        };

        // Get a key for a new user.
        console.log("hihihi");
        console.log(user);
        const newPostKey = user.uid;

        // Write the new post's data simultaneously in the posts list and the user's post list.
        const updates = {};
        updates['users/' + newPostKey] = userData;

        return update(ref(db), updates);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await createUser(email, password);
            await finalizeUserSetup(displayNameInput);

            const auth = getAuth();

            // if user didn't log out, they can go straight to their homepage
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    console.log("hiheyo");
                    console.log(user);
                    writeNewUser(user, displayNameInput, email, "");
                } else {
                    console.log("nope");
                }
            });



            navigate('/account')

        } catch (e) {
            setError(e.message);
            console.log(e.message);
        }
    };

    return (
        <div>
            <img src={logo} alt={"Cornhusker Clicker Logo"} width={304} height={120} />
        <box>
        <div>
            <div>
                <h1>Sign Up</h1>
                
            </div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <nameField>
                    <input
                        onChange={(e) => setDisplayNameInput(e.target.value)}
                        type='displayNameInput'
                        />
                    </nameField>
                </div>
                <div>
                    <label>Email Address</label>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        type='email'
                    />
                </div>
                <div>
                    
                    <label>Password</label>
                    <passInput>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        type='password'
                        />
                    </passInput>
                </div>
                    <button class="button">
                <span>Sign Up</span>
        </button>
            </form>
            <p>
                Already have an account?{' '}
                <Link to='/' className='underline'>
                    Sign in
          </Link>
            </p>
            </div>
            </box>
        </div>
    );
};

export default Signup;