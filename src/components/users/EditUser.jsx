import { userApi } from '../../api/help/Entity';
import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';

const USERNAME_PATTERN = /^[A-z][A-z0-9-_]{3,23}$/;
const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const FULL_NAME_PATTERN = /^[A-z][A-z0-9-_]{3,45}$/;

const EditUser = () => {
    const errRef = useRef();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('autorized'));
    const [errMsg, setErrMsg] = useState('');
    const [changedLogin, setChangedLogin] = useState('');
    const [validChangedLogin, setValidChangedLogin] = useState(false);
    const [changedFullName, setChangedFullName] = useState('');
    const [validChangedFullName, setValidChangedFullName] = useState(false);
    const [changedEmail, setChangedEmail] = useState('');
    const [validChangedEmail, setValidChangedEmail] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [image, setImage] = useState('');
    const [isLoading, setLoading] = useState(false);

    const setHidden = () => {
        setTimeout(() => setErrMsg(''), 5000);
    }

    const UpdateUserData = async (e) => {
        e.preventDefault();

        const isLoginValid = USERNAME_PATTERN.test(changedLogin);
        const isFullNameValid = FULL_NAME_PATTERN.test(changedFullName);
        const isEmailValid = EMAIL_PATTERN.test(changedEmail);

        if (!isLoginValid || !isFullNameValid || !isEmailValid) {
            setErrMsg('Not correct data');
            setHidden();
            return;
        }

        try{
            setLoading(true);
            const response = await userApi.updateUserById(user.userId, {login: changedLogin, email: changedEmail, full_name: changedFullName});
            localStorage.setItem('autorized', JSON.stringify({accessToken: user.accessToken, role: user.role, user: changedLogin, userId: user.userId}))
            setLoading(false);
            navigate(-1);
        }
        catch(err) {
            setLoading(false);
            if(err?.response.data.status === 409){
                setErrMsg('Login or email already exist');
                setHidden();
            }
            else if(err?.response.data.status === 404){
                navigate('/404');
            }
            else{
                navigate('/500')
            }
        }
    }

    const getUserInfo = async () => {
        try {
            const response = await userApi.getUserById(user.userId);
            setChangedLogin(response.data.values[0].login);
            setChangedFullName(response.data.values[0].full_name);
            setChangedEmail(response.data.values[0].email);
        }
        catch (e) {
            if(e?.response.data.status === 404){
                navigate('/404');
            }
            else{
                navigate('/500');
            }
        }
    }

    useEffect(() => {
        getUserInfo();
    }, []);

    const uploadImage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("avatar", selectedFile);

        try {
            const response = await userApi.updateAvatar(selectedFile);
            setImage(response.data.values.path);
            navigate('/posts/?page=1');
        }
        catch (err) {
            setErrMsg('Error during upload an image')
        }
    }

    const handleImageSelect = (e) => {
        setSelectedFile(e.target.files[0])
    }
    return(
        <> 
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>   
      <div className="create-post  change-prof">
          <h1>Profile edit</h1>
          <div className='create-post-forms'>
              <form onSubmit={UpdateUserData}>
                  
              <label htmlFor="username">Login</label>
            <input
                type="text"
                id="username"
                value={changedLogin}
                onChange={(e) => setChangedLogin(e.target.value)}
            />
            <label htmlFor="fullname">Full name</label>
            <input
                type="text"
                id="fullname"
                value={changedFullName}
                onChange={(e) => setChangedFullName(e.target.value)}
            />
            <label htmlFor="email">Email</label>
            <input
                type="text"
                id="email"
                value={changedEmail}
                onChange={(e) => setChangedEmail(e.target.value)}
            />
            <button type="submit">Save changes</button>
        </form>
        <form onSubmit={uploadImage}>
            <label htmlFor="avatar">Profile picture</label>
            <input
                type="file"
                id="avatar"
                onChange={handleImageSelect}
                accept="image/jpeg,image/png,image/jpg"
            />
            <button type="submit">Upload picture</button>
        </form>
          </div>
      </div>
      </> 
      )
  }
  
  export default EditUser;