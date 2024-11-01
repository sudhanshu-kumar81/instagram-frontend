import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Badge } from './ui/badge'
import { Link } from 'react-router-dom'
import { setAuthUser, setSuggestedUsers, setUserProfile } from '@/redux/authSlice'

const Post = ({ post }) => {
    // const [bookMark,setBookMark]=useState('Add to favorites');
    const bookMark=post?.author?.bookMark
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const { user,userProfile,suggestedUsers } = useSelector(store => store.auth);
    const { posts,selectedPost} = useSelector(store => store.post);
    const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
    const [postLike, setPostLike] = useState(post?.likes?.length);
    const [comment, setComment] = useState(post.comments);
    const [isFollower,setIsFollower]=useState(false);
    const dispatch = useDispatch();
    const followController=()=>{
        console.log("user is ",user);
        console.log("post is ",post);
        console.log("user?.following",user?.following)
        console.log("post?.author?._id",post?.author?._id)
        console.log("user?.following?.includes(post?.author?._id)",user?.following?.includes(post?.author?._id))
        setIsFollower(user?.following?.includes(post?.author?._id));
    }
    useEffect(()=>{
    console.log("is Foloower",isFollower);
    },[isFollower])
    const followUnfollowHandler=async (userId) => {
        console.log("welcome")
        console.log("userId is",userId);
        try {
          console.log(`http://localhost:8000/api/v1/user/followorunfollow/${userId}`)
            const res = await axios.post(`http://localhost:8000/api/v1/user/followorunfollow/${userId}`,{
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
               setIsFollower(true);
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
          setIsFollower(false);
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

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    }

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/${action}`, { withCredentials: true });
            console.log(res.data);
            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1;
                setPostLike(updatedLikes);
                setLiked(!liked);

                // apne post ko update krunga
                const updatedPostData = posts.map(p =>
                    p._id === post._id ? {
                        ...p,
                        likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                    } : p
                );
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const commentHandler = async () => {

        try {
            const res = await axios.post(`http://localhost:8000/api/v1/post/${post._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            console.log(res.data);
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);
                const newSelectedPost={
                    ...selectedPost,comments:updatedCommentData
                }

                const updatedPostData = posts.map(p =>
                    p._id === post._id ? { ...p, comments: updatedCommentData } : p
                );

                dispatch(setPosts(updatedPostData));
                dispatch(setSelectedPost(newSelectedPost));
                toast.success(res.data.message);
                setText("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${post?._id}`, { withCredentials: true })
            if (res.data.success) {
                const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id);
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.messsage);
        }
    }

    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/post/${post?._id}/bookmark`, {withCredentials:true});
            if(res.data.success){
                console.log("res.data in bookmark",res.data);
                console.log("user is ",user);
              
                const UserafterBookmark = { ...user, bookmarks: res.data.bookMark };
                console.log("UserafterBookmark",UserafterBookmark)
                dispatch(setAuthUser(UserafterBookmark))
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Link to={`/profile/${post.author?._id}`}>
                    <Avatar> <AvatarImage src={post.author?.profilePicture} alt="post_image" />
                    <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    </Link>
                    <div className='flex items-center gap-3'>


                    <Link to={`/profile/${post.author?._id}`}><h1>{post.author?.username}</h1></Link>
                       {user?._id === post?.author?._id &&  <Badge variant="secondary">Author</Badge>}
                    </div>
                </div>
                <Dialog>
                    <DialogTrigger asChild onClick={followController}>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center" >
                        {
                        post?.author?._id !== user?._id && <Button onClick={()=>followUnfollowHandler(post?.author?._id)} variant='ghost' className="cursor-pointer w-fit text-[#ED4956] font-bold">{isFollower?<>unfollow</>:<>follow</> }</Button>
                        }
                        
                        <Button variant='ghost' className="cursor-pointer w-fit" onClick={bookmarkHandler}>bookMark</Button>
                        {
                            user && user?._id === post?.author?._id && <Button onClick={deletePostHandler} variant='ghost' className="cursor-pointer w-fit">Delete</Button>
                        }
                    </DialogContent>
                </Dialog>
            </div>
            <img
                className='rounded-sm my-2 w-full aspect-square object-cover'
                src={post.image}
                alt="post_img"
            />

            <div className='flex items-center justify-between my-2'>
                <div className='flex items-center gap-3'>
                    {
                        liked ? <FaHeart onClick={likeOrDislikeHandler} size={'24'} className='cursor-pointer text-red-600' /> : <FaRegHeart onClick={likeOrDislikeHandler} size={'22px'} className='cursor-pointer hover:text-gray-600' />
                    }

                    <MessageCircle onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true);
                    }} className='cursor-pointer hover:text-gray-600' />
                    <Send className='cursor-pointer hover:text-gray-600' />
                </div>
                <Bookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-600' />
            </div>
            <span className='font-medium block mb-2'>{postLike} likes</span>
            <p>
                <span className='font-medium mr-2'>{post.author?.username}</span>
                {post.caption}
            </p>
            {
                comment?.length > 0 && (
                    <span onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true);
                    }} className='cursor-pointer text-sm text-gray-400'>View all {selectedPost?.comments?.length} comments</span>
                )
            }
            <CommentDialog open={open} setOpen={setOpen} />
            <div className='flex items-center justify-between'>
                <input
                    type="text"
                    placeholder='Add a comment...'
                    value={text}
                    onChange={changeEventHandler}
                    className='outline-none text-sm w-full'
                />
                {
                    text && <span onClick={commentHandler} className='text-[#3BADF8] cursor-pointer'>Post</span>
                }

            </div>
        </div>
    )
}

export default Post