import React ,{useState} from 'react';
import Btn from "../util/reuseBtn.jsx";
import pathsData from "../assets/pathsData.jsx";



const Header = () => {

    //로그인 후 사용자 정보가져오기
    const [authData, setAuthData] = useState(null);


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

                {/* 세션 조건이 없으면 로그인 */}
                <Btn className={"login"} type={"login"} text={"로그인"} path={pathsData.page.login}/>
                {/* 세션 조건이 있으면 로그아웃 */}
                <Btn className={"logout"} type={"logout"} text={"로그아웃"} path={pathsData.page.logout}/>
                <Btn className={"mypage"} type={"mypage"} text={"마이페이지"} path={pathsData.page.mypage}/>
                <Btn className={"cart"} type={"cart"} text={"장바구니"} path={pathsData.page.cart}/>
            </div>
        </header>
    );
};

export default Header;