import React from "react";
import PathsData from "../assets/pathsData.jsx";
import {Link, useLocation} from "react-router-dom";



const Gnb=({userData})=>{
    console.log("header userData " , userData);
    let location = useLocation();
    console.log("location gnb", location);
    const isAdminRoute = location.pathname.startsWith('/admin');
    // boolean 값 반환 ( 현재경로가 '/admin'으로 시작하는지에 대해서);
    console.log("isAdminRoute",isAdminRoute);
    // userData가 null이 아닌지 확인 후, roles에 접근
    if (!userData) {
        return (<>
            <h1 className="logo">
                <Link to={PathsData.page.main}><img className="img" src="" alt="로고"/></Link> {/* a 태그를 Link로 변경 */}
            </h1>
            <nav id="gnb-navi" className="gnb-con">
                <ul className="d-flex first-depth">
                    <li><Link to={PathsData.page.book}><span>도서<i className="hoverLeaf icon"></i></span></Link></li>
                    <li><Link to={PathsData.page.board}><span>게시판<i className="hoverLeaf icon"></i></span></Link></li>
                    <li><Link to={PathsData.page.myPage}><span>마이페이지<i className="hoverLeaf icon"></i></span></Link></li>
                    <li><Link to={PathsData.page.cart}><span>장바구니<i className="hoverLeaf icon"></i></span></Link></li>
                </ul>
            </nav>
        </>); // 또는 다른 fallback UI 표시
    }

    let role = userData.roles ? userData.roles[0] : null;

    return(
        <>
            { (role === "ROLE_ADMIN" || role === "ROLE_MEMBER")?
                (
                    //관리자, 사원인 회원
                    <>
                        <h1 className="logo">
                            <Link to={PathsData.page.admin} className="img logo-img">
                                    {/*<em className="sr-only">책 로고</em>*/}
                                    <em className="sr-only">책 로고</em>
                            </Link>
                        </h1>

                        <nav id="gnb-navi" className={`gnb-con ${isAdminRoute?(location.pathname ==='/admin'? "main-gnb":"sub-gnb"):""}`}>
                            <ul className="d-flex first-depth">
                                <li><Link to={PathsData.page.book}><span>도서<i className="hoverLeaf icon"></i></span></Link></li>
                                <li><Link to={PathsData.page.adminBoard}><span>게시판관리<i className="hoverLeaf icon"></i></span></Link>
                                </li>
                                <li><Link to={PathsData.page.myPage}><span>마이페이지<i
                                    className="hoverLeaf icon"></i></span></Link></li>
                                <li><Link to={PathsData.page.cart}><span>장바구니<i className="hoverLeaf icon"></i></span></Link>
                                </li>
                            </ul>
                        </nav>
                    </>
                ) : (
                    //일반회원
                    <>
                        <h1 className="logo">
                            <Link to={PathsData.page.main}><img className="img" src=""
                                                                alt="로고"/></Link> {/* a 태그를 Link로 변경 */}
                        </h1>
                        <nav id="gnb-navi" className="gnb-con">
                            <ul className="d-flex first-depth">
                                <li><Link to={PathsData.page.book}><span>도서<i className="hoverLeaf icon"></i></span></Link></li>
                                <li><Link to={PathsData.page.board}><span>게시판<i className="hoverLeaf icon"></i></span></Link></li>
                                <li><Link to={PathsData.page.myPage}><span>마이페이지<i className="hoverLeaf icon"></i></span></Link></li>
                                <li><Link to={PathsData.page.cart}><span>장바구니<i className="hoverLeaf icon"></i></span></Link></li>
                            </ul>
                        </nav>
                    </>)

            }

        </>
    );
}

export default Gnb;