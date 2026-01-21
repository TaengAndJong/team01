import React, {createContext, useState, useContext, useEffect} from 'react';
import axios from "axios";


// 1. 로그인 상태를 관리할 Context 생성 == 전역 상태관리 생성
const AuthContext = createContext();

// 2. Context Provider 생성
export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false); // 로그인상태 여부
    const [userData, setUserData] = useState({}); // 사용자 정보

    //로그인 요청실패
    const handleLogoutState = () => {
        setIsAuthenticated(false); //세션상태 인증 무효
        setUserData(null); // 사용자데이터 초기화
        localStorage.removeItem("userData"); // 로컬스토리지초기화
    };

    // 앱 로드 시 서버에 인증 상태 확인 (세션 유지 확인) ==> 서버 최종결괴에 따라 로그인 상태 갱신
    const checkLogin = async() => {
        try{
            const res =  await axios.get("/api/auth", { withCredentials: true });
          //서버로부터 userData를 담아 응답이 온 경우
            if(res.data?.userData){ 
                //로그인 상태처리
                setIsAuthenticated(true);//세션이 유효
                setUserData(res.data.userData);//userData 객체 설정
                localStorage.setItem(//localStorage는 서버 인증 성공 후에만 사용
                    "userData",
                    JSON.stringify(res.data.userData)
                );
            }else {
                handleLogoutState();
            }
        }
        catch(err){
            //요청 실패
            handleLogoutState();
        }
    };

    //로그인했을 경우 사용자 데이터 확인 및 설정
    const loginSuccess = (userData) => {
        console.log("userData", userData);
        setIsAuthenticated(true);
        setUserData(userData); // 로그인 시 사용자 데이터 설정
        // 로컬 스토리지에 사용자 정보 저장
        localStorage.setItem('userData', JSON.stringify(userData));

    };
    //로그아웃했을경우
    const logout = () => {
        setIsAuthenticated(false);//세션무효화
        setUserData(null); // 로그아웃 시 사용자 데이터 초기화
        // 로컬 스토리지에서 사용자 정보 삭제
        localStorage.removeItem('userData');

    };
    //로그인실패했을경우
    const loginFailure = () => {
        console.log('로그인 실패 처리 함수 ')
        setIsAuthenticated(false); //세션무효화
        setUserData(null); // 사용자 데이터 초기화
        // 로그인 실패 시에도 로컬 스토리지 초기화
        localStorage.removeItem('userData');

    };


    // 새로고침 시 로컬 스토리지에서 사용자 데이터 확인
    useEffect(() => {
        checkLogin(); // 서버부터 확인 해야함
        }, []);


    return (
        <AuthContext.Provider value={{ isAuthenticated,setIsAuthenticated, userData,setUserData, loginSuccess, logout, loginFailure}}>
            {children}
        </AuthContext.Provider>
    );
};

// 3.커스텀훅 생성
// AuthContext에 접근하여 현재로그인 상태를 가져오는 역할을 하는 customHook
export const useAuth = () => useContext(AuthContext);

