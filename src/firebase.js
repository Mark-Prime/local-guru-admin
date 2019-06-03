import firebase from 'firebase/app';
import '@firebase/auth'
import '@firebase/firestore'
import '@firebase/functions'

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCqI7KAjxmqY-SRw6xA9ICTb9w_rem-k9w",
  authDomain: "local-guru-aeac9.firebaseapp.com",
  databaseURL: "https://local-guru-aeac9.firebaseio.com",
  projectId: "local-guru-aeac9",
  storageBucket: "local-guru-aeac9.appspot.com",
  messagingSenderId: "337567241539"
};

firebase.initializeApp(config);
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const fbProvider = new firebase.auth.FacebookAuthProvider();
export const db = firebase.firestore();
export const auth = firebase.auth();
export const functions = firebase.functions();
