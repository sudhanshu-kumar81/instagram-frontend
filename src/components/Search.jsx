import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';
import { Link, useNavigate } from 'react-router-dom';

const Search = () => {
    const navigate = useNavigate()
    const [open, setOpen] = useState(true);
    // const [text, setText] = useState('');
    const { allAvailableUser } = useSelector(store => store.auth)
    const [newUsers, setNewUsers] = useState(allAvailableUser)

    const dispatch = useDispatch();
    const changeHandler = (e) => {
        e.preventDefault();
        // setText(e.target.value);
        const text=e.target.value;
        console.log(text);
        const filteredUsers = allAvailableUser.filter((user) =>
            user.username.toLowerCase().includes(text.trim().toLowerCase())
        );

        console.log(filteredUsers);
        setNewUsers(filteredUsers) // for debugging
        console.log(text);

    }
    // const HandleSearch = (e) => {
    //     e.preventDefault();
    //     const filteredUsers = allAvailableUser.filter((user) =>
    //         user.username.toLowerCase().includes(text.toLowerCase())
    //     );

    //     console.log(filteredUsers);
    //     setNewUsers(filteredUsers) // for debugging
    //     console.log(text);
    // }

    return (
        <Dialog open={open}>
            <DialogContent className="max-h-[600px] overflow-y-auto" onInteractOutside={() => { setOpen(false), navigate('/') }}>
                <DialogHeader className='text-center font-semibold'>searched product</DialogHeader>
                <input
                    type='text'
                    onChange={(e) => changeHandler(e)}
                    className='w-full p-2 text-lg border rounded'
                    placeholder='Search for users...'
                />

                {/* <button onClick={HandleSearch}>search</button> */}

                {
                    newUsers?.length > 0 ? (
                        <>
                            {
                                newUsers.map((user) => {
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

export default Search