// useGetALLfollowingUser
import { setAllAvailableUser, setFollowingUser, setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


const useGetAllAvailableUser = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const AllAvailableUser = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/v1/user/AllAvailableUser', { withCredentials: true });
                if (res.data.success) { 
                    console.log("all user",res.data);
                    
                    dispatch(setAllAvailableUser(res.data.users));
                }
            } catch (error) {
                console.log(error);
            }
        }
        AllAvailableUser();
    }, []);
};
export default useGetAllAvailableUser;