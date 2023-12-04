import { useLocation, Navigate, Outlet } from "react-router-dom";
import jwt_decode from "jwt-decode";

const RolePath = ( {permittedRoles} ) => {
    const currentLocation = useLocation();

    let activeUser;
    if (localStorage.getItem('token')) {
        activeUser = jwt_decode(localStorage.getItem('token'));
    }


    return (
        permittedRoles?.includes(activeUser?.role)
        ? <Outlet />
        : activeUser?.user
            ? <Navigate to='/users' state={{from: currentLocation}} replace />
            : <Navigate to='/login' state={{from: currentLocation}} replace />
    )
}

export default RolePath;