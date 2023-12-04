import React, { useEffect } from "react";
import { Routes, Route } from 'react-router-dom';

import Layout from './components/start/Layout';
import Main from "./components/start/Main";
import Register from './components/auth/Registration';
import Login from './components/auth/Login';
import ConfirmEmail from './components/auth/Confirmation';
import ResetPassword from './components/auth/ResetPass';
import ResetPasswordAfter from './components/auth/ResetPassConf';
import About from "./components/start/About";
import Posts from './components/posts/Posts';
import Post from './components/posts/Post';
import Users from './components/users/Users';
import User from './components/users/User';
import Categories from './components/categories/Categories';
import Category from './components/categories/Category';

import NewPost from './components/posts/NewPost';
import ChangeProfile from './components/users/EditUser';
import EditProfPic from './components/users/EditUser';
import EditPost from './components/posts/PostAct';
//import NotFound from './components/errors/NotFound';
import ServerError from './components/errors/ServerError';

import RolePath from './components/auth/RolePath';
//import Admin from './Admin';

function App() {
    useEffect(() => {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
    }, []);
    if (!localStorage.getItem('autorized')) {
        localStorage.setItem(
        'autorized',
        JSON.stringify({ currentUser: 'guest' })
        );
        }
    return (
        <Routes>
            <Route path='/' element={<Layout />}>
            <Route path='/' element={<Main />} />
            <Route path="registration" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="active/:token" element={<ConfirmEmail />} />
            <Route path='reset' element={<ResetPassword />} />
            <Route path='password-reset/:confirm_token' element={<ResetPasswordAfter />} />
            <Route path='about' element={<About/>} />
            <Route path='posts' element={<Posts />} />
            <Route path='users/:userId' element={<User />} />
            <Route path='posts/:postId' element={<Post/>} />
            <Route path='users' element={<Users/>} />
            <Route path='users/:user_id/edit' element={<ChangeProfile/>} />
            <Route element={<RolePath permittedRoles='admin,user' />} >
                <Route path='categories' element={<Categories />} />
                <Route path='create-post' element={<NewPost />} />
                <Route path='change-profile' element={<ChangeProfile />} />
                <Route path='change-avatar' element={<EditProfPic/>}/>
                <Route path='update-post/:postId' element={<NewPost />} />
                <Route path='category/:id' element={<Category/>} />
            </Route>
            <Route path='500' element={<ServerError />} />
            </Route>
            {/*<Route path='admin' element={<Admin />} />*/}
            {/*<Route path="*" element={<NotFound />} />*/}
            
        </Routes>
  );
}

export default App;