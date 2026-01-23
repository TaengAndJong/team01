import React, {createContext, useState, useContext, useEffect} from 'react';
import axios from "axios";
import {useModal} from "./modal/ModalContext.jsx";


// 1. 로그인 상태를 관리할 Context 생성 == 전역 상태관리 생성
const AuthContext = createContext();

// 2. Context Provider 생성
export const AuthProvider = ({ children }) => {


    const [isLoading, setIsLoading] = useState(true); // true로 시작 ==> 서버에 세션 판정 요청 중
    const [isAuthenticated, setIsAuthenticated] = useState(false); // 서버로부터 로그인상태 여부 받아왔나?
    const [userData, setUserData] = useState(null); // 서버로부터 인증된 사용자는 누구?
    const [role, setRole] = useState(null); // 사용자의 권한은 무엇?
    const {openModal,closeModal}= useModal();

    //로그인했을 경우 사용자 데이터 확인 및 설정
    const loginSuccess = (userData) => {
        console.log("로그인성공 userdata",userData);
        setIsAuthenticated(true); //시큐리티 로그인인증 성공하면 true로 설정
        setUserData(userData); //시큐리티 로그인인증 컨트롤러에서 응답받은 사용자 데이터 설정
        setRole(userData.roles[0]);//권한 설정
        localStorage.setItem('userData', JSON.stringify(userData)); // 로컬 스토리지에 사용자 정보 저장
    };

    //로그아웃 경우에만 사용
    const logoutReset = () => {
        console.log("로그아웃 리셋");
        setIsAuthenticated(false);//세션상태 인증 무효
        setUserData(null); // 로그아웃 시 사용자 데이터 초기화
        setRole(null);//role 설정
        // 로컬 스토리지에서 사용자 정보 삭제(로컬스토리지초기화)
        localStorage.removeItem('userData');
    };

    // 인증이 되었는지에 대한 상태만 확인하는 요청 (처음 화면 렌더링 되었을때 한 번만 실행하고 새로고침 시에도 실행)
    const checkSession = async () => {
        try {
            //서버로 세션 유지 상태 확인 요청 보내기
            const res = await axios.get("/api/check/session", {
                withCredentials: true, // 쿠키 포함 전송
            });
        
            //응답받은 데이터
            const data = res.data;
            console.log("checkSession res.data---", data);
            
            //인증 성공 ( 인증성공 true 이고 유저데이터가 있을때
            if (data.authenticated === true && data.userData) { // 근데 새로고침했을 때 authenticated가 true 로 유지되는ㅈ ㅣ확인필요
                setIsAuthenticated(true);
                setUserData(data.userData);
                setRole(data.roles);
                localStorage.setItem(
                    "userData",
                    JSON.stringify(data.userData)
                );
                return;
            }
            //인증 실패
            if (data.authenticated === false) {
                logoutReset();
                return;
            }
            
            //판단불가
            console.warn("세션 상태 판단 불가", data);
            
        }catch(err) {
            console.error("세션 체크 중 오류", err);
        }finally {
            setIsLoading(false);
        }
    };

    // 앱 로드 시 서버에 인증 상태 확인 (세션 유지 확인) ==> 서버 최종결괴에 따라 로그인 상태 갱신 ==> 미로그인시 콘솔에 401 찍히는건 정상
    const checkLogin = async() => {
        try{
            const res =  await axios.get("/api/auth", { withCredentials: true });
            console.log("인증 컨텍스트", res)
          //서버로부터 userData를 담아 응답이 온 경우
            if(res.data?.userData){ 
                //로그인 상태처리
                setIsAuthenticated(true);//세션이 유효
                setUserData(res.data.userData);//userData 객체 설정
                localStorage.setItem(//localStorage는 서버 인증 성공 후에만 사용
                    "userData",
                    JSON.stringify(res.data.userData)
                );
            }
        }
        catch(err){

            if (err.response?.status === 401) { //401은 에러가 아니라 로그인 인증이 되지 않은 상태
                //서버 요청 실패 시 모달 안내 필요없이 로컬스토리지 초기화
                logoutReset();
            } else {
                // 서버 장애 / 네트워크 문제에 대한 안내 필요
                logoutReset();

                openModal({
                    modalType: "error",
                    content:<>
                        <p>서버와의 통신에 문제가 발생했습니다.</p>
                    </>,
                    onConfirm: () => closeModal(),
                })
            }

        }
    };

    // 새로고침 시 로컬 스토리지에서 사용자 데이터 확인
    useEffect(() => {
        // checkLogin(); // 서버부터 확인 해야함
        checkSession();
        }, []);


    return (
        <AuthContext.Provider value={{isAuthenticated,setIsAuthenticated, userData,setUserData, role,loginSuccess,logoutReset,isLoading}}>
            {children}
        </AuthContext.Provider>
    );
};

// 3.커스텀훅 생성
// AuthContext에 접근하여 현재로그인 상태를 가져오는 역할을 하는 customHook
export const useAuth = () => useContext(AuthContext);

