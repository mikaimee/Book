import { userActions } from "./userReducer";

export const logout = () => (dispatch) => {
    dispatch(userActions.resetUserInfo())
    localStorage.removeItem('account')
}