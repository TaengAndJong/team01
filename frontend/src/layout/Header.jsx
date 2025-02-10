import React ,{useState,useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import Btn from "../util/reuseBtn.jsx";
import pathsData from "../assets/pathsData.jsx";
import {useAuth} from "../pages/common/AuthContext.jsx";
import Gnb from "./Gnb.jsx"




const Header = () => {

// 로그인 상태와 사용자 데이터 가져오기
    const { isAuthenticated, userData,logout } = useAuth();
    const navigate = useNavigate();




    const handleLogout = async () => {

        try {
            // 서버로 로그아웃 요청 보내기
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // 쿠키를 포함하여 요청
            });

            if (response.ok) {
                // 로그아웃 성공 시, 인증 상태를 업데이트하거나 다른 동작
                // AuthContext에서 인증 상태를 업데이트하는 로직
                logout();
                // 로그아웃 후 리다이렉트
                navigate("/")
            } else {
                console.error("로그아웃 실패");
            }
        } catch (error) {
            console.error("로그아웃 요청 중 오류 발생", error);
        }
    };


    //현재 경로 가져오기
    const location = useLocation();
    // 로그인 또는 회원가입 페이지가 아닐 때만 Header를 렌더링
    const hideContent = location.pathname === pathsData.page.login || location.pathname === pathsData.page.signup;


    return (
        <header className="header d-flex justify-content-between align-items-center">
            {/*글로벌 메뉴*/}
            <Gnb userData={userData}/>
            <div>
                <ul className="d-flex align-items-center">
                {isAuthenticated ? ( // 시큐리티 인증이 true이면
                        <>
                            <li> {userData.roles && (
                                <span>{userData.roles[0] === "ROLE_ADMIN" ?
                                    `${userData.clientName}관리자(${userData.clientId})`
                                    : userData.roles[0] === "ROLE_MEMBER"
                                        ? `${userData.clientName}[${userData.clientId}]사원님`
                                    : `${userData.clientName}[${userData.clientId}]님`}
                                </span>
                            )}
                            </li>
                            <li>
                                <Btn className={"logout"} type={"logout"} text={"로그아웃"} onClick={handleLogout}/>

                            </li>
                        </>
                    ) :
                    (<>
                            {/*   로그인 페이지와 회원가입 페이지 가 아니면  나오게 */}
                            {!hideContent && (<>
                                    <li><Btn className={"login"}  text={"로그인"}
                                             path={pathsData.page.login}/></li>
                                    <li><Btn className={"signup"} text={"회원가입"}
                                             path={pathsData.page.signup}/></li>
                                </>
                            )}
                        </>
                    )
                }
                </ul>
            </div>
        </header>
    )
        ;
};

export default Header;