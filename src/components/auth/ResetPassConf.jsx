import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authAp } from "../../api/auth/Authorization";
import './resetPass.css';

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%_]).{8,24}$/;
const RESETPASS_URL = `/api/auth/password-reset/`;

const ResetPasswordWT = () => {
    const errRef = useRef();
    const { confirm_token } = useParams();
    const navigate = useNavigate();

    const [pwd, setPwd] = useState('');
    const [matchPwd, setMatchPwd] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setErrMsg('');
    }, [pwd, matchPwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!PWD_REGEX.test(pwd) || pwd !== matchPwd) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            setLoading(true);
            const response = await authAp.resetPassConf(confirm_token, {password: pwd}, {confirm_password: matchPwd});
            setSuccess(true);
            setTimeout(() => navigate('/login'), 5000);
        } catch (err) {
            handleErrorResponse(err);
        } finally {
            setLoading(false);
        }
    };

    const handleErrorResponse = (err) => {
        if (!err?.response) {
            setErrMsg('Oops... We have troubles with server:(');
        } else {
            setErrMsg('I think you too late. Try again from start');
        }
        errRef.current.focus();
    };

    return (
        <>
            {success ? (
                <div className="reset_pass_conf">
                    <div className="form_conf_ress_div">
                        <h1 className="title_reset_f">Your password reseted</h1>
                        <p className="inf_confirm_reset">You can Log In right now</p>
                    </div>
                </div>
            ) : (
                <div className="reset_pass_conf">
                    <div className="form_conf_ress_div">
                        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                        <h1 className="title_reset_f">Password reset</h1>
                        <form onSubmit={handleSubmit} className="form_div_for_inpt">
                            <label className="form_label_conf" htmlFor="password">
                                New password:
                            </label><br/>
                            <input
                                className="form__field"
                                type="password"
                                id="password"
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                required
                                aria-invalid={PWD_REGEX.test(pwd) ? "false" : "true"}
                                aria-describedby="pwdnote"
                            /><br/>
                            <label className="form_label_conf" htmlFor="confirm_pwd">
                                Confirm:
                            </label><br/>
                            <input
                                className="form__field"
                                type="password"
                                id="confirm_pwd"
                                onChange={(e) => setMatchPwd(e.target.value)}
                                value={matchPwd}
                                required
                                aria-invalid={pwd === matchPwd ? "false" : "true"}
                                aria-describedby="confirmnote"
                            />
                            <br/>
                            <button disabled={!PWD_REGEX.test(pwd) || pwd !== matchPwd} className="but_for_confirm">
                                {isLoading ? 'Loading...' : 'Reset password'}
                            </button>
                        </form>
                        </div>
                </div>
            )}
        </>
    );
};

export default ResetPasswordWT;