import React from "react";
import PathsData from "../assets/pathsData.jsx";
import {Link} from "react-router-dom";



const Gnb=({userData})=>{
    console.log("header userData " , userData);

    // userData가 null이 아닌지 확인 후, roles에 접근
    if (!userData) {
        return (  <>
                    <span className="logo">
                        <Link to={PathsData.page.main}>testLogo</Link> {/* a 태그를 Link로 변경 */}
                    </span>
            <nav className="header-nav">
                <ul>
                    <li><Link to={PathsData.page.book}>도서</Link></li>
                    <li><Link to={PathsData.page.board}>게시판</Link></li>
                    <li><Link to={PathsData.page.myPage}>마이페이지</Link></li>
                    <li><Link to={PathsData.page.cart}>장바구니</Link></li>
                </ul>
            </nav>
        </>); // 또는 다른 fallback UI 표시
    }

    let role = userData.roles ? userData.roles[0] : null;

    return(
        <>
            { (userData.roles[0] === "ROLE_ADMIN" || userData.roles[0] === "ROLE_MEMBER")?
                (
                    //관리자, 사원인 회원
                    <>
                        <span className="logo">
                            <Link to={PathsData.page.admin}>testLogo</Link> {/* a 태그를 Link로 변경 */}
                        </span>
                        <nav className="header-nav">
                            <ul>
                                <li><Link to={PathsData.page.book}>도서</Link></li>
                                <li><Link to={PathsData.page.adminBoard}>게시판관리</Link></li>
                                <li><Link to={PathsData.page.myPage}>마이페이지</Link></li>
                                <li><Link to={PathsData.page.cart}>장바구니</Link></li>
                            </ul>
                        </nav>
                    </>
                ) : (
                    //일반회원
                    <>
                    <span className="logo">
                        <Link to={PathsData.page.main}>testLogo</Link> {/* a 태그를 Link로 변경 */}
                    </span>
                    <nav className="header-nav">
                        <ul>
                            <li><Link to={PathsData.page.book}>도서</Link></li>
                            <li><Link to={PathsData.page.board}>게시판</Link></li>
                            <li><Link to={PathsData.page.myPage}>마이페이지</Link></li>
                            <li><Link to={PathsData.page.cart}>장바구니</Link></li>
                        </ul>
                    </nav>
                    </>)

            }

        </>
    );
}

export default Gnb;