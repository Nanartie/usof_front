import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { postApi, userApi } from '../../api/help/Entity';
import PostLikes from './PostLikes';
import PostComm from './PostComm';
import PostCateg from './PostCateg';
import moment from "moment";
import { useSelector } from 'react-redux';
import './post.css';

const url = 'http://localhost:3000/api';

const Post = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const id = pathname.split('/')[2];

    const [post, setPost] = useState(null);
    const [authorr, setAutthorr] = useState(null);
    const style = useSelector((state) => state.style);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await postApi.getPostById(id);
                setPost(response.data.values.posts[0]);
                const authResponse = await userApi.getUserById(response.data.values.posts[0].authId);
                setAutthorr(authResponse.data.values[0]);
            } catch (error) {
                console.error('Failed to fetch post:', error);
                navigate('/404');
            }
        };

        fetchPost();
    }, [id, navigate]);
    useEffect(() => {
        const elements = document.querySelectorAll('.body_wrap, .post_wrap_onl, .pst_title, .post_user_inf, .by_f, .user_login, .by_f_coma, .da_ted, .content_post');
console.log(elements);
        if (style.style === 'sat') {
            elements.forEach((element) => {
                element.classList.add('sat');
            });            
        } else if (style.style === 'normal') {
            elements.forEach((element) => {
                element.classList.remove('sat');
            });
        }
    }, [style]);

    if (!post || !authorr) {
        return <div>Loading...</div>;
    }
    const normalFormat = moment(post.pubDate, moment.defaultFormat).toDate();
    const formatedDate = moment(normalFormat).format('MM-DD-YYYY, h:mm a');

    return (
        <div className='body_wrap'>
            <div className="post_wrap_onl">
                <h2 className='pst_title'>{post.title}</h2>
                
                <div className='post_user_inf'>
                    <div className='fle_inf'><h2 className='by_f'>by</h2><img className='prof_pic_user' src={`http://localhost:3001/api/avatars/${authorr.profPic}`} alt="Prof pic" />
                   <a className='user_login' href={`/users/${post.authId}`}>{post.author}</a></div><h2 className='by_f_coma'>,</h2>
                   <div className='da_ted'>{formatedDate}</div>
                </div>
                <div className='postContent'>
                    {post.image ? <img className='postPic' src={`${url}/postim/${post.image}`} alt={`${post.image}`} /> : <></>}
                    <p className='content_post'>{post.content}</p>
                </div>
                <div className='class_likes_n'>
                    <div className='likes_div'> <PostLikes postId={post.id} /></div>
                    <div className='categrs_div'> <PostCateg postId={post.id} /></div>
                </div>
            </div>
            <div className='comm_post_div'>
            <PostComm postId={post.id} />
            </div>
        </div>
    );
};

export default Post;