import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { postApi } from '../../api/help/Entity';
import PostLikes from './PostLikes';
import PostCateg from './PostCateg';
import moment from "moment";
import './postForProf.css';
import jwt_decode from "jwt-decode";

const ConfirmationDialog = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="confirmation-dialog">
            <p>Are you sure delete this post&`~`</p>
            <button className='yes' onClick={onConfirm}>Yes</button>
            <button className='cancel' onClick={onCancel}>Cancel</button>
        </div>
    );
};

const PostForProf = ({ id, idOwner, isUser }) => {
    let userInfo;
    if (localStorage.getItem('token')) {
        userInfo = jwt_decode(localStorage.getItem('token'));
    }
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const usIsNow = pathname.split('/');
    const [isDialogOpen, setDialogOpen] = useState(false);
    let isThisAvt = false;
    if (userInfo) {
        console.log(userInfo.usId);
        console.log(idOwner);
        isThisAvt = userInfo.usId == idOwner;
    }
    //console.log(isThisAvt);

    const [post, setPost] = useState(null);

    const handleDelete = async () => {
        setDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        setDialogOpen(false);
        try {
            const response = await postApi.deletePost(post.id); 
            window.location.reload();
        } catch (err) {
            navigate('/500');
        }
    };

    const handleCancelDelete = () => {
        setDialogOpen(false);
    };

    async function handleEdit() {
        try {
            navigate(`/update-post/${id}`, { state: { post } });
        }
        catch (err) {
            navigate('/500');
        }
    }

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await postApi.getPostById(id);
                setPost(response.data.values.posts[0]);
            } catch (error) {
                console.error('Failed to fetch post:', error);
                navigate('/404');
            }
        };

        fetchPost();
    }, [id, navigate]);

    if (!post) {
        return <div>Loading...</div>;
    }
    const normalFormat = moment(post.pubDate, moment.defaultFormat).toDate();
    const formatedDate = moment(normalFormat).format('MM-DD-YYYY, h:mm a');

    return (
        <div className="post">
            <div className='post-author-date-block'>
                <a className="post-title-text" href={`/posts/${post.id}`}>{post.title}</a>
                <div className='avtor'>
                    <h3 className='in'>by</h3> <a href={`/users/${post.authId}`} className="post-author">{post.author}</a>
                    <h3>,</h3><p className='post-publish-date'>{formatedDate}</p>
                </div>
                                        
            </div>
            <div className='post-desc'>
                <p className="post-content">{post.content.length < 100 ? post.content 
                : <>
                {post.content.slice(0, 100)} 
                <a href={`/posts/${post.id}`} target={`_blank`}> ...</a>
                </>}</p>
            </div>
            <div className='bot-post'>
                <div className="post-likes">
                    <div className="flex-likes">
                        <PostLikes postId={post.id} />
                        <a href={`/posts/${post.id}`}></a>
                </div>                                        
                </div>
                <PostCateg postId={post.id} />
            </div>
            {/*console.log("usIsNow " + usIsNow[2] + ", idOwner " + idOwner)*/}
            {isThisAvt ?
                <div className='avtor_btns'>
                    <button className='redact' onClick={handleEdit}>Edit</button>
                    <button className='delB' onClick={handleDelete}>Delete</button>
                </div>
            : <></>}
            <ConfirmationDialog
                isOpen={isDialogOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
};

export default PostForProf;