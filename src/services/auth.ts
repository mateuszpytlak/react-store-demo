import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import {auth} from "../../firebaseConfig.ts";
import {useAuthStore} from "../store/authStore/authStore.ts";

//Subscribe to auth state changes
export const  initAuthListener = () => {
    const { setUser } = useAuthStore.getState();
    onAuthStateChanged(auth, (user) => {
        setUser(user);
    })
}

//Register
export const registerUser = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
}

//Login
export const loginUser = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
}

//Logout
export const logoutUser = () => {
    return signOut(auth);
}
