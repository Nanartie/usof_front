import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { categoryApi } from "../../api/help/Entity";
import PostForCateg from "./PostForCateg";
import './category.css';

function Category() {
    const [categories, setCategories] = useState();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const id = pathname.split('/')[2];
    
    const [postCateg, setPostCateg] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await categoryApi.getCategoryById(id);
                console.log(response.data.values);
                setCategories(response.data.values);
            } catch (e) {
                console.log(e);
                navigate('/500');
            }
        }
        fetchData().catch(e => console.log(e));
    }, []);
    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await categoryApi.getPostsByCategory(id);
            const postUs = response.data.values.data;
           // setCountComments(comments.length);
           setPostCateg(postUs);
        } catch (e) {
            console.error(e);
        }
    }
    if (!postCateg || !categories) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className='container'>
                <div className='wrapper'>
                    
                        <div key={categories[0].id}>
                            <div className={'category_wrapper'}>
                                <h2 className="categ_title">~{categories[0].title}~ category</h2>
                                <div className="category_desc">{categories[0].description}</div>
                            </div>
                            <div className="posts-csteg">
                                <h3 className="post_for_cat">Posts from category</h3>
                            {postCateg.length > 0 ? postCateg.map(post =>
                            <PostForCateg 
                                key={post.id} 
                                title={post.title}
                                owner={post.owner}
                                content={post.content.length < 15 ? post.content : `${post.content.slice(0, 15)}...|`}
                                date={post.date}
                                category={post.categories}
                                rating={post.rating}
                                id={post.id}
                            />
                        ) : <div style={{fontSize: '32px'}}>Posts not found</div>}
                            </div>
                        </div>
                    
                </div>
            </div>
        </div>
    );
}

export default Category;