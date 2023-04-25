import React, { useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import { getDatabase, ref, set, update, get, child} from "firebase/database";
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

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
            console.log('name updated')

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
            console.log('email updated')

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
            console.log('password updated')

        } catch (e) {
            console.log(e.message);
        }
    };

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);




    const [image, setImage] = useState({ imageSelected: "", another: "another" });

    const { imageSelected } = image;

    const handleChange = e => {
        e.persist();
        console.log(e.target.value);

        setImage(prevState => ({
            ...prevState,
            imageSelected: e.target.value
        }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        alert(`${imageSelected}`);
        updateProfilePicture(imageSelected);

        const updates = {};
        updates['users/' + user.uid + '/picture'] = imageSelected;
        update(ref(getDatabase()), updates);
    };

    const backNavigate = e => {
        navigate('/Account');
    };


    return (

        <div>
            <p>Hi welcome to the editing profile page</p>
            <button onClick={backNavigate}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="arrow-back" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                </svg>
            </button>

            <br />
            <p>Enter your new display name</p>
            <input type="text" onChange={handleNameInputChange} value={newNameInput} />
            <button onClick={handleNameChange}>Save new name</button>

            <br />
            <p>Enter your new email address</p>
            <input type="text" onChange={handleEmailInputChange} value={newEmailInput} />
            <button onClick={handleEmailChange}>Save new email address</button>

            <br />
            <p>Enter your new password </p>
            <input type="text" onChange={handlePasswordInputChange} value={newPasswordInput} />
            <button onClick={handlePasswordChange}>Save new password</button>

            <br />
            <p>Current profile photo:</p>
            <img src={user && user.photoURL} alt="default profile image" />
            <br />



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
                                value="default.png"
                                type="radio"
                                aria-label="radio 1"
                                label=<img src="default.png" alt="default profile image 1" />
                                onChange={handleChange}
                                checked={imageSelected === "default.png"}
                            />
                            <Form.Check
                                value="woman.png"
                                type="radio"
                                aria-label="radio 2"
                                label=<img src="woman.png" alt="default profile image 2" />
                                onChange={handleChange}
                                checked={imageSelected === "woman.png"}
                            />
                            <Form.Check
                                value="turtle.png"
                                type="radio"
                                aria-label="radio 3"
                                label=<img src="turtle.png" alt="default profile image 3 " />
                                onChange={handleChange}
                                checked={imageSelected === "turtle.png"}
                            />
                            <Form.Check
                                value="penguin.png"
                                type="radio"
                                aria-label="radio 4"
                                label=<img src="penguin.png" alt="default profile image 4" />
                                onChange={handleChange}
                                checked={imageSelected === "penguin.png"}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};
export default UpdateProfile;
