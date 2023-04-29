import React from 'react';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Class from './components/Class';
import Account from './components/Account';
import UpdateProfile from './components/UpdateProfile';
import Session from './components/Session';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import QuestionSetEdit from './components/QuestionSetEdit';


function App() {

    return (

        <div>
            
            <AuthContextProvider>
                <Routes>
                    
                    <Route
                        path='/account'
                        element={
                            <ProtectedRoute>
                                <Account />
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route path='/' element={<Signin />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route
                        path='/account'
                        element={
                            <ProtectedRoute>
                                <Account />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/class'
                        element={
                            <ProtectedRoute>
                                <Class />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path='/update-profile'
                        element={
                            <ProtectedRoute>
                                <UpdateProfile />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path='/edit-questions'
                        element={
                            <ProtectedRoute>
                                <QuestionSetEdit />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path='/session'
                        element={
                            <ProtectedRoute>
                                <Session />
                            </ProtectedRoute>
                        }
                    />
                    

                </Routes>
            </AuthContextProvider>
        </div>
    );
}

export default App;