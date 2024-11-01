// useGetALLfollowingUser
import { setFollowingUser, setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


const useGetALLfollowingUser = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchFollowingUser = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/v1/user/following', { withCredentials: true });
                if (res.data.success) { 
                    dispatch(setFollowingUser(res.data.users));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchFollowingUser();
    }, []);
};
export default useGetALLfollowingUser;