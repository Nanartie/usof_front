import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { categoryApi } from "../../api/help/Entity";
import Header from "../head/Header";
import CategoryForSt from "./CategoryForSt";
import './categorySt.css';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [val, setVal] = useState({});
    const [newC, setNewC] = useState('');
    const [error, setError] = useState('');
    const [refresh, setRefresh] = useState(false);

    const navigate = useNavigate();

    async function fetchData() {
        try {
            const response = await categoryApi.getCategories();
            setCategories(response.data.values.data);
        } catch (e) {
            console.log(e);
            navigate('/500');
        }
    }

    async function fetchSort() {
        try {
            const response = await categoryApi.getSortedCategories();
            const sortedCat = response.data.values.data;
            setCategories(sortedCat);
        } catch (e) {
            console.log(e);
            navigate('/500');
        }
    }

    useEffect(() => {
        if(refresh) {
            fetchSort();
        } else {
            fetchData().catch(e => console.log(e));
        }
    }, [categories]);

    function handleSort() {
        if(refresh) {
            setRefresh(false);
        } else {
            setRefresh(true);
        }
    }

    async function click() {
            try {
                setError('');
                setNewC('');
                await categoryApi.createCategory(val);
                setVal({});
                setNewC('Category aded');
                setRefresh(!refresh);
            } catch (e) {
                setError('ERROR: ' + e.response.data.values.message);
            }
    }
    if (!categories) {
        return <div> Loading...</div>
    }

    return (
        <div>
            <div className={'container'}>
                <div className={'wrapper'}>
                <div className={'create_category'}>
                        <h1 className={'create_head'}>Create Category</h1>
                        <div className='errr_cr_cat'>{error}</div>
                        <input
                            type={'text'}
                            className={'create_title_ctg'}
                            onChange={e => setVal({...val, title: e.target.value})}
                            placeholder={'Title'}
                            maxLength="20"
                            value={!val.title ? '' : val.title}
                        />
                        <textarea
                            name={'content'}
                            className={'create_ctg_content'}
                            cols={30}
                            rows={10}
                            maxLength="40"
                            onChange={e => setVal({...val, description: e.target.value})}
                            placeholder={'Description'}
                            value={val.description || ''}
                        />
                        <button className={'create_btn_ctg'} onClick={click}>Create</button>
                        <div className='success_mes'>{newC}</div>
                    </div>
                    <div className="filter"><button className="sort_categ" onClick={handleSort}>Sort</button></div>
                    {categories.map(item =>
                        <CategoryForSt data={item} key={item.id}/>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Categories;