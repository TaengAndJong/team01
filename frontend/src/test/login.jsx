import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

function Login({ setUrl,data }) {
    // 상태 관리
    const [id, setId] = useState(''); // id 상태 추가
    const [password, setPassword] = useState('');
    const [hashedPassword, setHashedPassword] = useState('');

    // URL 설정
    useEffect(() => {
        setUrl('/api/login'); // Login 컴포넌트 진입 시 URL 변경
    }, [setUrl]);



    const handleIdChange = (e) => {
        console.log("id" , e.target.value)
        setId(e.target.value);
    };

    const handlePasswordChange = (e) => {
        console.log("pwd" , e.target.value)
        setPassword(e.target.value);
    };

    // submit 버튼 클릭 시 fetch 통해 로그인 컨트롤러에 데이터 요청
    const handleFormSubmit = async (e) => {
        e.preventDefault();// 이벤트 버블링 방지

        const userCredentials = {
            id: id,
            password: password,
        };

        // 로그인 요청 백엔드 서버로 보내기
        const response = await fetch("/login",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userCredentials),
        });

        //백엔드 서버로부터 응답 받기
        if(response.ok){
            const data = await response.json();
            console.log("로그인 성공",data.message);
        }else{
            console.log("로그인 실패");
        }


    };

    return (
     <>
         {data}
        <form onSubmit={handleFormSubmit}>
            <label>
                아이디:
                <input
                    type="text"
                    placeholder="아이디"
                    value={id}
                    onChange={handleIdChange} // id 상태 업데이트
                />
            </label>
            <br />
            <label>
                비밀번호:
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={handlePasswordChange} // password 상태 업데이트
                />
            </label>
            <br />
            <button type="submit" >로그인</button>
            {/*<p>해시값: {hashedPassword}</p>*/}
        </form>
     </>
    );
}
//hashedPassword 는 json 코드로 서버로 전송됨
export default Login;
