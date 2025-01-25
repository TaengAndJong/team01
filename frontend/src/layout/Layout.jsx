import React, {useEffect, useState} from 'react';
import { AuthProvider } from "../pages/common/AuthContext.jsx";
import Header from "./Header.jsx"
import Footer from "./Footer.jsx";
import {Outlet} from "react-router-dom";

const Layout = () => {
    const [data, setData] = useState('');
    const [url,setUrl] = useState('/api'); // 기본 URL 설정



    useEffect(() => {
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
            .catch((error) => console.error('Fetch error:', error));
    }, [url]);


    return (
        <>
            <div>
                <AuthProvider>
                    <Header/>
                    <main>
                        <Outlet context={{data, setUrl}}/>
                    </main>
                    <Footer/>
                </AuthProvider>
            </div>

        </>

    );
};

export default Layout;
