import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import Header from "../head/Header";
import PostAct from "./PostAct";
import { postApi } from "../../api/help/Entity";

function PostPage() {
    const { pathname } = useLocation();
    const id = pathname.split('/');
    const dispatch = useDispatch();
    const { postId } = useParams();
    const [ post, setPost ] = useState({});

    useEffect(() => {
        if (id[2]) {
            async function fetchData() {
                const postResponse = await postApi.getPostById(id[2]);
                const resPost = postResponse.data.values.posts[0];
                //console.log(postResponse.data.values.posts)
                //console.log(resPost)
                const psts = {id: resPost.id, author: resPost.authId, title: resPost.title, content: resPost.content, status: resPost.status, image: resPost.image, categories: resPost.categories};
               // console.log(psts)
                setPost(psts);
            }
            fetchData().then().catch(e => console.log(e));
        }
    }, [id[2]]);

    /*useEffect(() => {
        console.log(post);
    }, [post]);*/
    if (!post) {
        return (
            <div>
               Loading...
            </div>
        );
    }

    return (
        <div>
            <PostAct data={id[2] ? post : null} />
        </div>
    );
}

export default PostPage;