import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, setDoc } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously, signOut } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, setDoc, signInWithPopup, signInAnonymously, signOut };
