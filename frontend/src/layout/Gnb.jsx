import React, {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {menuNavi} from "../util/menuNavi.jsx";


const Gnb=({userData,menu})=>{

    const location = useLocation();
    const pathname = location.pathname;
    const role = userData?.roles?.[0]?? null;

    let logoPath = menu?.clientList?.find(item => item.menuId === "main").menuPath; // 기본 로고 경로 문자열 값
    const isAdminRoute = location.pathname.startsWith('/admin'); // boolean 값 반환 ( 현재경로가 '/admin'으로 시작하는지에 대해서);
    //admin 일 경우, 로고 경로 변경
    logoPath = isAdminRoute? "/admin" : logoPath;


    // 역할과 경로에 따른 메뉴 상태관리
    const [gnb, setGnbList] = useState([]);

    useEffect(() => {
        //경로 조건으로 관리자, 클라이언트 gnb 분리하기
        if(isAdminRoute){ // 현재 주소가 "/admin" 으로 시작하면
            //역할이 관리자와 멤버만 접근
            if(role=== "ROLE_ADMIN" || role=== "ROLE_MEMBER"){

                setGnbList(

                    menuNavi(menu?.adminList)
                )
            }
        }else{
            // 그 외의 경로일 경우
            setGnbList(
                //adminList
                menuNavi(menu?.clientList)
            )
        }
        //pathname과 role의 변경에 따른 menuNavi변경
    },[pathname, role,menu])

    return(
        <>
            <h1 className="logo">
                <Link to={logoPath} className="img logo-img">
                    <em className="sr-only">the book 로고</em>
                </Link>
            </h1>
            <nav id="gnb" className="gnb">
                <ul className="d-flex first-depth">
                    {gnb?.map(item => (
                        <li key={item.menuId}>
                            <Link to={item.menuPath}>
                              <span>
                                {item.menuName}
                                  <i className="hoverLeaf"></i>
                              </span>
                            </Link>
                            {item.secondChild && (
                                <ul className="second-depth">
                                    { item.secondChild?.filter(item=> !item.menuPath.includes("bookDetail"))
                                        .map(item => (
                                        <li key={item.menuId}>
                                            <Link to={item.menuPath}>
                                                <span>{item.menuName}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                    {/*관리자나 멤버일 때 보일 메뉴*/}
                    {(role === "ROLE_ADMIN" || role === "ROLE_MEMBER") && !pathname.startsWith("/admin") &&(
                        <li>
                            <Link to="/admin" target="_blank" title="사용자 화면 새창 열림">
                              <span>
                                관리자 <i className="hoverLeaf"></i>
                              </span>
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>
        </>
    );
}

export default Gnb;