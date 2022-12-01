import React, { useContext, useState, useEffect } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updateEmail,
  updatePassword,
  updatePhoneNumber,
  sendPasswordResetEmail,
  setPersistence,
  browserSessionPersistence,
  deleteUser,
} from 'firebase/auth';
import app from '../config/firebase-config';

const AuthContext = React.createContext();
const auth = getAuth(app);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [role, setRole] = useState();
  const [loading, setLoading] = useState(true);

  function signUpHandler(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function signInHandler(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signOutHandler() {
    return signOut(auth);
  }

  function updateUserPhoto(imageUrl) {
    return updateProfile(auth.currentUser, {
      photoURL: imageUrl,
    });
  }

  function updateUserFullName(firstName, lastName) {
    return updateProfile(auth.currentUser, {
      displayName: firstName + ' ' + lastName,
    });
  }

  function updateUserEmail(email) {
    return updateEmail(auth.currentUser, email);
  }

  function updateUserPassword(password) {
    return updatePassword(auth.currentUser, password);
  }

  function updateUserPhoneNumber(phoneNumber) {
    return updatePhoneNumber(auth.currentUser, phoneNumber);
  }

  function forgotPassword(email) {
    return sendPasswordResetEmail(auth, email, {
      url: 'http://localhost:3000/login',
    });
  }

  function rememberSessionUser() {
    return setPersistence(auth, browserSessionPersistence);
  }

  function deleteUserHandler() {
    return deleteUser(auth.currentUser);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const token = await user?.getIdTokenResult(true);
      setRole(token?.claims.admin);
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    signUpHandler,
    signInHandler,
    signOutHandler,
    role,
    setRole,
    updateUserPhoto,
    updateUserFullName,
    updateUserEmail,
    updateUserPassword,
    updateUserPhoneNumber,
    forgotPassword,
    rememberSessionUser,
    deleteUserHandler,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
