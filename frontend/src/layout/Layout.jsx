import React, {useEffect, useState} from 'react';
import { AuthProvider } from "../pages/common/AuthContext.jsx";
import {useMenu} from "../pages/common/MenuContext.jsx";
import Header from "./Header.jsx"
import Footer from "./Footer.jsx";
import {Outlet, useLocation} from "react-router-dom";

const Layout = () => {
    const [data, setData] = useState('');
    const [url,setUrl] = useState('/api'); // 기본 URL 설정

    const {menu} = useMenu();

    if(menu){
        console.log("menu", menu);
    }



    let location = useLocation();

    useEffect(() => {
        console.log("location",location);

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


    return (
        <>
            <div className={`bodyWrapper${location?.pathname.startsWith("/admin/")? " sub":""}`}>
                <AuthProvider>

                        <Header/>
                        {/*메인페이지일 경우 main, 서브페이지일 경우 sub , 삼항 연산자 사용하기
                        incluedes()를 사용하면 모든경로에 포함되는 값을 찾고, 시작값만 찾으려면 startWidth()
                        */}
                        <main className={location?.pathname.startsWith("/admin/")? "sublayout":"mainlayout"}>
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
