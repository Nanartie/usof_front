import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
//import comentsWhite from '../assets/images/coments/commentWhite.png'
import { postApi, commentApi, userApi } from '../../api/help/Entity';
import jwt_decode from "jwt-decode";
import moment from "moment";
import CommLike from '../comments/CommLike';
import './commsPost.css';

const PostComm = ({ postId }) => {
    const navigate = useNavigate();
    const [countComments, setCountComments] = useState(0);
    const [addComent, setAddComent] = useState("");
    const [comments, setComments] = useState([]);
    const style = useSelector((state) => state.style);
    let userInfo;
    if (localStorage.getItem('token')) {
        userInfo = jwt_decode(localStorage.getItem('token'));
    }
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

    const openConfirm = (id) => {
        setIsConfirmOpen(true);
        setCommentToDelete(id);
    }

    const closeConfirm = () => {
        setIsConfirmOpen(false);
        setCommentToDelete(null);
    }

    const deleteComent = async () => {
        try {
            const resDel = await commentApi.deleteComm(commentToDelete);
            fetchComments(); // Refresh comments after deletion
            closeConfirm();
        } catch (e) {
            navigate('/500');
        }
    }

    const createComent = async () => {
        try {
            const response = await commentApi.createComments(postId, JSON.stringify({content: addComent }));
            setAddComent("");
            fetchComments();
        }
        catch (err) {
            navigate('/500');
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (addComent) {
            createComent();
            setAddComent("");
            fetchComments();
        }
    }

    useEffect(() => {
        fetchComments();
    }, []);
    useEffect(() => {
        const elements = document.querySelectorAll('.create_coment_form, .add_coment_btn, .comm_block, .count_comm, .for_post, .comm_li, .coment-card, .coment-author-date-block, .coment_author_info, .coment_author, .coment_date, .likes_content_div, .comment_content, .dlete_comm, .confirm_dialog_ff, .yes, .cancel, .lT');
console.log(elements);
        const elWitClass = document.querySelectorAll('textarea[type="text"]:not([class])');
        if (style.style === 'sat') {
            elements.forEach((element) => {
                element.classList.add('sat');
            });
            elWitClass.forEach((element) => {
                element.classList.add('sat');
            });
        } else if (style.style === 'normal') {
            elements.forEach((element) => {
                element.classList.remove('sat');
            });
            elWitClass.forEach((element) => {
                element.classList.remove('sat');
            });
        }
    }, [style]);

    const fetchComments = async () => {
        try {
            const response = await postApi.getComments(postId);
            const comments = response.data.values;
            
            const commentsWithAuthor = await Promise.all(comments.map(async (comment) => {
                const authorResponse = await userApi.getUserById(comment.autorId);
                return { ...comment, author: authorResponse.data.values[0] };
            }));
            setCountComments(commentsWithAuthor.length);
            setComments(commentsWithAuthor);
        } catch (e) {
            console.error(e);
        }
    }
    if (!comments) {
        return <div>Loading...</div>;
    }
    

    return (
        <>
            <form onSubmit={handleSubmit} className="create_coment_form">
                
                <textarea
                    type='text'
                    id="add-coment"
                    rows='1'
                    onChange={(e) => setAddComent(e.target.value)}
                    value={addComent}
                    maxLength={100}
                    minLength={2}
                    placeholder={'Enter content of comment'}
                    required
                /><br/>
                <button className="add_coment_btn">New comment</button>
            </form>
            <div className="comm_block">
            <p className="count_comm">Comments for this post - {countComments}</p>
            <ul className="for_post">
                {comments.length > 0 ? comments.map((coment) => {
                    const normalFormat = moment(coment.published_at, 'DD.MM.YYYY HH:mm:ss').toDate();
                    const formatedDate = moment(normalFormat).format('MM-DD-YYYY, h:mm a');
                    return (
                        <>
                            <li className="comm_li">
                                <div className="coment-card">
                                    <div className='coment-author-date-block'>
                                        <div className="coment_author_info">
                                            <img className='prof_pic_user_comm' src={`http://localhost:3001/api/avatars/${coment.author.profPic}`} alt="Prof pic" />
                                            <a href={`/users/${coment.autorId}`} className="coment_author">{coment.authorLog}</a>
                                            <p className='coment_date'>{formatedDate}</p>
                                        </div>
                                        
                                    </div>
                                    <div className="likes_content_div">
                                    <p className="comment_content">{`${coment.content}`}</p>
                                        <CommLike comentId={coment.id} />
                                    </div>
                                    {userInfo.usId === coment.autorId ? <button className="dlete_comm" onClick={() => openConfirm(coment.id)}>Delete</button> : <></>}
                                    {userInfo.usId === coment.autorId && coment.id === commentToDelete && isConfirmOpen && (
                                        <div className="confirm_dialog_ff">
                                            <p>Are you sure delete this comment&`~`</p>
                                            <button onClick={deleteComent} className="yes">Yes</button>
                                            <button onClick={closeConfirm} className="cancel">Cancel</button>
                                        </div>
                                    )}
                                </div>
                            </li>
                        </>
                    )
                }) : <></>}
            </ul>
               
            </div>
        </>
    )
}

export default PostComm;