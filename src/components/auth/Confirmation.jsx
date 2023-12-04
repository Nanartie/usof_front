import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import $api from '../../api/index'; 
//import auth from '../../api/auth/Authorization'

const Confirmation = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [activeMessage, setActiveMessage] = useState('Wait for comfirmation');

    useEffect(() => {
        const fetchActivation = async () => {
            try {
                await $api.get(`/auth/active/${token}`);
                handleActivationSuccess();
            } catch (error) {
                handleActivationFailure();
            }
        };

        fetchActivation();
    }, [token, navigate]);

    const handleActivationSuccess = () => {
        setActiveMessage("Successfully confirm!");
        navigate('/login', { replace: true });
    };

    const handleActivationFailure = () => {
        setActiveMessage("It's can be time error. Try again");
        navigate('/registration', { replace: true });
    };

    return (
        <section className="email-reg">
            <h1>Result</h1>
            <p>{activeMessage}</p>
        </section>
    );
};

export default Confirmation