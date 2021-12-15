// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyApIjAnG5SYTdPNoFhxeAkBCtyg7AjvbSE",
    authDomain: "mini-project-2c210.firebaseapp.com",
    projectId: "mini-project-2c210",
    storageBucket: "mini-project-2c210.appspot.com",
    messagingSenderId: "729584963430",
    appId: "1:729584963430:web:b89c989233c8b7ef7582a7",
    measurementId: "G-3NCJQZC033",
};

initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

export { db, auth };
