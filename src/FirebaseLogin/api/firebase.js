import {initializeApp} from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  getUser,
  signOut,
} from 'firebase/auth';
import {getDatabase} from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyC-Wva6vKXxyogpv72M8OcjHiUvProChlc',
  authDomain: 'muslimsound-6f7be.firebaseapp.com',
  databaseURL: 'https://muslimsound-6f7be.firebaseio.com',
  projectId: 'muslimsound-6f7be',
  storageBucket: 'muslimsound-6f7be.appspot.com',
  messagingSenderId: '495839957421',
  appId: '1:495839957421:web:76be9c90f7adaa80eed124',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export {
  auth,
  getUser,
  database,
  getAuth,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
};
