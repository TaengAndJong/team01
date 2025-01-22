import React, {createContext, useState, useContext, useEffect} from 'react';

// 로그인 상태를 관리할 Context 생성
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // 로그인 여부 상태
    const [userData, setUserData] = useState(null); // 사용자 정보


    useEffect(() => {
        // 페이지 새로고침 후 localStorage에서 인증 정보 읽기
        console.log("localStorage-----------",localStorage);
        console.log("userData-----------",userData);

        const storedIsAuthenticated = localStorage.getItem('isAuthenticated');
        const storedUserData = JSON.parse(localStorage.getItem('userData'));

        if (storedIsAuthenticated && storedUserData) {
            setIsAuthenticated(true);
            setUserData(storedUserData);
        }
    }, []);


    const login = (data) => {
        setIsAuthenticated(true);
        setUserData(data); // 로그인 시 사용자 데이터 설정

        // 로그인 성공 시 localStorage에 상태 저장
        localStorage.setItem('isAuthenticated', true);
        localStorage.setItem('userData', JSON.stringify(data));
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUserData(null); // 로그아웃 시 사용자 데이터 초기화

        // 로그아웃 시 localStorage에서 상태 삭제
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userData');

    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
