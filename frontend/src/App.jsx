import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
    const [data, setData] = useState('');

    useEffect(() => {
        fetch('http://localhost:8081/api/test')
            .then(response => response.text())  // 서버에서 문자열을 반환하므로 text() 사용
            .then(data => setData(data))  // 받은 데이터를 상태에 저장
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div>
            <h1>서버에서 받은 데이터:</h1>
            <p>{data}</p>  {/* 받은 데이터를 화면에 표시 */}
        </div>
    );
}

export default App
