// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDcQYYDq2uOx_4yCjuzfKAYXWcKhiAx4UA",
    authDomain: "cornhuskerclicker-4cdaf.firebaseapp.com",
    projectId: "cornhuskerclicker-4cdaf",
    storageBucket: "cornhuskerclicker-4cdaf.appspot.com",
    messagingSenderId: "293325856983",
    appId: "1:293325856983:web:71801495897f944854d092",
    measurementId: "G-ZNXF6BCWNL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app
export const database = getDatabase(app);


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


