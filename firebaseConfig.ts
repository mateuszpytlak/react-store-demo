import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAvmli6x-a3TUD8wVbP8_HBtN7smhCZ2P0",
    authDomain: "react-store-app-9ddcc.firebaseapp.com",
    projectId: "react-store-app-9ddcc",
    storageBucket: "react-store-app-9ddcc.firebasestorage.app",
    messagingSenderId: "228982583215",
    appId: "1:228982583215:web:0fdf9e20ec5a6bb05fc95a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
