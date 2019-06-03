/* global Stripe */
import { auth, db , functions} from '../firebase'

export const LOGIN_USER = 'login_user'
export const LOGOUT_USER = 'logout_user'

// export function loginUser(){
//   return dispatch => {
//     return auth.onAuthStateChanged(user => {
//       if (user) {
//         return db.collection('users').doc(user.uid).get()
//         .then(userDoc => {
//           if(userDoc.exists){
//             return dispatch({
//               type: LOGIN_USER,
//               payload: userDoc.data()
//             })
//           } else {
//             return db.collection('users').doc(user.uid).set({
//               displayName: user.displayName,
//               email: user.email,
//               uid: user.uid,
//               photoURL: user.photoURL,
//               emailVerified: user.emailVerified
//             })
//             .then(userDoc => {
//               return dispatch({
//                 type: LOGIN_USER,
//                 payload: userDoc.data()
//               })
//             })
//           }
//         })
//       } else {
//         return dispatch({
//           type: LOGOUT_USER
//         })
//       }
//     })
//   }
// }

export function getProducer(){
  return dispatch => {
    return db.collection('producers').doc('i0XoUnRHd1UxAiwpFh6G').get()
    .then(doc => {
      return dispatch({
        type: LOGIN_USER,
        payload: doc.data()
      })
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

export function addPayoutCard(user, token){
  return dispatch => {
    console.log(token)
    console.log(user)
    return functions.httpsCallable('addPayoutCard')({ user: user, token: token.id })
    .then(res => {
      console.log(res)
    })
  }
}

export function addBankAccount(user, token){
  return dispatch => {
    console.log(token)
    return functions.httpsCallable('addBankAccount')({ user: user, token: token.id })
    .then(res => {
      console.log(res)
    })
  }
}
