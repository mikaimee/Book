import { userActions } from "./userReducer";

export const logout = () => (dispatch, getState) => {
    const { userInfo } = getState().user
    if(userInfo && userInfo.library) {
        localStorage.setItem('library', JSON.stringify(userInfo.library))
    }
    
    dispatch(userActions.resetUserInfo())
    localStorage.removeItem('account')
}