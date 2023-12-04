import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { postApi, categoryApi } from '../../api/help/Entity';
import './changeCrPost.css'

const PostAct = (props) => {
    const inputFile = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuth = useSelector(state => state.auth.authorizationStatus);

    const [post, setPost] = useState({title: '', content: ''});
    const [checked, setChecked] = useState([]);
    const [checkList, setChecklist] = useState([])
    const [isCreate, setIsCreate] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);  
    const [fileName, setFileName] = useState('Choose file...'); 


    useEffect(() => {
        if (localStorage.getItem('isAuth') === 'true') {
            dispatch({type: "LOG_IN"});
        }
        else{
            dispatch({type: "LOG_OUT"});
        }
    },[]);

    useEffect(() => {
        async function fetchData() {
            const response = await categoryApi.getCategories();
            let result = [];

            response.data.values.data.forEach(item => {
                result.push(item.title);
            })
            setChecklist(result);
        }
        fetchData().then().catch(e => console.log(e));
        setPost(props.data)

    }, [props.data])

    const onButtonFileClick = () => {
        inputFile.current.click();
    };

    const handleFileSelect = (e) => {
        setFileName(e.target.files[0].name);
        setSelectedFile(e.target.files[0])
    }

    const addImage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", selectedFile);
        try {
            const response = await postApi.imgChange(post.id, formData);
            //console.log(response.data.values.imageUrl);
            setPost({...post, image: response.data.values.imageUrl});
            //changePostClick();
        }
        catch (err) {
            setErrMsg('Failed upload image')
        }
    }

    async function click() {
        try {
            await postApi.createPost(post)
                .then(response => {
                    setIsCreate(true);
                })
        } catch(e) {
            console.log(e);
            setErrMsg('Failed create new post')
        };
    }

    async function changePostClick() {
        try {
            console.log(post)
            await postApi.changePost(props.data.id, post)
                .then(response => {
                    setIsCreate(true);
                })
        } catch(e) {
            console.log(e);
            setErrMsg('Failed change post')
        };
    }

    function handleCheck(e) {
        let updatedList = [...checked];
        if (e.target.checked) {
            updatedList = [...checked, e.target.value];
        } else {
            updatedList.splice(checked.indexOf(e.target.value), 1);
        }
        setChecked(updatedList);
        let categoriesString = updatedList.join(", ");
        setPost({...post, categories: categoriesString});
    }
    if(isAuth) {
        if(isCreate) {
            console.log(post)
            return (
                <Navigate to={'/posts?page=1'}/>
            );
        }
        return (
            <div>
                <div className={'create_container'}>
                    <div className={'create_wrapper'}>
                        <h1 className={'create_head'}>Data for post</h1>
                        <div className='inptPolya'>
                            <div className='mgr'><h3 className='forPolya'>Title</h3><input
                                type={'text'}
                                className={'create_title'}
                                onChange={e => setPost({...post, title: e.target.value})}
                                placeholder={'Title of your post'}
                                value={post ? post.title : ''}
                            />
                            <h3 className='forPolya'>Picture</h3><input
                            type="file"
                            onChange={handleFileSelect}
                            style={{display: 'none'}}
                            ref={inputFile}
                        /> <div className='chs'><button className='file_create' onClick={onButtonFileClick}>Search</button> 
                            <h3 className='fl_name'>{fileName}</h3>
                            <button className='upldImg' onClick={addImage}>Upload</button></div>
                          </div>
                                                     
                            <div className={'category_create'}><h3 className='forPolya'>Categories</h3>
                                {checkList.map((item, index) => (
                                    <div className={'radio_block'} key={index}>
                                        <div className={'radio_block_v'}>
                                            <input className={'round_radio'} value={item} type="checkbox" onChange={handleCheck} />
                                            <label className={'custom_radio'}>{item}</label>
                                        </div>
                                        
                                    </div>
                                ))}
                            </div>
                            <div> <h3 className='forPolya'>Content</h3><textarea
                                name={'content'}
                                className={'create_content'}
                                cols={30}
                                rows={10}
                                onChange={e => setPost({...post, content: e.target.value})}
                                placeholder={'Content of your post'}
                                value={post ? post.content : ''}
                            />
                                </div> 
                        </div>
                        {errMsg && <p>{errMsg}</p>}
                        {props.data ? <button onClick={changePostClick} className={'create_btn'}>Change</button> : <button onClick={click} className={'create_btn'}>Create</button>}
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div>
            <div className={'create_container'}>
                <div className={'create_wrapper'}>
                    <h1 className={'create_head'}>You need to log in to create a post</h1>
                </div>
            </div>
        </div>
    );
}
export default PostAct;