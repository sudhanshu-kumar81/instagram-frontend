import { createSlice } from "@reduxjs/toolkit";
const  initialState={
    onlineUsers:[],
    messages:[],
}
const chatSlice = createSlice({
    name:"chat",
    initialState,
    reducers:{
        // actions
        setOnlineUsers:(state,action) => {
            state.onlineUsers = action.payload;
        },
        setMessages:(state,action) => {
            state.messages = action.payload;
        },
        resetChat:(state)=>{return initialState}
    }
});
export const {setOnlineUsers, setMessages,resetChat} = chatSlice.actions;
export default chatSlice.reducer;