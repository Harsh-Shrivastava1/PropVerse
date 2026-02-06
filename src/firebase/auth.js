import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import { auth, db } from "./config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const loginUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const registerUser = async (name, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send Verification Email
    await sendEmailVerification(user);

    // Create Builder Document
    await setDoc(doc(db, "builders", user.uid), {
        name,
        email,
        uid: user.uid,
        createdAt: serverTimestamp(),
        plan: "free",
        status: "inactive",
        emailVerified: false,
        verificationStatus: "pending",
        onboardingComplete: false
    });

    return user;
};

export const resendVerificationEmail = async (user) => {
    if (user) {
        await sendEmailVerification(user);
    }
};

export const logoutUser = () => {
    return signOut(auth);
};

export const subscribeToAuthChanges = (callback) => {
    return onAuthStateChanged(auth, callback);
};
