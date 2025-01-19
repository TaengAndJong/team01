import React ,{useState,useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import Btn from "../util/reuseBtn.jsx";
import pathsData from "../assets/pathsData.jsx";
import {useAuth} from "../pages/common/AuthContext.jsx";
import PathData from "../assets/pathsData.jsx";



const Header = () => {

// 로그인 상태와 사용자 데이터 가져오기
    const { isAuthenticated, userData } = useAuth();
    const {logout} = useAuth();
   const navigate = useNavigate();

    console.log("userData----------------",userData);
    console.log("isAuthenticated----------------",isAuthenticated);


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
                console.log("logout response", response);

                // 로그아웃 성공 시, 인증 상태를 업데이트하거나 다른 동작
                // AuthContext에서 인증 상태를 업데이트하는 로직
                logout();
                console.log("로그아웃 성공");
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
   const hideContent = location.pathname === PathData.page.login || location.pathname === PathData.page.signup;


    return (
        <header className="header">
            <div className="logo">
                <a href="/">testLogo</a>
            </div>
            <nav className="header-nav">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/book">도서</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </nav>
            <div>
                {isAuthenticated ? ( // 시큐리티 인증이 true이면
                    <>
                        <li> {userData?.roles && (
                            <span>{userData.roles[0] === "ROLE_ADMIN" ?
                                `${userData.clientName}관리자(${userData.clientId})`
                                : `${userData.clientName}(${userData.clientId})님`}
                            </span>
                        )}
                        </li>
                        <li><Btn className={"logout"} type={"logout"} text={"로그아웃"} onClick={handleLogout}/>
                        </li>
                    </>
                     ) :
                    (<>
                        {/*   로그인 페이지와 회원가입 페이지 가 아니면  나오게 */}
                            {!hideContent && (<>
                                    <li><Btn className={"login"} type={"login"} text={"로그인"}
                                             path={pathsData.page.login}/></li>
                                    <li><Btn className={"signup"} type={"signup"} text={"회원가입"}
                                             path={pathsData.page.signup}/></li>
                                </>
                            )}
                        </>
                    )
                }
            </div>
        </header>
    )
        ;
};

export default Header;