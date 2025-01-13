import {useEffect, useState} from 'react'
import {Routes, Route } from "react-router-dom";


import './App.css'
import Main from "./pages/main/mainComponent.jsx";


import Page from "./test/page.jsx";
import SignUp from "./pages/singUp/signUpComponent.jsx";
// import cart from "./pages/cart/cartComponent.jsx";

import Login from "./pages/login/loginComponent.jsx";
import Qna from "./pages/qna/qnaComponent.jsx";
import QnaCreate from "./pages/qna/components/qnaCreate.jsx";
import QnaDetail from "./pages/qna/components/qnaDetail.jsx";
import QnaEdit from "./pages/qna/components/qnaEdit.jsx";
import Admin from "./pages/admin/adminCoponent.jsx";

function App() {
    const [data, setData] = useState('');
    const [url,setUrl] = useState('/api'); // 기본 URL 설정

    // 경로 요청할 매핑주소 ?


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
                console.log('Received data:', data); // 받은 문자열 출력
                setData(data); // 받은 문자열 상태에 저장
            })
            .catch((error) => console.error('Fetch error:', error));
    }, [url]);

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Main/>} />
                {/*<Route path="/api" element={<Home data={data} setUrl={setUrl} />} />*/}
                <Route path="/login" element={<Login data={data} setUrl={setUrl}/>} />
                <Route path="/admin" element={<Admin data={data} setUrl={setUrl}/>} />
                <Route path="/page" element={<Page data={data} setUrl={setUrl}/>} />
                <Route path="/signup" element={<SignUp/>} />
                <Route path="/test/qnaList" element={<Qna/>} />
                <Route path="/create" element={<QnaCreate/>} />
                <Route path="/post/:id" element={<QnaDetail/>} />
                <Route path="/edit/:id" element={<QnaEdit/>} />
            </Routes>
        </div>
    );

}

export default App
