import { createSlice } from "@reduxjs/toolkit";
const initialState={
    posts:[],
    selectedPost:null,
}
const postSlice = createSlice({
    name:'post',
    initialState,
    reducers:{
        //actions
        setPosts:(state,action) => {
            state.posts = action.payload;
        },
        setSelectedPost:(state,action) => {
            state.selectedPost = action.payload;
        },
        resetPost: (state) => { return initialState; }
    }
});
export const {setPosts, setSelectedPost,resetPost} = postSlice.actions;
export default postSlice.reducer;