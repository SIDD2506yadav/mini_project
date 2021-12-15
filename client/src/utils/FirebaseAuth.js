import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { auth } from "../Firebase";
import { uploadUser } from "./FirebaseData";

const checkLogin = (email, password, setLoading, setError) => {
    if (email.length === 0 || email === null) {
        setLoading(false);
        setError("Email is required");
        return false;
    }

    if (password.length === 0 || password === null) {
        setLoading(false);
        setError("Password is required");
        return false;
    }
    return true;
};

const checkSignUp = (email, password, rePassword, setLoading, setError) => {
    if (email.length === 0 || email === null) {
        setLoading(false);
        setError("Email is required");
        return false;
    }

    if (password.length === 0 || password === null) {
        setLoading(false);
        setError("Password is required");
        return false;
    }

    if (password.length < 6) {
        setLoading(false);
        setError("Password length must be greater than 6");
        return false;
    }

    if (password !== rePassword) {
        setLoading(false);
        setError("Password and reEntered password must be same");
        return false;
    }
    return true;
};

export const loginUser = async (email, password, setLoading, setError) => {
    setLoading(true);
    setError(null);
    if (checkLogin(email, password, setLoading, setError)) {
        setError(null);

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setLoading(false);
                return true;
            })
            .catch((error) => {
                setLoading(false);
                const errorMessage = error.message;
                setError(errorMessage);
                return false;
            });
    } else {
        setLoading(false);
        return false;
    }
};

export const signUpUser = async (
    email,
    password,
    rePassword,
    setLoading,
    setError,
    name,
    phone,
    address1,
    address2,
    address3
) => {
    setLoading(true);
    setError(null);

    if (checkSignUp(email, password, rePassword, setLoading, setError)) {
        setError(null);

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                setError(null);
                setLoading(false);
                const user = userCredential.user;
                const result = uploadUser(
                    name,
                    phone,
                    email,
                    address1,
                    address2,
                    address3,
                    user.uid
                );
                return result;
            })
            .catch((error) => {
                const errorMessage = error.message;
                setError(errorMessage);
                return false;
            });
    } else {
        setLoading(false);
        return false;
    }
};
