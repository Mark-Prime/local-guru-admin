import { auth, db , functions, storage } from '../firebase'

export const LOGIN_USER = 'login_user'
export const LOGOUT_USER = 'logout_user'

export function loginUser(){
  return dispatch => {
    return auth.onAuthStateChanged(user => {
      if (user) {
        return db.collection('producers').doc(user.uid).get()
        .then(userDoc => {
          if(userDoc.exists){
            return dispatch({
              type: LOGIN_USER,
              payload: userDoc.data()
            })
          } else {
            return db.collection('producers').doc(user.uid).set({
              displayName: user.displayName,
              email: user.email,
              uid: user.uid,
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

export function getProducer(){
  return dispatch => {
    return auth.onAuthStateChanged(user => {
      if(user){
        return db.collection('producers').doc(user.uid).get()
        .then(doc => {
          return dispatch({
            type: LOGIN_USER,
            payload: doc.data()
          })
        })
      } else {
        return dispatch({
          type: LOGIN_USER,
        })
      }
    })
  }
}

export function logoutUser(){
  return dispatch => {
    console.log('logging out')
    auth.signOut()
    // .then(() => {
    //   return dispatch({
    //     type: LOGOUT_USER
    //   })
    // })
    // .catch(err => {
    //   console.error(err)
    // })
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

export function editProfile(user, bio, photo){
  return dispatch => {
    console.log(photo)
    return storage.ref().child(`producers/${photo.name}`).put(photo)
    .then(snapshot => {
      return snapshot.ref.getDownloadURL()
    })
    .then(photoURL => {
      return db.collection('producers').doc(user).set({
        photoURL: photoURL,
        bio: bio
      }, { merge: true })
    })
    .catch(err => console.log(err))
  }
}

export function createAccount(name, email, password, address, token){
  return dispatch => {
    return auth.createUserWithEmailAndPassword(email, password)
    .then(res => {
      const { uid } = res.user;

      return db.collection('producers').doc(uid).set({
        displayName: name,
        uid: uid,
        address: address,
        token: token.token
      }, { merge: true })
    })
    .catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(`ERROR (${errorCode}): ${errorMessage}`)
    })
  }
}
