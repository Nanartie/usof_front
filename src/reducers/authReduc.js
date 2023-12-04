import { createContext, useState, useContext } from "react";

const AuthContext = createContext({});

export const AuthReduc  = ({ children }) => {
    const [auth, setAuth] = useState({});

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => { return useContext(AuthContext) };