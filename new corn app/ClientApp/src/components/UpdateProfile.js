import React, { useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import { getDatabase, ref, set, update } from "firebase/database";

const UpdateProfile = () => {
    const { user, updateEmailAddress, updateDisplayName, updateUserPassword } = UserAuth();

    const db = getDatabase();

    // variable storing the inputted new display name  
    const [newNameInput, setNewNameInput] = useState("");

    // variable storing the inputted new email  
    const [newEmailInput, setNewEmailInput] = useState("");

    // variable storing the inputted new password  
    const [newPasswordInput, setNewPasswordInput] = useState("");

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

            return update(ref(db), updates);

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

            return update(ref(db), updates);

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

    return (
        <div>
            <p>Hi welcome to the editing profile page</p>

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

        </div>
    );
};
export default UpdateProfile;
