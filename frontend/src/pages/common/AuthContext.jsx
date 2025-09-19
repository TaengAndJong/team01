import React, {createContext, useState, useContext, useEffect} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";

// 1. 로그인 상태를 관리할 Context 생성 == 전역 상태관리 생성
const AuthContext = createContext();

// 2. Context Provider 생성
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // 로그인 여부 상태
    const [userData, setUserData] = useState({}); // 사용자 정보


    // 새로고침 시 로컬 스토리지에서 사용자 데이터 확인
        useEffect(() => {
            // 로컬스토리지 위주로 새로고침 시에도 로그인상태 유지( UI 중심)
            const storedUserData = localStorage.getItem('userData');
            if (storedUserData) {
                setIsAuthenticated(true);
                setUserData(JSON.parse(storedUserData)); // 로컬 스토리지에서 가져온 데이터로 로그인 상태 유지
            }
            // 앱 로드 시 서버에 인증 상태 확인 (세션 유지 확인) ==> 서버 최종결괴에 따라 로그인 상태 갱신
            const checkLogin = async() => {
                try{
                    const res =  await axios.get("/api/auth", { withCredentials: true });
                    setIsAuthenticated(true);//세션이 유효한 경우
                    console.log("res.data",res.data);
                    if (res.data.user) setUserData(res.data.user);
                }
                catch(err){
                    setIsAuthenticated(false); // 세션이 만료되었을경우
                    setUserData(null);
                    localStorage.removeItem("userData");
                }
            };
            checkLogin();

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

