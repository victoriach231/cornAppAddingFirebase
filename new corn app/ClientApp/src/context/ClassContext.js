import { createContext, useContext, useEffect, useState } from 'react';
import { classSelected } from '../../index';

const ClassContext = createContext();

export const ClassContextProvider = ({ children }) => {
    const [class, setClass] = useState({});

    useEffect(() => {
        const unsubscribe = classSelected() => {
            setClass(currentUser);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <ClassContext.Provider value={{ class }}>
            {children}
        </ClassContext.Provider>
    );
};

export const Class = () => {
    return useContext(ClassContext);
};

