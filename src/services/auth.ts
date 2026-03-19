import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import {auth} from "../../firebaseConfig.ts";
import {useAuthStore} from "../store/authStore/authStore.ts";

//Subscribe to auth state changes
export const initAuthListener = () => {
    const { setUser, setInitialized } = useAuthStore.getState();
    onAuthStateChanged(auth, (user) => {
        setUser(user);
        setInitialized(true);
    });
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

//Reset password
export const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
}
