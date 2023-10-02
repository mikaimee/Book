import { createSlice } from "@reduxjs/toolkit";

const userInitialState = { userInfo: null }

const userSlice = createSlice({
    name: "user",
    initialState: userInitialState,
    reducers: {
        setUserInfo(state, action) {
            state.userInfo = action.payload;
        },
        resetUserInfo(state, action) {
            state.userInfo = null
        },
        updateUserLibrary(state, action) {
            state.userInfo = {
                ...state.userInfo,
                library: [...state.userInfo.library, action.payload.updatedLibraryData]
            }
        }
    },
})

const userActions = userSlice.actions;
const userReducer = userSlice.reducer;

export { userActions, userReducer }