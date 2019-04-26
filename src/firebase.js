import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

var config = { /* COPY THE ACTUAL CONFIG FROM FIREBASE CONSOLE */
  apiKey: "AIzaSyCqI7KAjxmqY-SRw6xA9ICTb9w_rem-k9w",
  authDomain: "local-guru-aeac9.firebaseapp.com",
  databaseURL: "https://local-guru-aeac9.firebaseio.com",
  projectId: "local-guru-aeac9",
  storageBucket: "local-guru-aeac9.appspot.com",
  messagingSenderId: "337567241539"
};
var fire = firebase.initializeApp(config);
export const auth = firebase.auth();
export const db = firebase.firestore();
export default fire;
