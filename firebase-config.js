// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    updateDoc,
    query, 
    orderBy, 
    limit,
    where,
    serverTimestamp,
    onSnapshot,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAo5dRFvcJ_fFrstzlC__UsCmrgk9T4xgU",
    authDomain: "chomba-plumbing.firebaseapp.com",
    projectId: "chomba-plumbing",
    storageBucket: "chomba-plumbing.firebasestorage.app",
    messagingSenderId: "263853667671",
    appId: "1:263853667671:web:9f43e84c1aa097125c7a12"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/nqyylkmd/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "projects";

export { 
    db,
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    updateDoc,
    query, 
    orderBy, 
    limit,
    where,
    serverTimestamp,
    onSnapshot,
    getDoc,
    setDoc,
    CLOUDINARY_URL,
    CLOUDINARY_UPLOAD_PRESET
};

console.log('🔥 Firebase initialized successfully!');