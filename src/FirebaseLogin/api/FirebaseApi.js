import {
  auth,
  database,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  getAuth,
  getUser,
  signOut,
} from './firebase';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  onValue,
  get,
} from 'firebase/database';

const tracksRef = ref(database, 'tracks');

async function signUpWithEmailAndPassword(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    if (user) {
      AsyncStorage.setItem('user', user.uid);
    }
    console.log('User created:', user.email);
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

async function signInWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    await AsyncStorage.setItem('user', user.uid);
    console.log('User signed in:', user.email);
    return user;
  } catch (error) {
    console.error('Error signing in user:', error);
  }
}

async function forgotPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent to:', email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
}

async function getUserFromId(uid) {
  const authInstance = getAuth();
  if (authInstance.currentUser && authInstance.currentUser.uid === uid) {
    return authInstance.currentUser;
  } else {
    // You can add additional logic to handle the case where the user's data is not available
    return null;
  }
}

async function signOutUser() {
  try {
    await signOut(auth);
    await AsyncStorage.removeItem('user');
    console.log('User signed out');
  } catch (error) {
    console.error('Error signing out user:', error);
  }
}

async function getMusic(type, language) {
  return new Promise(async resolve => {
    try {
      const tracksRef = ref(getDatabase(), 'tracks');
      const musicQuery = query(
        tracksRef,
        orderByChild('category'),
        equalTo(type),
      );

      const snapshot = await get(musicQuery);
      let myData = snapshot.val();
      if (snapshot.val().constructor !== Array) {
        myData = Object.keys(snapshot.val()).map(key => {
          return snapshot.val()[key];
        });
      }
      let filtered = myData.filter(function (el) {
        return el != null && el.language === language;
      });
      resolve(filtered);
    } catch (error) {
      console.error('Error querying data:', error);
      resolve(null);
    }
  });
}

export {
  getMusic,
  signUpWithEmailAndPassword,
  signInWithEmail,
  forgotPassword,
  getUserFromId,
  signOutUser, // Add the signOutUser function to the exports
};
