import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { commentApi } from '../../api/help/Entity';
import like from '../../assets/likes/like.png';
import dislike from '../../assets/likes/dis.png';
import { useSelector } from 'react-redux';
import './commLike.css';

const CommLike = ({ comentId }) => {
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
        const elements = document.querySelectorAll('.comm_likes_dis, .coment_like_block, .coment_like_button, .coment_dislike_block, .coment_dislike_button')
        
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
            const response = await commentApi.getCommentsLike(comentId);
            const likesDislikes = response.data.values.likes;
            console.log(response.data.values.likes);
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
                await commentApi.deleteCommentLike(comentId);
                setIsLike(false);
                setCountLikes(countLikes - 1);
            } else {
                if (isDislike) {
                    await commentApi.deleteCommentDisLike(comentId);
                    setIsDislike(false);
                    setCountDislikes(countDislikes - 1);
                }
                await commentApi.setCommentLike(comentId);
                setIsLike(true);
                setCountLikes(countLikes + 1);
               
            }
        } catch (e) {
            if(e?.response?.status === 401){
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
                await commentApi.deleteCommentDisLike(comentId);
                setIsDislike(false);
                setCountDislikes(countDislikes - 1);
            } else {
                if (isLike) {
                    await commentApi.deleteCommentLike(comentId);
                    setIsLike(false);
                    setCountLikes(countLikes - 1);
                }
                await commentApi.setCommentDisLike(comentId);
                setIsDislike(true);
                setCountDislikes(countDislikes + 1);
                
            }
        } catch (e) {
            if(e?.response?.status === 401){
                navigate('/login');
            } else {
                navigate('/500');
            }
        }
    }
    return (
        <>
            <ul>
                <li className="comm_likes_dis">
                    <div className="coment_like_block">
                        <button onClick={createDeleteLike} className="coment_like_button">{<img className="img-like-com" src={like} alt='nolike' height={30} width={30} />}
                        </button>
                        <p>{countLikes}</p>
                    </div>
                    <div className="coment_dislike_block">
                        <button onClick={createDeleteDislike} className="coment_dislike_button">{<img className="img-dislike-com" src={dislike} alt='nodislike' height={30} width={30} />}
                            
                        </button>
                        <p>{countDislikes}</p>
                    </div>
                </li>
            </ul>
        </>
    )
}

export default CommLike;