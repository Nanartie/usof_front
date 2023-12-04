import { useEffect, useState } from "react";
import like from '../../assets/likes/like.png';
import dislike from '../../assets/likes/dis.png';
import { useNavigate } from "react-router-dom";
import { postApi } from '../../api/help/Entity';
import jwt_decode from "jwt-decode";
import { useSelector } from 'react-redux';
import './postLike.css';

const PostLikes = ({ postId }) => {
    const [isLike, setIsLike] = useState(false);
    const [isDislike, setIsDislike] = useState(false);
    const [countLikes, setCountLikes] = useState(0);
    const [countDislikes, setCountDislikes] = useState(0);
    const navigate = useNavigate();
    const style = useSelector((state) => state.style);
    let userInfo;
    if (localStorage.getItem('token')) {
        userInfo = jwt_decode(localStorage.getItem('token'));
    }

    useEffect(() => {
        fetchLikesDislikes();
    }, []);
    useEffect(() => {
        const elements = document.querySelectorAll('.likes-dislikes-block, .cont-w, .likes, .like-create-delete, .dislikes, .dislike-create-delete, .lT')
        
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

    const fetchLikesDislikes = async () => {
        try {
            const response = await postApi.getPostLikes(postId);
            const likesDislikes = response.data.values.likes;
            let likesCount = 0;
            let dislikesCount = 0;

            likesDislikes.forEach((likeDislike) => {
                if (likeDislike.user_id === userInfo.usId) {
                    if (likeDislike.dislike) {
                        setIsDislike(true);
                        dislikesCount++;
                    } else {
                        setIsLike(true);
                        likesCount++;
                    }
                } else {
                    if (likeDislike.dislike) {
                        dislikesCount++;
                    } else {
                        likesCount++;
                    }
                }
            });

            setCountLikes(likesCount);
            setCountDislikes(dislikesCount);
        } catch (e) {
            console.error(e);
        }
    }

    const createDeleteLike = async () => {
        try {
            if(!userInfo) {
                console.error("You unauthorized");
                return;
            }
            if (isLike) {
                await postApi.deletePostLike(postId);
                setIsLike(false);
                setCountLikes(countLikes - 1);
            } else {
                if (isDislike) {
                    await postApi.deletePostDisLike(postId);
                    setIsDislike(false);
                    setCountDislikes(countDislikes - 1);
                }
                await postApi.setPostLike(postId);
                setIsLike(true);
                setCountLikes(countLikes + 1);
               
            }
        } catch (e) {
            if(e?.response.data.status === 401){
                navigate('/login');
            } else {
                navigate('/500');
            }
        }
    }

    const createDeleteDislike = async () => {
        if(!userInfo) {
            console.error("You unauthorized");
            return;
        }
        try {
            if (isDislike) {
                await postApi.deletePostDisLike(postId);
                setIsDislike(false);
                setCountDislikes(countDislikes - 1);
            } else {
                if (isLike) {
                    await postApi.deletePostLike(postId);
                    setIsLike(false);
                    setCountLikes(countLikes - 1);
                }
                await postApi.setPostDisLike(postId);
                setIsDislike(true);
                setCountDislikes(countDislikes + 1);
                
            }
        } catch (e) {
            if(e?.response.data.status === 401){
                navigate('/login');
            } else {
                navigate('/500');
            }
        }
    }
    return (
        <>
            
                    <div className="likes-dislikes-block">
                        <div className="cont-w">
                            <div className='likes'>
                            <button onClick={createDeleteLike} className="like-create-delete">{<img className="img-like-com" src={like} alt='nolike' height={30} width={30} />}</button>
                            <p className="lT">{countLikes}</p></div>
                            <div className="dislikes"><button onClick={createDeleteDislike} className="dislike-create-delete">{<img className="img-dislike-com" src={dislike} alt='nodislike' height={30} width={30} />}</button>
                            <p className="lT">{countDislikes}</p></div>
                        </div>
                    </div>
        </>
    )
}

export default PostLikes;