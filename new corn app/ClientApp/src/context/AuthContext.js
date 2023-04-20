import { createContext, useContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    updateEmail,
    updatePassword
} from 'firebase/auth';
import { auth } from '../firebase';

const UserContext = createContext();

// TODO: add functionality for a user to update/change their password, photo, and name

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({});

    const createUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const finalizeUserSetup = (displayNameInput) => {
        return updateProfile(auth.currentUser, { displayName: displayNameInput, photoURL: "https://cdn.pixabay.com/photo/2012/04/26/19/43/profile-42914__340.png" });
    };

    const updateDisplayName = (displayNameInput) => {
        return updateProfile(auth.currentUser, { displayName: displayNameInput });
    };

    const updateEmailAddress = (emailInput) => {
        return updateEmail(auth.currentUser, emailInput);
    };

    const updateUserPassword = (passwordInput) => {
        return updatePassword(auth.currentUser, passwordInput);
    };

    const signIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logout = () => {
        return signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log(currentUser);
            setUser(currentUser);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <UserContext.Provider value={{ createUser, user, logout, signIn, finalizeUserSetup, updateEmailAddress, updateDisplayName, updateUserPassword }}>
            {children}
        </UserContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(UserContext);
};
