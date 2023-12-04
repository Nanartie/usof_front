import { useEffect, useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import verifyAuth from "../../reducers/verifyAuth";
import { authAp } from "../../api/auth/Authorization";
import { useAuth } from '../../reducers/authReduc';
import './login.css';

const { logout } = authAp.logout;

function Login() {
    
    const [credentials, setCredentials] = useState({ login: "", password: "" });
    const [error, setError] = useState("");
    const { auth, setAuth } = useAuth();
    const isAuth = auth.authorizationStatus === "LOG_IN";
    const navigate = useNavigate();
    const style = useSelector((state) => state.style);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            verifyAuth().then(res => {
                if(res) {
                    setAuth({ authorizationStatus: "LOG_IN" });
                    localStorage.setItem('isAuth', 'true');
                }
            })
        }
    }, [setAuth]);

    useEffect(() => {
        const elements = document.querySelectorAll('.auth_form, .div_for_log, .sigin_tit, .err_div_login, .forPolyaLog, .btn_login, .reg_link')
        const elWitClass = document.querySelectorAll('input[type="text"]:not([class]), input[type="password"]:not([class])');
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
                element.classList.add('sat');
            });
        }
    }, [style]);

    async function loginUser() {
        try {
            setError('');
            const { login, password } = credentials;
            console.log(login);
            console.log(password);
            const response = await authAp.login({ login, password });
            console.log(response.data);
            localStorage.setItem('token', response.data.values.token);
            setAuth({ authorizationStatus: "LOG_IN" });
            localStorage.setItem('isAuth', 'true');
            navigate('/posts?page=1', { replace: true });
        } catch (err) {
            console.log(err.response.data.error)
            setError(err.response.data.error);
        }
    };

    /*if (isAuth) {
        return (<Navigate to={"/posts?page=1"} />);
    }*/

    return (
        <div>
            <div className="auth_form">
                <div className="div_for_log">
                    <h2 className="sigin_tit">Sign in</h2>
                    <div className="err_div_login">{error}</div>                    
                    <div className="inp_div"><h3 className='forPolyaLog'>Login</h3><input
                        type="text"
                        placeholder="Login"
                        onChange={e => setCredentials({ ...credentials, login: e.target.value })}
                    /></div>
                   
                    <div className="inp_div"> <h3 className='forPolyaLog'>Password</h3><input
                        type="password"
                        placeholder="Password"
                        onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                    /></div>
                    <button onClick={loginUser} className="btn_login">Login</button>
                    <p>Still don't have an account?</p>
                    <Link to="/registration" className="reg_link">Register</Link>
                    <p>Forgot password?</p>
                    <Link to="/reset" className="reg_link">Remind password</Link>
                    
                </div>
            </div>
        </div>
    );
}

export default Login;