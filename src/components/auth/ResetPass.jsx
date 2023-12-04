import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authAp } from "../../api/auth/Authorization";
import './reset.css';

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const RESETPASS_URL = '/api/auth/reset';

const ResetPassword = () => {
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const [succeess, setSucceess] = useState('');

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    const resetPassword = async (e) =>{
        e.preventDefault();
        const v = EMAIL_REGEX.test(email);
        if (!v) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            setLoading(true);
            await authAp.resetPass(email);
            setSucceess('Confirmation send on your email');
            setSuccess(true);
        } catch(err) {
            handleErrorResponse(err);
        } finally {
            setLoading(false);
        }
    };

    const handleErrorResponse = (err) => {
        if (!err?.response) {
            setErrMsg('Oops... We have troubles with server:(');
            //.response.data.values.message === `User with email - ${email} does not exist`
        } else if (err) {
            console.log(err);
            setErrMsg('You shure that\'s your email? We don\'t see anyone');
        } else {
            setErrMsg('Try againe later, we are working');
        }
        errRef.current.focus();
    };

    return (
        <>
            {success ? (
                <div className="reset_pass">
                    <div className="form_res_pass_div">
                        <h1 className="res_title_pass">Reset your password</h1>
                        <p className="reset_msg_sucssess">Link for you was already send to email</p>
                    </div>
                </div>
            ) : (
                <div className="reset_pass">
                    <div className="form_res_pass_div">
                        <p ref={errRef} className='error_msg' aria-live="assertive">{errMsg}</p>
                        <h1 className="res_title_pass">Reset password for</h1>
                        <form onSubmit={resetPassword}>
                            <label className="form_label" htmlFor="email">
                                Email:
                            </label>
                            <input
                                className="email_reset_field"
                                type="text"
                                id="email"
                                autoComplete="off"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                                aria-invalid={validEmail ? "false" : "true"}
                                aria-describedby="uidnote"
                                onFocus={() => setEmailFocus(true)}
                                onBlur={() => setEmailFocus(false)}
                                placeholder={'Email'}
                            /><br/>
                            <button className="but_for_reset">Reset password</button>
                        </form>
                        <div>{succeess}</div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ResetPassword;