import { useState } from "react";
import { authAp } from "../../api/auth/Authorization";
import { Link } from "react-router-dom";
import './registration.css';

function Register() {
    const [user, setUser] = useState({});
    const [error, setError] = useState('');
    const [validForm, setValidForm] = useState(false);
    const [succeess, setSucceess] = useState('');

    const regex = {
        USER_REGEX: /^[A-z][A-z0-9-_]{3,19}$/,
        PWD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/,
        EMAIL_REGEX: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        FULLNAME_REGEX: /^[a-zA-Z]{4,48}$/
    };

    const handleChange = (e, field) => {
        const newValue = e.target.value;
        setUser({ ...user, [field]: newValue });
        validateField(field, newValue);
    };

    const validateField = (field, value) => {
        switch (field) {
            case 'login':
                setValidForm(regex.USER_REGEX.test(value) && validForm);
                break;
            case 'pass':
            case 'confirmPass':
                setValidForm(regex.PWD_REGEX.test(value) && user.pass === user.confirmPass && validForm);
                break;
            case 'email':
                setValidForm(regex.EMAIL_REGEX.test(value) && validForm);
                break;
            case 'fullName':
                setValidForm(regex.FULLNAME_REGEX.test(value) && validForm);
                break;
            default:
                break;
        }
    };

    async function handleRegister() {
        try {
            const { login, pass: password, confirmPass: confirm_password, fullName, email } = user;
            const response = await authAp.register({login, password, confirm_password, fullName, email});
            setError('');
            setSucceess('Confirmation send on your email');
        } catch (err) {
            console.log(err);
            setError('ERROR: ' + err.response.data.error);
        }
    }

    return (
        <div className="reg_form_div">
            <div className='auth_form_div'>
                <h1 className="signup_font">Sign up</h1>
                <div className="error_div">{error}</div>
                <div className="form_div_registr_col">
                    <div className="first_col"><input
                        className={'auth_input'}
                        type={"text"}
                        onChange={(e) => handleChange(e, 'login')}
                        placeholder={'Login'}
                        size={25}
                    />
                    <input
                        className={'auth_input'}
                        type={"text"}
                        onChange={(e) => handleChange(e, 'fullName')}
                        placeholder={'Full Name'}
                        size={25}
                    />
                    <input
                        className={'auth_input'}
                        type={"text"}
                        onChange={(e) => handleChange(e, 'email')}
                        placeholder={'Email'}
                        size={25}
                    />
                    </div>
                    <div className="first_col">
                    <input
                        className={'auth_input'}
                        type={"password"}
                        onChange={(e) => handleChange(e, 'pass')}
                        placeholder={'Password'}
                        size={25}
                    />
                    <input
                        className={'auth_input'}
                        type={"password"}
                        onChange={(e) => handleChange(e, 'confirmPass')}
                        placeholder={'Confirm password'}
                        size={25}
                    />
                    {console.log(validateField)}
                    <button className='auth_btn' onClick={handleRegister} disabled={!validateField}>Register</button></div>
                    </div>
                <br />
                <Link to={'/login'} className="login_reg_link">Login</Link>
                <div className="success_div">{succeess}</div>
               
            </div>
        </div>
    );
}

export default Register;