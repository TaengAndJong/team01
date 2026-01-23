import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { menuNavi } from "../util/menuNavi.jsx";
import Btn from "../util/reuseBtn.jsx";
import pathsData from "../assets/pathsData.jsx";
import {useAuth} from "../pages/common/AuthContext.jsx";
import {useModal} from "../pages/common/modal/ModalContext.jsx";
import {catchError} from "../util/error.jsx";

const Gnb = ({ menu, commonMenuItems }) => {
  console.log("gnb 진입");
  console.log(` 메뉴 : ${menu}  공통메뉴 : ${commonMenuItems} ` );

  // 로그인상태와 사용자데이터 가져오는 커스텀훅, 훅은 최상단에 작성
  const { isAuthenticated, userData, role, logoutReset,isLoading} = useAuth();
  const [gnb, setGnbList] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;


  useEffect(() => {
    console.log("gnb useffect");
    if (isLoading) return;
    if (!menu) return;
    //경로 조건으로 관리자, 클라이언트 gnb 분리하기
    if (isAdminRoute) {
      // 현재 주소가 "/admin" 으로 시작하면
      //역할이 관리자와 멤버만 접근
      if (role === "ROLE_ADMIN" || role === "ROLE_MEMBER") {
        setGnbList(menuNavi(menu.adminList));
      }else{
        setGnbList([]); // 권한 없으면 비움
      }
    } else {
      // 그 외의 경로일 경우
      setGnbList(menuNavi(menu.clientList)); //adminList
    }
    //pathname과 role,menu의 변경에 따른 menuNavi변경
  }, [pathname, role, menu]);


  //서버에서 인증판단을 내려주기 전까지 대기중
  if (isLoading) {
    return null;
  }


  // 로그인 또는 회원가입 페이지가 아닐 때만 Header를 렌더링
  const hideContent =
      location.pathname === pathsData.page.login ||
      location.pathname === pathsData.page.signup;

  let logoPath = menu?.clientList?.find(
      (item) => item.menuId === "main"
  ).menuPath; // 기본 로고 경로 문자열 값
  const isAdminRoute = location.pathname.startsWith("/admin"); // boolean 값 반환 ( 현재경로가 '/admin'으로 시작하는지에 대해서);
  //admin 일 경우, 로고 경로 변경
  logoPath = isAdminRoute ? "/admin" : logoPath;



  // 로그아웃 fetch 요청
  const handleLogout = async () => {

    try {
      // 서버로 로그아웃 요청 보내기
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 쿠키를 포함하여 요청
      });

      if (response.ok) {
        // 로그아웃 성공 시, 인증 상태를 업데이트하거나 다른 동작
        // AuthContext에서 인증 상태를 업데이트하는 로직
        logoutReset();
        // 로그아웃 후 리다이렉트
        navigate("/");
      } else {
        logoutReset();
        console.error("로그아웃 실패");
      }
    } catch (error) {
      logoutReset();
      console.error("로그아웃 요청 중 오류 발생", error);
    }
  };

  console.log("GNB Role 권한 확인", role);


  return (
    <>
      <h1 className="logo">
        <Link to={logoPath} className="logo-link">
          <strong className="logo-inner">
            <i className="leaves object"></i>
            <em className="img">
              <span className="sr-only">the book 로고</span>
            </em>
          </strong>
        </Link>
      </h1>
      {gnb?.length > 0 && (
          <nav id="gnb" className="gnb">
            <ul className="d-flex first-depth">
              {gnb?.filter(item => isAuthenticated || item.menuName !== "문의")
                  ?.map((item) =>
                      (<li key={item.menuId}>
                        <Link to={item.menuPath}>
                          <span>
                            {item.menuName}
                            <i className="hoverLeaf"></i>
                          </span>
                        </Link>
                        {item.secondChild && (
                            <ul className="second-depth">
                              {item.secondChild
                                  ?.filter((item) => !item.menuPath.includes("bookDetail"))
                                  .map((item) => (
                                      <li key={item.menuId}>
                                        <Link to={item.menuPath}>
                                          <span>{item.menuName}</span>
                                        </Link>
                                      </li>
                                  ))}
                            </ul>
                        )}
                      </li>)
              )}
              {/*관리자나 멤버일 때 보일 메뉴*/}
              {(role === "ROLE_ADMIN" || role === "ROLE_MEMBER") &&
                  !pathname.startsWith("/admin") && (
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
      )}
      {isAuthenticated ? ( // 시큐리티 인증이 true이면
          <>
            <div className="user-info">
              <ul className="d-flex align-items-center">
                <li>
                  {" "}
                  {userData && role && (
                      <span>
                    {role === "ROLE_ADMIN"
                        ? `${userData.clientName} 관리자 (${userData.clientId})`
                        : role === "ROLE_MEMBER"
                            ? `${userData.clientName} 사원 (${userData.clientId})`
                            : `${userData.clientName}님`}
                  </span>
                  )}
                </li>
                {commonMenuItems &&
                    commonMenuItems.map((item, index) => {
                      return (
                          <li key={index}>
                            <Link
                                to={item.menuPath}
                                className={`${item.menuId} icon`}
                            >
                              <span className={"sr-only"}>{item.menuName}</span>
                            </Link>
                          </li>
                      );
                    })}
                <li>
                  <Btn
                      className={"logout  custom-btn"}
                      id={"logout-btn"}
                      text={"로그아웃"}
                      onClick={handleLogout}
                />
              </li>
            </ul>
          </div>
        </>
      ) : (
        <>
          {/*   로그인 페이지와 회원가입 페이지 가 아니면  나오게 */}
          {!hideContent && (
            <>
              <div className="user-info">
                <ul className="d-flex align-items-center">
                  <li>
                    <Link to={"/login"} className={"login btn custom-btn01"}>로그인</Link>
                  </li>
                  <li>
                    <Link to={"/signup"} className={"signup btn custom-btn01"}>회원가입</Link>
                  </li>
                </ul>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Gnb;
