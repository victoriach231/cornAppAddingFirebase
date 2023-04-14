import React from 'react';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Class from './components/Class';
import Account from './components/Account';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';


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
                    <Route path='/class' element={<Class />} />

                </Routes>
            </AuthContextProvider>
        </div>
    );
}

export default App;