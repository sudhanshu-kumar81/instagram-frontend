import {createSlice} from "@reduxjs/toolkit"
const initialState={
    user:null,
    suggestedUsers:[],
    userProfile:null,
    selectedUser:null,
    followingUser:[],
    allAvailableUser:[],
}
const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        // actions
        setAuthUser:(state,action) => {
            state.user = action.payload;
        },
        setSuggestedUsers:(state,action) => {
            state.suggestedUsers = action.payload;
        },
        setUserProfile:(state,action) => {
            state.userProfile = action.payload;
        },
        setSelectedUser:(state,action) => {
            state.selectedUser = action.payload;
        },
        setFollowingUser:(state,action) => {
            state.followingUser = action.payload;
        },
        setAllAvailableUser:(state,action) => {
            state.allAvailableUser = action.payload;
        },
        resetAuth: (state) =>
        {
            return initialState;
        }
            
    }
});
export const {
    setAuthUser, 
    resetAuth,
    setSuggestedUsers, 
    setUserProfile,
    setSelectedUser,
    setFollowingUser,
    setAllAvailableUser
} = authSlice.actions;
export default authSlice.reducer;