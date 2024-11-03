import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setAuthUser, setSuggestedUsers, setUserProfile } from '@/redux/authSlice';
import { toast } from 'sonner';
import axios from 'axios';

const SuggestedUsers = () => {
    const { user,suggestedUsers } = useSelector(store => store.auth);
    const dispatch=useDispatch()
    const followHandler=async(userProfile)=>{
        console.log(userProfile);
            try {
              console.log(`http://localhost:8000/api/v1/user/followorunfollow/${userProfile._id}`)
                const res = await axios.post(`http://localhost:8000/api/v1/user/followorunfollow/${userProfile._id}`,{
                  // , followKrneWala,jiskoFollowKrunga
                    
                },{withCredentials: true});
                if (res.data.success) {
                  let updatedUser=user;
                  let updatedUserProfile=userProfile;
                   let newSuggestedUser=suggestedUsers;
                  console.log("user is ",user);
                  if(res.data.message==='followed successfully'){
                   
                    console.log(" res.data.jiskoFollowKrunga", res.data.jiskoFollowKrunga);
                    updatedUser = { 
                      ...updatedUser,
                      following: [...updatedUser.following, res.data.jiskoFollowKrunga] 
                  }
                  updatedUserProfile = { 
                    ...updatedUserProfile, 
                    followers: [...updatedUserProfile.followers, res.data.followKrneWala] 
                }
                   newSuggestedUser = suggestedUsers.filter(p => p._id !== res.data.jiskoFollowKrunga);
                // console.log("follow")
                //   console.log("user is ",updatedUser);
                //   console.log("updatedUserProfile",updatedUserProfile);
                  
                }
                else{
                  console.log("res.data.jiskoFollowKrunga ",res.data.jiskoFollowKrunga);
                     updatedUser = { 
                    ...updatedUser, 
                    following: updatedUser.following.filter(id => id !== res.data.jiskoFollowKrunga) 
                }
                updatedUserProfile = { 
                  ...updatedUserProfile, 
                  followers: updatedUserProfile.followers.filter(id=>id!=res.data.followKrneWala)
              }
              newSuggestedUser = [...suggestedUsers, userProfile];
            }
                console.log("unfollow")
                console.log("user is ",updatedUser);
                console.log("updatedUserProfile",updatedUserProfile);
                dispatch(setAuthUser(updatedUser))
                dispatch(setUserProfile(updatedUserProfile))
                console.log("hi fine")
                dispatch(setSuggestedUsers(newSuggestedUser))     
                toast.success(res.data.message); 
                  }
             
                   
                }
            catch (error) {
                console.log(error);
                toast.error(error.response.data.message);
            }
        


    }
    return (
        <div className='my-10'>
            <div className='flex items-center justify-between text-sm'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                <span className='font-medium cursor-pointer'>See All</span>
            </div>
            {
                suggestedUsers.map((user) => {
                    return (
                     <div key={user?._id} className='flex items-center justify-between my-5'>
                            <div className='flex items-center gap-2'>
                                <Link to={`/profile/${user?._id}`}>
                                    <Avatar>
                                        <AvatarImage src={user?.profilePicture} alt="post_image" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
                                    <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>
                                </div>
                            </div>
                            <span className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]' onClick={()=>followHandler(user)}>Follow</span>
                        </div>
                    )
                })
            }

        </div>
    )
}

export default SuggestedUsers