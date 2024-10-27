import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
    name:'realTimeNotification',
    initialState:{
        likeNotification:[], // [1,2,3]
    },
    reducers:{
        setLikeNotification:(state,action)=>{
            if(action.payload.type === 'like'){
                console.log("like ",action.payload);
                state.likeNotification.push(action.payload);
            }else if(action.payload.type === 'dislike'){
                console.log("dislike ",action.payload);
                state.likeNotification = state.likeNotification.filter((item)=> item.userId !== action.payload.userId);
            }
        }
    }
});
export const {setLikeNotification} = rtnSlice.actions;
export default rtnSlice.reducer;