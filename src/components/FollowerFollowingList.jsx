
import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const FollowerFollowingList = ({list,userProfileId,setFollowerOrUnfollowList}) => {
    const navigate = useNavigate()
    const [newUsers,setNewUsers]=useState(list);
    const [open, setOpen] = useState(true);
    const dispatch = useDispatch();
    const changeHandler = (e) => {
        e.preventDefault();
        // setText(e.target.value);
        const text=e.target.value;
        console.log(text);
        const filteredUsers = list.filter((user) =>
            user.username.toLowerCase().includes(text.trim().toLowerCase())
        );

        console.log(filteredUsers);
        setNewUsers(filteredUsers) // for debugging
        console.log(text);

    }

    return (
        <Dialog open={open}>
            <DialogContent className="max-h-[600px] overflow-y-auto" onInteractOutside={() => { setOpen(false),setFollowerOrUnfollowList(''), navigate(`/profile/${userProfileId}`) }}>
                <DialogHeader className='text-center font-semibold'>searched user</DialogHeader>
                <input
                    type='text'
                    onChange={(e) => changeHandler(e)}
                    className='w-full p-2 text-lg border rounded'
                    placeholder='Search for users...'
                />

                {
                    newUsers?.length > 0 ? (
                        <>
                            {
                                newUsers.map((user) => {
                                    return (
                                        <div key={user?._id} className='flex items-center justify-between my-5'>
                                            <div className='flex items-center gap-2'>
                                                <Link to={`/profile/${user?._id}`}  onClick={() => setOpen(false)}>
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
                                        </div>
                                    )
                                })
                            }</>
                    ) : (
                        <div>No matched user</div>
                    )
                }

            </DialogContent>
        </Dialog>
    )
}

export default FollowerFollowingList
