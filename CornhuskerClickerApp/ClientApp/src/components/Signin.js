﻿import React, { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import './CSS/Signin.css';

const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { signIn } = UserAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')
        try {
            await signIn(email, password)
            navigate('/account')
        } catch (e) {
            setError(e.message)
            console.log(e.message)
        }
    };

    const auth = getAuth();

    // if user didn't log out, they can go straight to their homepage
    onAuthStateChanged(auth, (user) => {
        if (user) {
            navigate('/account')
        }
    });


    return (
        <div>
            <img src={'./images/cornHusker.png'} alt={"Cornhusker Clicker Logo"} width={304} height={120} />
            <div className='box'>
            <div>
                <div>
                        <h1>Sign In</h1>
                
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email Address</label>
                            <input onChange={(e) => setEmail(e.target.value)} type='email' placeholder="email"/>
                     </div>
                    <div>
                                <label className='passInput'>Password</label>
                                
                            <input onChange={(e) => setPassword(e.target.value)} type='password' placeholder="password"/>
                            
                    </div>
                        <button className= "button">
                        <span>
                                Sign In
                            </span>
                    </button>
                </form>
                
                <p>
                    Don't have an account yet?{' '}
                    <Link to='/signup' className='underline'>
                        Sign up
              </Link>
                </p>
                </div>
            </div>
        </div>
    );
};
export default Signin;