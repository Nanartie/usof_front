import { useEffect, useState } from "react";
import { postApi } from '../../api/help/Entity';
import { useSelector } from 'react-redux';
import './postCateg.css';

const PostCateg = ({ postId }) => {
    const [categories, setCategories] = useState([]);
    const style = useSelector((state) => state.style);

    useEffect(() => {
        fetchCategories();
    }, []);
    useEffect(() => {
        const elements = document.querySelectorAll('.nn, .categories, .each-category, .ctgL')
        
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

    const fetchCategories = async () => {
        try {
            const response = await postApi.getCategories(postId);
            setCategories(response.data.values.categories);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
        <div className="nn">
            <ul className="categories">
                {categories.map((category) => {
                    return (
                        <li className='each-category' key={category[0].id}>
                            <a href={`/category/${category[0].id}`} className="ctgL">{category[0].title}</a>
                        </li>
                    )
                })}
            </ul>
            </div>
        </>
    )
}

export default PostCateg;