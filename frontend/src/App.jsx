import {useEffect, useState} from 'react'
import {Routes, Route } from "react-router-dom";


import './App.css'
import Home from "./test/home.jsx";
import Login from "./test/login.jsx";
import Admin from "./test/admin.jsx";

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
                return response.text();  // 문자열로 응답 받기
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
                <Route path="/" element={<Home data={data} setUrl={setUrl}/>} />
                {/*<Route path="/api" element={<Home data={data} setUrl={setUrl} />} />*/}
                <Route path="/login" element={<Login data={data} setUrl={setUrl}/>} />
                <Route path="/admin" element={<Admin data={data} setUrl={setUrl}/>} />
            </Routes>
        </div>
    );

}

export default App
