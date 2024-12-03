import {useEffect, useState} from 'react'

import './App.css'
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";

function App() {
    const [data, setData] = useState('');

    useEffect(() => {
        fetch('http://localhost:8081/api')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();  // 문자열로 응답 받기
            })
            .then((data) => {
                console.log('Received data:', data); // 받은 문자열 출력
                setData(data); // 받은 문자열 상태에 저장
            })
            .catch((error) => console.error('Fetch error:', error));
    }, []);

    return (
        <div className="app">

            <Header/>
            <h1>서버에서 받은 데이터:</h1>
            <p>{data}</p>
            <Footer/>
        </div>
    );

}

export default App
