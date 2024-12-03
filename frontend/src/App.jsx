import {useEffect, useState} from 'react'

import './App.css'
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";

function App() {
    const [data, setData] = useState('');

    useEffect(() => {
        fetch('http://localhost:8081/')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // JSON 형식으로 응답 파싱
            })
            .then((data) => setData(data)) // 상태에 데이터 저장
            .catch((error) => console.error('Fetch error:', error));
    }, []);

    return (
        <div className="app">
            <Header/>
            <h1>서버에서 받은 데이터:</h1>
            <p>{data}</p>  {/* 받은 데이터를 화면에 표시 */}

            <Footer/>
        </div>
    );
}

export default App
