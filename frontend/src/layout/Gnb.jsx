import React from "react";
import PathsData from "../assets/pathsData.jsx";
import {Link, useLocation} from "react-router-dom";




const Gnb=({userData,menu})=>{
    console.log("header userData " , userData); // 사용자정보확인
    let location = useLocation();
    console.log("location gnb", location);//현재경로확인
    const isAdminRoute = location.pathname.startsWith('/admin'); // boolean 값 반환 ( 현재경로가 '/admin'으로 시작하는지에 대해서);

    console.log("gnbMenu----------", menu);


    // userData가 null이 아닌지 확인 후, roles에 접근
    if (!userData) {
        return (<>
            <h1 className="logo">
                <Link to={PathsData.page.main}><img className="img" src="" alt="로고"/></Link> {/* a 태그를 Link로 변경 */}
            </h1>
            <nav id="gnb" className="gnb">
                <ul className="d-flex">
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
            { (role === "ROLE_ADMIN" || role === "ROLE_MEMBER")?
                (
                    //관리자, 사원인 회원
                    <>
                        <h1 className="logo">
                            <Link to={PathsData.page.admin} className="img logo-img">
                                {/*<em className="sr-only">책 로고</em>*/}
                                <em className="">책 로고</em>
                            </Link>
                        </h1>

                        <nav id="gnb" className={`gnb ${isAdminRoute?(location.pathname ==='/admin'? "main-gnb":"sub-gnb"):""}`}>
                            <ul className="d-flex first-depth">
                                {/*{adminArray?.map((item,index)=>{*/}
                                {/*    return (<>*/}
                                {/*        <li key={index}>*/}
                                {/*            <Link to={item.menuPath}><span>{item.menuName}<i*/}
                                {/*            className="hoverLeaf"></i></span></Link></li>*/}
                                {/*    </>)*/}
                                {/*})}*/}

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
                        <nav id="gnb" className="gnb">
                            <ul className="d-flex">
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