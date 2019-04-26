import { auth, db } from '../Firebase.js';

export const LOGIN_USER = 'login_user';
export const LOGOUT_USER = 'logout_user';

export function loginUser(){
  return dispatch => {
    return auth.onAuthStateChanged(user => {
      if (user) {
        return db.collection('users').doc(user.uid).get()
        .then(userDoc => {
          if(userDoc.exists){
            return dispatch({
              type: LOGIN_USER,
              payload: userDoc.data()
            })
          } else {
            return db.collection('users').doc(user.uid).set({
              displayName: user.displayName,
              email: user.email,
              uid: user.uid,
              photoURL: user.photoURL,
              emailVerified: user.emailVerified
            })
            .then(userDoc => {
              return dispatch({
                type: LOGIN_USER,
                payload: userDoc.data()
              })
            })
          }
        })
      } else {
        return dispatch({
          type: LOGOUT_USER
        })
      }
    })
  }
}

export function logoutUser(){
  return dispatch => {
    auth.signOut()
    .then(() => {
      return dispatch({
        type: LOGOUT_USER
      })
    })
    .catch(err => {
      console.error(err)
    })
  }
}
