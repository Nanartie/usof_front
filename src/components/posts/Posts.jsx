import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchTwentyPosts, select, selectTwentyPosts, selectAllPostsPages } from '../../api/help/postSlice';
import moment from 'moment';
import PostLikes from './PostLikes';
import PostComm from './PostComm';
import PostCateg from './PostCateg';
import jwt_decode from "jwt-decode";
import './Posts.css';

const Pages = ({ totalPages }) => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(<li key={i}><a className='pages' href={`/posts/?page=${i}`}>{i}</a></li>)
    }
    return pages;
  }

const Posts = () => {
    let userInfo;
    if (localStorage.getItem('token')) {
        userInfo = jwt_decode(localStorage.getItem('token'));
    }
    const navigate = useNavigate();
    const { search } = useLocation();
    const page = search.split('=');
    const dispatch = useDispatch();
    const style = useSelector((state) => state.style);
    //const [style, setStyle] = useState(localStorage.getItem('style'));
    console.log(style);

    async function handleEdit() {
        try {
            navigate(`/create-post`);
        }
        catch (err) {
            navigate('/500');
        }
    }

    useEffect(() => {
        if (page[0] !== '?page') {
            navigate('/not-found');
        }
        dispatch(fetchTwentyPosts(page[1]));
    }, [dispatch, page]);
    const posts = useSelector((state) => state.posts.twentyPosts);
    const totalPages = useSelector((state) => state.posts.allPostPages);

       useEffect(() => {
        const elements = document.querySelectorAll('.post-author, .post-title-text, .posts-block, .posts-block, .container-posts, .post-publish-date, .in, .new_post_btn')
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

    return (
        <div className="posts-block">
            <div className='container-posts'>
            {userInfo ? <button className='new_post_btn' onClick={handleEdit}>New Post</button> : <></>}
            
                <ul className="ul-posts">
                
                    {posts && posts.map((post) => {
                        const normalFormat = moment(post.pubDate, moment.defaultFormat).toDate();
                        const formatedDate = moment(normalFormat).format('MM-DD-YYYY, h:mm a');
                        return (
                            <li className="li-posts" key={post.id}>
                                <div className="post-card">
                                    <div className='post-author-date-block'>
                                        <a className="post-title-text" href={`/posts/${post.id}`}>{post.title}</a>
                                        <div className='avtor'>
                                        <h3 className='in'>by</h3> <a href={`/users/${post.authId}`} className="post-author">{post.author}</a>
                                        <h3>,</h3><p className='post-publish-date'>{formatedDate}</p>
                                        </div>
                                        
                                    </div>
                                    <div className='post-desc'>
                                        <p className="post-content">{post.content.length < 30 ? post.content 
                                        : <>
                                        {post.content.slice(0, 30)} 
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
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div>
                <ul className="none inline">
                    <Pages totalPages={totalPages} />
                </ul>
            </div>
        </div>
    );
}

export default Posts;