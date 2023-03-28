// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAT6H56FQH5PFAOUHrP--_0K44zixlBb9c",
    authDomain: "my-new-app-52718.firebaseapp.com",
    projectId: "my-new-app-52718",
    storageBucket: "my-new-app-52718.appspot.com",
    messagingSenderId: "141933594661",
    appId: "1:141933594661:web:c9bea0ac79fc80535697cc",
    measurementId: "G-FSZ121Z0C0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app
