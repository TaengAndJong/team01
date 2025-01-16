import React, { createContext, useState, useContext } from 'react';

// 로그인 상태를 관리할 Context 생성
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // 로그인 여부 상태
    const [userData, setUserData] = useState(null); // 사용자 정보

    const login = (data) => {
        setIsAuthenticated(true);
        setUserData(data); // 로그인 시 사용자 데이터 설정
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUserData(null); // 로그아웃 시 사용자 데이터 초기화
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
