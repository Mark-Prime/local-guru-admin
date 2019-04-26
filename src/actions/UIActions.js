export const TOGGLE_TOAST = 'toggle_toast';

export function toggleToast(message){
  return dispatch =>
    dispatch({
      type: TOGGLE_TOAST,
      payload: message
    })
}
