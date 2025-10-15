import React, {useEffect, useRef, useState} from "react";
import { AuthProvider } from "@common/AuthContext.jsx";
import { ModalProvider } from "@common/modal/ModalContext.jsx";
import { useMenu } from "@pages/common/MenuContext.jsx";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { Outlet, useLocation } from "react-router-dom";
import { scrollTop } from "@js/common.js";
import {useSessionCheck} from "../js/sessionCheck.js";





const Layout = () => {


  const [data, setData] = useState("");
  const [url, setUrl] = useState("/api"); // 기본 URL 설정
  const { menu, currentPath, standardPoint } = useMenu();
  let location = useLocation();


  // body에 /admin 과 /은 main이고 그 외 전부 sub 클래스 출력
  const bodyName = (currentPath) => {
    console.log("currentPath", currentPath);
    // switch (currentPath) {
    //     case "/":return "main"
    //         break;
    //     case "/admin": return "admin"
    //         break;
    //     case "/signup": return "signup"
    //         break;
    //     default: return "sub"
    //         break;
    // }
    if (currentPath === "/admin" || currentPath === "/") {
      return "index";
    } else {
      return "sub";
    }
    // 매칭되는 메뉴가 없을 경우 빈 문자열 반환
  };

  const pageName = (standardPoint) => {
    for (let list in menu) {
      const menuList = menu[list];
      const foundItem = menu[list]?.find(
        (item) => item.menuPath === standardPoint
      );

      if (foundItem) {
        switch (foundItem.menuPath) {
          case "/admin":
          case "/":
          case " ":
            return "main";
          case "/login":
            return "login";
          case "/signup":
            return "signup";
          default:
            if (
              foundItem.menuPath.includes("Detail") ||
              foundItem.menuPath.includes("Modify")
            ) {
              return `${foundItem.menuId}`;
            }
            return `${foundItem.menuId}`;
        }
      }
    }
    return ""; // 매칭되는 메뉴가 없을 경우 빈 문자열 반환
  };

  //메뉴 등 데이터 fetch
  useEffect(() => {
    bodyName(currentPath);
    pageName(standardPoint); // 현재경로에 따른 bodyClass 추가 함수

    // navigation fetch 경로 동적기능 필요
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // 응답의 Content-Type을 확인하여 처리
        const contentType = response.headers.get("Content-Type");

        if (contentType && contentType.includes("application/json")) {
          // JSON 응답일 경우
          return response.json();
        } else {
          // 텍스트 응답일 경우
          return response.text();
        }
      })
      .then((data) => {
        setData(data); // 받은 문자열 상태에 저장
      })
      .catch((error) => console.error("Fetch error:", error));
  }, [url, location]);

  // 위로가기버튼 돔요소 참조
  const topBtnRef = useRef(null);
  //위로가기 버튼 스크롤 이벤트
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY; // 현재 스크롤 위치
      const vh = window.innerHeight; // 화면 높이

      if (scrollY > vh * 0.6) {
        topBtnRef.current?.classList.add("show"); // 클래스 추가
      } else {
        topBtnRef.current?.classList.remove("show"); // 클래스 제거
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <>
      {/*정규식으로 sub 구분하기????*/}
      <div className={`bodyWrapper ${bodyName(currentPath)}`}>
        <AuthProvider>
          <ModalProvider>
            {/*여기에 현재경로 Context 설정하기*/}
            <Header/>
            {/*메인페이지일 경우 main, 서브페이지일 경우 sub , 삼항 연산자 사용하기
                        incluedes()를 사용하면 모든경로에 포함되는 값을 찾고, 시작값만 찾으려면 startWidth()
                        */}
            {/*sub &&' main 구분필요*/}
            <main className={`main ${pageName(standardPoint)}`}>

              {/*sub 일때 배너 컨텐츠 추가하기 */}
              {/*<div></div>*/}

              <Outlet context={{data, setUrl}}/>
              {currentPath.startsWith("/admin") && (
                  <div className="bg-frame admin">
                    {/*<span className="obj cloud1"></span>*/}
                    {/*<span className="obj cloud2"></span>*/}
                    {/*<span className="obj cloud3"></span>*/}
                    {/*<span className="obj cloud4"></span>*/}
                    {/*<span className="obj cloud5"></span>*/}
                  </div>
              )}

              {!currentPath.startsWith("/admin") && (
                  <div className="bg-frame client">
                    {/*<span className="obj cloud1"></span>*/}
                    {/*<span className="obj cloud2"></span>*/}
                    {/*<span className="obj cloud3"></span>*/}
                    {/*<span className="obj cloud4"></span>*/}
                    {/*<span className="obj cloud5"></span>*/}
                  </div>
              )}
            </main>
            <div className="quick" ref={topBtnRef}>
                  <button className="quick-btn"  onClick={() => scrollTop()} >
                    <span className="sr-only">위로가기</span>
                  </button>
            </div>

            <Footer/>
          </ModalProvider>
        </AuthProvider>
      </div>
    </>
  );
};

export default Layout;
