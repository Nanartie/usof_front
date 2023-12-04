import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { postApi } from '../../api/help/Entity';
import PostLikes from '../posts/PostLikes';
import PostCateg from '../posts/PostCateg';
import moment from "moment";
import './category.css';

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

const PostForCateg = ({ id, idOwner, isUser }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const usIsNow = pathname.split('/');
    const [isDialogOpen, setDialogOpen] = useState(false);
    const isThisAvt = usIsNow[2] == idOwner;
    //console.log(isThisAvt);

    const [post, setPost] = useState(null);

    const handleDelete = async () => {
        setDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        setDialogOpen(false);
        try {
            const response = await postApi.deletePost(id); 
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
        <div className="post_cat">
            <div className='post-author-date-block_cat'>
                <a className="post-title-text_cat" href={`/posts/${post.id}`}>{post.title}</a>
                <div className='avtor_cat'>
                    <h3 className='in_cat'>by</h3> <a href={`/users/${post.authId}`} className="post-author">{post.author}</a>
                    <h3>,</h3><p className='post-publish-date_cat'>{formatedDate}</p>
                </div>
                                        
            </div>
            <div className='post-desc_cat'>
                <p className="post-content_cat">{post.content.length < 100 ? post.content 
                : <>
                {post.content.slice(0, 100)} 
                <a href={`/posts/${post.id}`} target={`_blank`}> ...</a>
                </>}</p>
            </div>
            <div className='bot-post_cat'>
                <div className="post-likes_cat">
                    <div className="flex-likes_cat">
                        <PostLikes postId={post.id} />
                        <a href={`/posts/${post.id}`}></a>
                </div>                                        
                </div>
                <PostCateg postId={post.id} />
            </div>
            {/*console.log("usIsNow " + usIsNow[2] + ", idOwner " + idOwner)*/}
            {isThisAvt ?
                <div className='avtor_btns_cat'>
                    <button className='redact_cat' onClick={handleEdit}>Edit</button>
                    <button className='delB_cat' onClick={handleDelete}>Delete</button>
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

export default PostForCateg;