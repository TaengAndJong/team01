import React ,{useState,useEffect} from 'react';
import Btn from "../util/reuseBtn.jsx";
import pathsData from "../assets/pathsData.jsx";
import {useAuth} from "../pages/common/AuthContext.jsx";



const Header = () => {

// 로그인 상태와 사용자 데이터 가져오기
    const { isAuthenticated, userData } = useAuth();


    console.log("userData----------------",userData);
    console.log("isAuthenticated----------------",isAuthenticated);


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
                            <li>{userData.roles[0] === "ROLE_ADMIN" ?
                                `${userData.clientName}관리자(${userData.clientId})`
                                : `${userData.clientName}(${userData.clientId})님`}
                            </li>
                        )}
                        </li>
                        <li> <Btn className={"logout"} type={"logout"} text={"로그아웃"} path={pathsData.page.logout}/>
                        </li>
                    </>
                ) : (
                    <li><Btn className={"login"} type={"login"} text={"로그인"} path={pathsData.page.login}/></li>
                )}
            </div>
        </header>
    );
};

export default Header;