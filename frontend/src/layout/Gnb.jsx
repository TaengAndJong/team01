import React from "react";
import PathsData from "../assets/pathsData.jsx";
import {Link, useLocation} from "react-router-dom";



const Gnb=({userData,menu})=>{

    let location = useLocation();
   
    const isAdminRoute = location.pathname.startsWith('/admin'); // boolean 값 반환 ( 현재경로가 '/admin'으로 시작하는지에 대해서);



    // userData가 null이 아닌지 확인 후, roles에 접근
    if (!userData) {
        return (<>
            <h1 className="logo">
                <Link to={PathsData.page.main} className="img logo-img">
                    <em className="sr-only">the book 로고</em>
                </Link>
            </h1>
            <nav id="gnb" className="gnb">
                <ul className="d-flex first-depth">
                    {
                        menu?.clientList?.map((item)=>{
                            if(item.menuDepth == "1차메뉴" && item.menuType == "사용자"){
                                return (
                                    <li key={item.menuId}>
                                        <Link to={item.menuPath}>
                                            <span>
                                                       {item.menuName}
                                            <i className="hoverLeaf"></i>
                                            </span>
                                        </Link>
                                    </li>
                                )
                            }
                        })
                    }
                    {
                    menu?.commonList?.map((item)=>{

                        if(item.menuName != "로그인" && item.menuName !="마이페이지"){
                            return (
                                <li key={item.menuId}>
                                    <Link to={item.menuPath}>
                                            <span>
                                                       {item.menuName}
                                                <i className="hoverLeaf"></i>
                                            </span>
                                    </Link>
                                </li>
                            )
                        }
                    })
                    }
                </ul>
            </nav>
        </>); // 또는 다른 fallback UI 표시
    }

    let role = userData.roles ? userData.roles[0] : null;

    return (
        <>
            {(role === "ROLE_ADMIN" || role === "ROLE_MEMBER") ?
                (
                    //관리자, 사원인 회원
                    <>
                        <h1 className="logo">
                            <Link to={PathsData.page.admin} className="img logo-img">
                                <em className="sr-only">the book 로고</em>
                            </Link>
                        </h1>

                        <nav id="gnb" className={`gnb ${isAdminRoute?(location.pathname ==='/admin'? "main-gnb":"sub-gnb"):""}`}>
                            <ul className="d-flex first-depth">
                                {
                                    menu?.adminList?.map((item)=>{
                                        if(item.menuDepth == "1차메뉴" && item.menuName !="로그인"){
                                           return (
                                               <li key={item.menuId}>
                                                   <Link to={item.menuPath}><span>
                                                       {item.menuName}
                                                       <i className="hoverLeaf"></i></span>
                                                   </Link>
                                               </li>
                                           )
                                        }
                                    })
                                }
                                {
                                    menu?.commonList?.map((item)=>{

                                        if(item.menuName == "마이페이지"){
                                            return (
                                                <li key={item.menuId}>
                                                    <Link to={item.menuPath}>
                                            <span>
                                                       {item.menuName}
                                                <i className="hoverLeaf"></i>
                                            </span>
                                                    </Link>
                                                </li>
                                            )
                                        }
                                    })
                                }

                            </ul>
                        </nav>
                    </>
                ) : (
                    //일반회원
                    <>
                        <h1 className="logo">
                            <Link to="/" className="img logo-img">
                                <em className="sr-only">the book 로고</em>
                            </Link>
                        </h1>
                        <nav id="gnb" className="gnb">
                            <ul className="d-flex first-depth">
                                {
                                    menu?.clientList?.map((item) => {
                                        if (item.menuDepth == "1차메뉴" && item.menuType == "사용자") {
                                            return (
                                                <li key={item.menuId}>
                                                    <Link to={item.menuPath}>
                                            <span>
                                                       {item.menuName}
                                                <i className="hoverLeaf"></i>
                                            </span>
                                                    </Link>
                                                </li>
                                            )
                                        }
                                    })
                                }
                                {
                                    menu?.commonList?.map((item) => {

                                        if (item.menuDepth == "1차메뉴" && item.menuName != "로그인") {
                                            return (
                                                <li key={item.menuId}>
                                                    <Link to={item.menuPath}>
                                            <span>
                                                       {item.menuName}
                                                <i className="hoverLeaf"></i>
                                            </span>
                                                    </Link>
                                                </li>
                                            )
                                        }
                                    })
                                }
                            </ul>
                        </nav>
                    </>)

            }

        </>
    );
}

export default Gnb;