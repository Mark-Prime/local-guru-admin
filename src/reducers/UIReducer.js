import { TOGGLE_TOAST } from '../actions/UIActions';

export default function( state = { showToast: false, toastText: '' }, action) {
  switch(action.type){

    case TOGGLE_TOAST:
      console.log({...state, showToast: !state.showToast, toastText: action.payload})
      return {...state, showToast: !state.showToast, toastText: action.payload};
    default:
      return state;
  }
}
