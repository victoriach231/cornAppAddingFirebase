import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = UserAuth();

    if (!user) {
        console.log("why here");
        return <Navigate to='/' />;
    }
    console.log("logged in");
    return children;
};

export default ProtectedRoute;

