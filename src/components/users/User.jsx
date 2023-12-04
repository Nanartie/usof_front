import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";
import {postApi, userApi} from "../../api/help/Entity";
import Header from "../head/Header";
import PostForProf from "../posts/PostForProf";
import { fetchPersonalPosts } from '../../api/help/postSlice';
import './user.css';

function UserProfile() {
    const inputFile = useRef(null);
    const dispatch = useDispatch();
    const { search, pathname } = useLocation();
    const userId = pathname.split('/');
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);
    const [userPosts, setUserPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [selectedImg, setSelectedImg] = useState(null);
    const [userAvatar, setUserAvatar] = useState('def.png');
    const [addPost, setAddPost] = useState("");
    const [fileName, setFileName] = useState('Choose file...'); 
    
    const postUs = useSelector(state => state.posts.postUs);
    const authStatus = useSelector(state => state.auth.authorizationStatus);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            setCurrentUser(jwt_decode(localStorage.getItem('token')));
        }
    }, [authStatus]);

    useEffect(() => {
        dispatch(fetchPersonalPosts({id: userId[2] }))
    }, []);

    useEffect(() => {
        fetchPosts();
    }, []);

    const onButtonFileClick = () => {
        inputFile.current.click();
    };

    const fetchPosts = async () => {
        try {
            const response = await userApi.getPostsByUser(userId[2]);
            const postUs = response.data.values.data;
           // setCountComments(comments.length);
            setUserPosts(postUs);
        } catch (e) {
            console.error(e);
        }
    }

    const handleImageCh  = (e) => {
        setFileName(e.target.files[0].name);
        setSelectedImg(e.target.files[0])
    }

    const uploadFile = useCallback(async () => {
        try {
            const formData = new FormData();
            formData.append('image', selectedImg);
            const response = await userApi.changeAvatar(userData.id, formData);
            setUserAvatar(response.data.values.imageUrl);
            localStorage.setItem('avatar', response.data.values.imageUrl);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }, [selectedImg]);

    useEffect(() => {
        async function fetchUserData() {
            try {
                setLoading(true);
                const userResponse = await userApi.getUserById(userId[2]);
                setUserData(userResponse.data.values[0]);
                setUserPosts(postUs);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
        fetchUserData();
    }, [userId[2]]);
    if(!postUs) {
        return (<div>Loading...</div>);
    } else {
        return (
            <div>
                <div className={'profile_container'}>
                    <div className={'profile_wrapper'}>
                        <div className={'profile_info'}>
                            <div className={'profile_ava'}>
                            {userData.profPic ? <img className="profPicUs" src={`http://localhost:3001/api/avatars/${userData.profPic}`} alt={`${userData.profilePicture}`}/> :  <img className="profPicUs" src={`http://localhost:3001/api/avatars/${userAvatar}`} alt={`${userAvatar}`}/> }
                            
                                {currentUser.usId === userData.id ?
                                    <div className="editProf"> 
                                        <a className="edit_user" href={`/users/${userData.id}/edit`}>Edit Profile</a>
                                        <div className={'select_file'}>
                                            <input accept={'image/*'} 
                                            type={"file"} 
                                            name={'avatar'} 
                                            onChange={handleImageCh}
                                            style={{display: 'none'}}
                                            ref={inputFile}/>
                                        </div>
                                        <div className='chs_s'><div className="chs_file"><button className='file_create_s' onClick={onButtonFileClick}>Search</button> 
                                        <h3 className='fl_name_s'>{fileName}</h3></div>
                                        <button className='upldImg_s' onClick={uploadFile}>Upload</button></div>
                                    </div>
                                    : ''}
                            </div>
                            <div className="prof_col">
                                <div className="first_inf">
                                    <div className={'login'}>Login: <span>{userData.login}</span> </div>
                                    <div className={'fullName'}>FullName: <span>{userData.fullName}</span></div>
                                </div>
                                <div className="second_inf">
                                    <div className={'email'}>Email: <span>{userData.email}</span></div>
                                    <div className={'Rating'}>Rating: <span>{userData.rating}</span></div>
                                </div>
                            </div>
                            <div className={'role'}>Role: <span>{userData.role}</span></div>
                        </div>
                        
                        
                    </div>
                    <div className="inf_posts">
                        <h1>User's posts</h1>
                        <div className={'posts_wrapper'}>
                            {postUs.length > 0 ? postUs.map(post =>
                                <PostForProf 
                                    
                                    id={post.id}
                                    idOwner={post.author}
                                    isUser={currentUser.id === userData.id}
                                />
                            ) : <div style={{fontSize: '32px'}}>Posts not found</div>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserProfile;