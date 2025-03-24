import React, {createContext, useState, useContext, useEffect} from 'react';

// 1. 로그인 상태를 관리할 Context 생성 == 전역 상태관리 생성
const AuthContext = createContext();

// 2. Context Provider 생성
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // 로그인 여부 상태
    const [userData, setUserData] = useState(null); // 사용자 정보

    // 새로고침 시 로컬 스토리지에서 사용자 데이터 확인
        useEffect(() => {
            const storedUserData = localStorage.getItem('userData');
            if (storedUserData) {
                setIsAuthenticated(true);
                setUserData(JSON.parse(storedUserData)); // 로컬 스토리지에서 가져온 데이터로 로그인 상태 유지
            }
        }, []);



    const login = (userData) => {
        setIsAuthenticated(true);
        setUserData(userData); // 로그인 시 사용자 데이터 설정
        // 로컬 스토리지에 사용자 정보 저장
        localStorage.setItem('userData', JSON.stringify(userData));
        console.log("로그인 유저데이터:", userData);

    };

    const logout = () => {
        setIsAuthenticated(false);
        setUserData(null); // 로그아웃 시 사용자 데이터 초기화
        // 로컬 스토리지에서 사용자 정보 삭제
        localStorage.removeItem('userData');
        console.log("로그아웃 완료: 인증 정보 초기화 완료");

    };

    const loginFailure = () => {
        setIsAuthenticated(false);
        setUserData(null); // 사용자 데이터 초기화
        // 로그인 실패 시에도 로컬 스토리지 초기화
        localStorage.removeItem('userData');
        console.log("로그인 실패: 인증 정보 초기화 완료");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userData, login, logout, loginFailure}}>
            {children}
        </AuthContext.Provider>
    );
};

// 3.커스텀훅 생성
// AuthContext에 접근하여 현재로그인 상태를 가져오는 역할을 하는 customHook
export const useAuth = () => useContext(AuthContext);
