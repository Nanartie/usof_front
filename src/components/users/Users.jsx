import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
//import rat from '../assets/images/likes/likeActivePicture.png';
import { fetchTwentyUsers } from "../../api/help/userSlice"; 
import './users.css';

const route = {
    serverURL: 'http://localhost:3001'
}

const Pages = ({ totalPages }) => {
  let pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(<li key={i}><a className='pages' href={`/users?page=${i}`}>{i}</a></li>);
  }
  return pages;
};

const Users = () => {
  const { search, pathname } = useLocation();
  const page = search.split('=');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTwentyUsers(page[1]));
  }, [dispatch, page]);
  const users = useSelector((state) => state.users.allUsers);
  const totalPages = useSelector((state) => state.users.allUsersPages);
  const twentyUsers = useSelector((state) => state.users.twentyUsers);

  const displayedUsers = users && users.length > 0 ? users : twentyUsers;
  return (
    <div className="users_block">
        <div className='container_users'>
      {displayedUsers.map((user) => (
        <div key={user.id} className="users_page">
            <div className="flex1">
              <img className='prof_pic_user' src={`http://localhost:3001/api/avatars/${user.profPic}`} alt="Prof pic" />
              <a href={`/users/${user.id}`} className="user_login">{user.login}</a>
              <p className="role_us">role: {user.role}</p>
            </div>
            <div className="flex">
              <div className="flex">
                <div>
                  <div className="flex flex1">
                    <p className="role_us_b">{user.fullName} </p>
                    <p className="role_us_b">rating: {user.rating}</p>
                  </div>
                </div>
              </div>
              <div></div>
            </div>
        </div>
      ))}
    </div></div>
  );
};

export default Users;