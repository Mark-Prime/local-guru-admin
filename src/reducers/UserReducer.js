import { LOGIN_USER, LOGOUT_USER } from '../actions/UserActions';

export default function( state = { authenticated: false }, action) {
  switch(action.type){
    case LOGIN_USER:
      return { authenticated: true, ...action.payload };
    case LOGOUT_USER:
      return { authenticated: false }
    default:
      return state;
  }
}
