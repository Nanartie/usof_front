import { useEffect, useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import './about.css';




function About() {

    return (
        <div>
            <div className="auth_form">
                <div className="div_for_err_f">
                    <h2 className="err_title_about">N-Gsof</h2>
                    <div className="block_s_f"><h3 className="desc_err_fifty">Provided by</h3><h3 className="provided">alobunets</h3></div>
                    <div className="block_s_t"><h3 className="desc_err_fifty">Idea: </h3><h3 className="provided">join games and nature</h3></div>
                    <div className="block_s"><h3 className="desc_err_fifty">Describe: </h3><h3 className="provided">discuss games, nature, compare one with another, create parallels and interesting useful material</h3></div>
                    <div className="block_s_c"><a href="https://www.flaticon.com/free-icons/gaming-chair" title="gaming chair icons" className="for_inn">Gaming chair icons created by Smashicons - Flaticon</a></div>
                    <div className="block_s_d"><h3 className="desc_err_fifty">Any questions? -</h3><a href={"https://t.me/moon_chi"} className="hrf_div">alobunets</a></div>
                </div>
            </div>
        </div>
    );
}

export default About;