import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { categoryApi } from "../../api/help/Entity";
import PostForCateg from "./PostForCateg";
import './categorySt.css';

function CategoryForSt(data) {
    const [categories, setCategories] = useState();
    const [countP, setCountP] = useState(0);
    const [posts, setPosts] = useState();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await categoryApi.getCategoryById(data.data.id);
                const postsRes = await categoryApi.getPostsByCategory(data.data.id);
                setPosts(postsRes.data.values.data);
                setCategories(response.data.values);
            } catch (e) {
                console.log(e);
                navigate('/500');
            }
        }
        fetchData().catch(e => console.log(e));
    }, []);
    if (!categories && !posts) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className='container_for_one'>
                <div className='wrapper_for_one'>
                        <div key={categories[0].id}>
                            <div className={'category_wrapper'}>
                                <a href={`/category/${categories[0].id}`} className="categ_title">~{categories[0].title}~ category</a>
                                <div className="category_desc">{categories[0].description}</div>
                                <div className="count_posts">Count posts: {posts.length}</div>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryForSt;