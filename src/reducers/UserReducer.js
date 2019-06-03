import { LOGIN_USER } from '../actions/UserActions';

export default function( state = {
    uid: 'i0XoUnRHd1UxAiwpFh6G',
    accountNumber: 'acct_1EdfAVJHuIN1AFnH',
    name: { first: 'Jermaine', last: 'Davis' },
    photo: 'https://lh3.googleusercontent.com/-6HnwtUWlsTE/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdjXuBJGE8ppEnD0dIE2tPS5yoSHA/s96-c-mo/photo.jpg'
  }, action) {
  switch(action.type){
    case LOGIN_USER:
      return action.payload;
    default:
      return state;
  }
}
