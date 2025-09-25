
import React, { createContext, useState, useEffect, useContext } from 'react';

//Context
const AuthContext = createContext(null);

//Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const validateAndRestoreSession = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            console.log('AuthContext: Initializing, checking stored credentials');
            console.log('AuthContext: Has token:', !!storedToken);
            console.log('AuthContext: Has user:', !!storedUser);

            if (storedToken && storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);

                    // Validate token với server
                    const response = await fetch('http://localhost:5001/api/auth/me', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${storedToken}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        console.log('AuthContext: Token validation successful, user:', userData.name);
                        setUser(userData);
                        setToken(storedToken);
                        setIsAuthenticated(true);
                    } else {
                        // Token không hợp lệ, xóa session
                        console.log('Token validation failed, clearing session');
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');
                        setUser(null);
                        setToken(null);
                        setIsAuthenticated(false);
                    }
                } catch (error) {
                    // Lỗi kết nối hoặc parsing, giữ session local nhưng log warning
                    console.warn('Token validation error, keeping local session:', error);
                    try {
                        const parsedUser = JSON.parse(storedUser);
                        setUser(parsedUser);
                        setToken(storedToken);
                        setIsAuthenticated(true);
                    } catch (parseError) {
                        console.error('Error parsing stored user data:', parseError);
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');
                        setUser(null);
                        setToken(null);
                        setIsAuthenticated(false);
                    }
                }
            } else {
                console.log('AuthContext: No stored credentials found');
            }
            console.log('AuthContext: Initialization complete, loading set to false');
            setLoading(false);
        };

        validateAndRestoreSession();
    }, []);

    const login = (userData, userToken) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userToken);
        setUser(userData);
        setToken(userToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Tạo custom hook để dễ dàng sử dụng context
export const useAuth = () => {
    return useContext(AuthContext);
};