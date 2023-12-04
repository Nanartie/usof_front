import { useSelector } from 'react-redux';
import { useEffect } from "react";
import aboutpic from '../../assets/about.png';
import './main.css';


function Main() {
    const style = useSelector((state) => state.style);
    useEffect(() => {
        const elements = document.querySelectorAll('.auth_form, .div_for_err_f, .err_title_main, .desc_err_main, .provided_main, .desc_err_fifty_main')
        
        if (style.style === 'sat') {
            elements.forEach((element) => {
                element.classList.add('sat');
            });
            
        } else if (style.style === 'normal') {
            elements.forEach((element) => {
                element.classList.remove('sat');
            });
           
        }
    }, [style]);
    return (
        <div>
            <div className="auth_form">
                <div className="div_for_err_f">
                    <h2 className="err_title_main">N-Gsof</h2>
                    <div className="prvd_dec"><h3 className="desc_err_main">Provided by</h3><a href={"https://t.me/moon_chi"} className="provided_main">alobunets</a></div>
                    
                    <div><h3 className="desc_err_fifty_main">a place where the themes of games and nature intertwine</h3></div>
                    <img src={aboutpic} className="main_pic"></img>
                    <div><h3 className="desc_err_fifty_main">Compare characters and animals, learn botany through games, 
                    or learn something you need to know about the biome in games</h3></div>
                </div>
            </div>
        </div>
    );
}

export default Main;