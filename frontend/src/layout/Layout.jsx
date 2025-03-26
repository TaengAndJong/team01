import React, {useEffect, useState} from 'react';
import { AuthProvider } from "../pages/common/AuthContext.jsx";
import Header from "./Header.jsx"
import Footer from "./Footer.jsx";
import {Outlet, useLocation} from "react-router-dom";
import {useMenu} from "../pages/common/MenuContext.jsx";

const Layout = () => {
    const [data, setData] = useState('');
    const [url,setUrl] = useState('/api'); // 기본 URL 설정
    const {menu,currentPath,standardPoint} = useMenu();
    let location = useLocation();

// body에 /admin 과 /은 main이고 그 외 전부 sub 클래스 출력
    const bodyName = (currentPath) => {
        if(currentPath ==="/admin" || currentPath == "/"){
            return "main";
        }else{
            return "sub"
        }
        // 매칭되는 메뉴가 없을 경우 빈 문자열 반환
    };
    
    const pageName = (standardPoint) => {
        for (let list in menu) {
            const foundItem = menu[list].find((item) => item.menuPath === standardPoint);
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
                        if(foundItem.menuPath.includes("Detail") || foundItem.menuPath.includes("Modify")){

                            return `${foundItem.menuId}`;
                        }
                        return `${foundItem.menuId}`;

                }
            }
        }
        return ""; // 매칭되는 메뉴가 없을 경우 빈 문자열 반환
    };


    useEffect(() => {
        bodyName(currentPath);
        pageName(standardPoint); // 현재경로에 따른 bodyClass 추가 함수

        // navigation fetch 경로 동적기능 필요
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    console.log("???",response.text())
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // 응답의 Content-Type을 확인하여 처리
                const contentType = response.headers.get("Content-Type");

                if (contentType && contentType.includes("application/json")) {
                    console.log("layout data 요청 - json",response.json());
                    // JSON 응답일 경우
                    return response.json();
                } else {
                    console.log("layout data 요청 - text");
                    // 텍스트 응답일 경우
                    return response.text();
                }

            })
            .then((data) => {
                setData(data); // 받은 문자열 상태에 저장
            })
            .catch((error) => console.error('Fetch error:', error));
    }, [url,location]);

    // location?.pathname.startsWith("/admin/")? "sublayout":"mainlayout"
    //${location?.pathname== menu.menuPath? menuId:""}
    return (
        <>
            {/*정규식으로 sub 구분하기????*/}
            <div className={`bodyWrapper ${bodyName(currentPath)}`}>

                <AuthProvider>
                    {/*여기에 현재경로 Context 설정하기*/}
                    <Header/>
                    {/*메인페이지일 경우 main, 서브페이지일 경우 sub , 삼항 연산자 사용하기
                        incluedes()를 사용하면 모든경로에 포함되는 값을 찾고, 시작값만 찾으려면 startWidth()
                        */}
                    {/*sub &&' main 구분필요*/}
                    <main className={`main ${pageName(standardPoint)}`}>

                        <Outlet context={{data, setUrl}}/>
                        
                        <div className="bg-frame">
                            {/*<span className="obj cloud1"></span>*/}
                            {/*<span className="obj cloud2"></span>*/}
                            {/*<span className="obj cloud3"></span>*/}
                            {/*<span className="obj cloud4"></span>*/}
                            {/*<span className="obj cloud5"></span>*/}
                        </div>
                    </main>
                    <Footer/>
                </AuthProvider>
            </div>

        </>

    );
};

export default Layout;
