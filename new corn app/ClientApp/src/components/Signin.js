import React, { useState } from 'react';
import { Link, useNavigate, Navigate} from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import './signin.css';
import logo from './images/CornHusker.png'

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
            console.log("hi");
            console.log(user);
            navigate('/account')
        } else {
            console.log("nope");
        }
    });


    return (
        <div>
            <img src={logo} alt={"Cornhusker Clicker Logo"} width={304} height={120} />
        <box>
            <div>
                <div>
                        <h1>Sign In</h1>
                
                </div>
                <body>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email Address</label>
                        <input onChange={(e) => setEmail(e.target.value)} type='email' />
                     </div>
                    <div>
                            <label>Password</label>
                        <passInput>
                                <input onChange={(e) => setPassword(e.target.value)} type='password' />
                            </passInput>
                    </div>
                        <button class = "button">
                        <span>
                                Sign In
                            </span>
                    </button>
                </form>
                </body>
                <p>
                    Don't have an account yet?{' '}
                    <Link to='/signup' className='underline'>
                        Sign up
              </Link>
                </p>
                </div>
            </box>
        </div>
    );
};
export default Signin;

