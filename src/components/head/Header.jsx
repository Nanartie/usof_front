import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { authAp } from "../../api/auth/Authorization";
import jwt_decode from "jwt-decode";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import $api from "../../api";
import '../head/head.css';
import { changeStyle } from "../../api/help/actions";

const NavigationPanel = () => {
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuth = useSelector(state => state.auth.authorizationStatus);
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState('');
    const [style, setStyle] = useState(localStorage.getItem('style'));
    

    async function handleLogout() {
        if (isAuth) {
            try {
                await authAp.logout(localStorage.getItem('token'));
                dispatch({ type: "LOG_OUT" });
                localStorage.setItem('isAuth', 'false');
                localStorage.removeItem('token');
                localStorage.removeItem('avatar');
                delete $api.defaults.headers.common['authorization'];
                navigate('/login');
            } catch (error) {
                console.log(error);
            }
        }
    }

    async function satStyle() {
        dispatch(changeStyle('sat'));

            localStorage.setItem('style', 'sat');
            setStyle('sat');
            let btn = document.getElementsByClassName("logout_btn");
            for(let i=0; i<btn.length; i++) {
                btn[i].classList.add('sat');
            }
            let btn_s = document.getElementsByClassName("logout_btn_s");
            for(let i=0; i<btn_s.length; i++) {
                btn_s[i].classList.add('sat');
            }
            let hed = document.getElementsByClassName("header");
            hed[0].classList.add('sat');
            let logo = document.getElementsByClassName("logo");
            logo[0].classList.add('sat');
            let lgn = document.getElementsByClassName("loginN");
            if(lgn && lgn[0]) lgn[0].classList.add('sat');
            let login_line = document.getElementsByClassName("login_line");
            if(login_line && login_line[0]) login_line[0].classList.add('sat');
            let lin = document.getElementsByClassName("head-lin");
            for(let i=0; i<lin.length; i++) {
                lin[i].classList.add('sat');
            }
           // window.location.reload();

    }

    async function normStyle() {
        dispatch(changeStyle('normal'));

                localStorage.setItem('style', 'normal');
                setStyle('normal');
                let hed = document.getElementsByClassName('sat');
                hed = Array.from(hed);
                
                for(let i=0; i<hed.length; i++) {
                    hed[i].classList.remove('sat');
                }
                //window.location.reload();
    }
    useEffect(() => {
        if (style === 'sat') {
            satStyle();
        } else if (style === 'normal') {
            normStyle();
        }
    }, [style]);

    useEffect(() => {
        const authStatus = localStorage.getItem('isAuth') === 'true' ? "LOG_IN" : "LOG_OUT";
        dispatch({ type: authStatus });
    }, [dispatch]);

    if (isAuth) {
        if(localStorage.getItem('token') && localStorage.getItem('token').trim() !== '') {
            const user = jwt_decode(localStorage.getItem('token'));
            const login = localStorage.getItem('login');

            return (
                <div className="header">
                    <div className="logo">
                    <a href="/" className="logoT">N-Gsof</a>
                    </div>
                    <div className="stls">
                        <button className='logout_btn_s' onClick={normStyle}>Normal</button>
                        <button className='logout_btn_s' onClick={satStyle}>Frendly</button>
                    </div>
                    <div className={'head_list'}>
                    <ul>
                        <li><a href={'/posts?page=1'}  className="head-lin">Posts</a></li>
                        <li><a href={'/users'}  className="head-lin">Users</a></li>
                        <li><a href={'/categories'}  className="head-lin">Categories</a></li>
                        <li><a href={'/about'}  className="head-lin">About</a></li>
                    </ul>
                </div>
                <div className="prof">
                <div><Link  className="loginN" to={`/users/${user.usId}`}>
                        {user.login}
                    </Link></div>
                    <button className='logout_btn' onClick={handleLogout}>Logout</button>
                    
                    </div>
                </div>
            );
        } else {
            return (
                <div className="header">
                    <div className="logo">
                        <a href="/" className="logoT">N-Gsof</a>
                    </div>
                    <div className="stls">
                        <button className='logout_btn_s' onClick={normStyle}>Normal</button>
                        <button className='logout_btn_s' onClick={satStyle}>Frendly</button>
                    </div>
                    <div className={'head_list'}>
                    <ul>
                        <li><a href={'/posts?page=1'}  className="head-lin">Posts</a></li>
                        <li><a href={'/users?page=1'}  className="head-lin">Users</a></li>
                        <li><a href={'/about'}  className="head-lin">About</a></li>
                    </ul>
                </div>
                    <a className='login_line' href="/login">Login</a>
                    
                </div>
            );
        }
    }

    return <Link className='login_link' to='/login'>Log In</Link>;
}

export default NavigationPanel;