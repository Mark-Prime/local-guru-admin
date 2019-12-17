import { firebase } from "@firebase/app";
import "@firebase/auth";
import "@firebase/firestore";
import "@firebase/functions";
import "@firebase/storage";

// Initialize Firebase
const config = {
  apiKey: "AIzaSyCqI7KAjxmqY-SRw6xA9ICTb9w_rem-k9w",
  authDomain: "local-guru-aeac9.firebaseapp.com",
  databaseURL: "https://local-guru-aeac9.firebaseio.com",
  projectId: "local-guru-aeac9",
  storageBucket: "local-guru-aeac9.appspot.com",
  messagingSenderId: "337567241539",
  appId: "1:337567241539:web:0471950617695f8d"
};

export const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: "/",
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  tosUrl: "/terms",
  privacyPolicyUrl: "/privacy-policy",
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => {
      console.log("success!");
    }
  }
};

firebase.initializeApp(config);
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const fbProvider = new firebase.auth.FacebookAuthProvider();
export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
export const functions = firebase.functions();
