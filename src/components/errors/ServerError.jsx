import { useEffect, useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";

import './error.css';


function ServerError() {

    return (
        <div>
            <div className="auth_form">
                <div className="div_for_err_f">
                    <h2 className="err_title_fifty">Internal Server Error</h2>
                    <h3 className="desc_err_fifty">Try again later</h3>
                    <Link to="/posts?page=1" className="err_post_link">Posts</Link>
                    
                </div>
            </div>
        </div>
    );
}

export default ServerError;