import React, { useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import { getDatabase, ref, set, update, get, child} from "firebase/database";
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Toast from 'react-bootstrap/Toast';
import './CSS/UpdateProfile.css';

const UpdateProfile = () => {
    const { user, updateEmailAddress, updateDisplayName, updateUserPassword, updateProfilePicture } = UserAuth();

    const dbRef = ref(getDatabase());
    const navigate = useNavigate();

    // variable storing the inputted new display name  
    const [newNameInput, setNewNameInput] = useState("");

    // variable storing the inputted new email  
    const [newEmailInput, setNewEmailInput] = useState("");

    // variable storing the inputted new password  
    const [newPasswordInput, setNewPasswordInput] = useState("");

    // update the input field to show what was typed
    const handleNameInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        // 👇 Store the input value to local state
        setNewNameInput(e.target.value);
    };

    const handleEmailInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        // 👇 Store the input value to local state
        setNewEmailInput(e.target.value);
    };

    const handlePasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        // 👇 Store the input value to local state
        setNewPasswordInput(e.target.value);
    };

    // updates the email change in the database
    const handleNameChange = async () => {
        try {
            await updateDisplayName(newNameInput);

            const updates = {};
            updates['users/' + user.uid + '/name'] = newNameInput;

            return update(dbRef, updates);

        } catch (e) {
            console.log(e.message);
        }
    };

    // updates the email change in the database
    const handleEmailChange = async () => {
        try {
            await updateEmailAddress(newEmailInput);

            const updates = {};
            updates['users/' + user.uid + '/email'] = newEmailInput;

            return update(dbRef, updates);

        } catch (e) {
            console.log(e.message);
        }
    };

    // updates the password change
    const handlePasswordChange = async () => {
        try {
            await updateUserPassword(newPasswordInput);

        } catch (e) {
            console.log(e.message);
        }
    };

    const [show, setShow] = useState(false);
    const [toastShow, setToastShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);




    const [image, setImage] = useState({ imageSelected: "./images/default.png", another: "another" });

    const { imageSelected } = image;

    const handleChange = e => {
        e.persist();
        console.log(e.target.value);

        setImage(prevState => ({
            ...prevState,
            imageSelected: e.target.value
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        //alert(`${imageSelected}`);
        updateProfilePicture(imageSelected);

        const updates = {};
        updates['users/' + user.uid + '/picture'] = imageSelected;
        await update(ref(getDatabase()), updates);
    };

    const backNavigate = e => {
        navigate('/account');
    };

    const handleForm = e => {
        handleSubmit();
        setShow(false);
    }


    return (
        <div>
            <Toast className="toast-container position-absolute top-30 start-50 translate-middle-x" bg="white" onClose={() => setToastShow(false)} show={toastShow} delay={2000} autohide>
                <Toast.Header>
                    <strong>Changes Saved</strong>
                </Toast.Header>
                <Toast.Body>Profile Photo Updated</Toast.Body>
            </Toast>

            <div className='header'>
                <div className='corner'>
                <button onClick={backNavigate}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="arrow-back" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                    </svg>

                    </button>
                    </div>
            <h1 class= 'title'>Update Your User Profile</h1>
            
            </div>


            <p>Current User Email: {user && user.email}</p>
            <p>Current Display Name: {user && user.displayName}</p>
            <br />
            <div>
                <em className="nfield-spacing">Enter your new display name: </em>
            
                <input type="text" onChange={handleNameInputChange} value={newNameInput} />
            
                <button onClick={handleNameChange}>Save new name</button>
            </div>
            <br />
            <div>
            <em className="emailfield-spacing">Enter your new email address: </em>
            
                <input type="text" onChange={handleEmailInputChange} value={newEmailInput} />
                <button onClick={handleEmailChange}>Save new email address</button>
            </div>
            
            <br />
            <div>
            <em className="passfield-spacing">Enter your new password: </em>
            
                <input type="text" onChange={handlePasswordInputChange} value={newPasswordInput} />
            
            <button onClick={handlePasswordChange}>Save new password</button>
            </div>
            <br />
                
            <div className='changeImage'>
                
                <span>
                    <p>Current profile photo:</p>
                </span>
                <span>
            <img src={user && user.photoURL} alt="default profile image" />
                    <br />
                    </span>
                


            
            <Button variant="primary" onClick={handleShow}>
                Change Profile Picture
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Your Profile Photo</Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleSubmit}>
                        <Form.Group controlId="imageSelected">
                            <Form.Check
                                value="./images/default.png"
                                type="radio"
                                aria-label="radio 1"
                                label=<img src="./images/default.png" alt="Default Profile Pic" />
                                onChange={handleChange}
                                checked={imageSelected === "./images/default.png"}
                            />
                            <Form.Check
                                value="./images/woman.png"
                                type="radio"
                                aria-label="radio 2"
                                label=<img src="./images/woman.png" alt="Woman Profile Pic" />
                                onChange={handleChange}
                                checked={imageSelected === "./images/woman.png"}
                            />
                            <Form.Check
                                value="./images/turtle.png"
                                type="radio"
                                aria-label="radio 3"
                                label=<img src="./images/turtle.png" alt="Turtle Profile Pic" />
                                onChange={handleChange}
                                checked={imageSelected === "./images/turtle.png"}
                            />
                            <Form.Check
                                value="./images/penguin.png"
                                type="radio"
                                aria-label="radio 4"
                                label=<img src="./images/penguin.png" alt="Penguin Profile Pic" />
                                onChange={handleChange}
                                checked={imageSelected === "./images/penguin.png"}
                            />
                            <Form.Check
                                    value="./images/bobSpaghetti.png"
                                    type="radio"
                                    aria-label="radio 4"
                                    label=<img src="./images/bobSpaghetti.png" alt="Bob Spaghetti Profile Pic" />
                                onChange={handleChange}
                                checked={imageSelected === "./images/bobSpaghetti.png"}
                            />
                        </Form.Group>
                            <Button variant="primary" type="submit" onClick={() => { handleForm(); setToastShow(true) }}>
                            Submit
                        </Button>
                    </form>
                </Modal.Body>
                
                    </Modal>
                
            </div>

        </div>
    );
};
export default UpdateProfile;
