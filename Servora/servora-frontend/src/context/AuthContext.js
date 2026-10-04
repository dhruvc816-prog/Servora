import { createContext, useContext, useState } from 'react';

// Context banao
const AuthContext = createContext();

// Provider — poori app ko wrap karega
export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role'));

    // Login hone pe token + role save karo
    const saveAuth = (token, role) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        setToken(token);
        setRole(role);
    };

    // Logout hone pe sab clear hoga
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setToken(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ token, role, saveAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// 3. Hook — kisi bhi component mein use karo
export const useAuth = () => useContext(AuthContext);