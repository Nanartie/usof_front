import $api from "../index";
const authAp = {
  login: ({ login, password }) => {
    return $api.post('/auth/login', { login, password });
  },
  logout: (token) => {
    return $api.post('/auth/logout', { headers: { authorization: `Bearer ${token}` } });
  },
  register: ({login, password, confirm_password, fullName, email}) => {
    return $api.post('/auth/register', {login, password, confirm_password, fullName, email});
  },
  reset: (email) => {
    return $api.post('/auth/reset', email);
  },
  conf:(token) => {
    return $api.get(`/auth/active/${token}`);
  },
  tokCheck:(token) => {
    return $api.get(`/check-token`, { headers: { authorization: `Bearer ${token}` } });
  },
  resetPass: (email) => {
    return $api.post(`/auth/password-reset`, {email: email});
  },
  resetPassConf: (token, password, confirm_password) => {
    return $api.post(`/auth/password-reset/${token}`, {password: password, confirm_password: confirm_password});
  }
};

export { authAp };