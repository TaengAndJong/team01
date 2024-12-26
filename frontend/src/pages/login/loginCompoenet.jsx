import React, { useState, useEffect } from 'react';


function Login({ setUrl,data }) {
    // 상태 관리
    const [clientId, setclientId] = useState(''); // id 상태 추가
    const [password, setPassword] = useState('');


    // URL 설정
    useEffect(() => {
        setUrl('/api/login'); // Login 컴포넌트 진입 시 URL 변경
    }, [setUrl]);



    const handleIdChange = (e) => {
        console.log("id" , e.target.value)
        setclientId(e.target.value);
    };

    const handlePasswordChange = (e) => {
        console.log("pwd" , e.target.value)
        setPassword(e.target.value);
    };

    // submit 버튼 클릭 시 fetch 통해 로그인 컨트롤러에 데이터 요청
    const handleFormSubmit = async (e) => {
        e.preventDefault();// 이벤트 버블링 방지

        const userCredentials = {
            clientId: clientId,
            password: password,
        };

        // 로그인 요청 백엔드 서버로 보내기
        const response = await fetch("/api/login",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userCredentials),
        });
        console.log("response",userCredentials);
        console.log("response",response);

        const contentType = response.headers.get("Content-Type");
        let data='';
        //백엔드 서버로부터 응답 받기
        if(response.ok){
            console.log("contentType",contentType);
            console.log("응답 성공",data.message);
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
                console.log("제이슨",data.message);
                // JSON 응답일 경우
                return data;
            } else {
                console.log("error response",response);
                data = response.text();// 텍스트 응답일 경우
                console.log("텍스트",data.message);
                return data;
            }

        }else{
            console.log("로그인 실패",data.message);
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
                        name="clientId"
                        placeholder="아이디"
                        value={clientId}
                        onChange={handleIdChange} // id 상태 업데이트
                    />
                </label>
                <br />
                <label>
                    비밀번호:
                    <input
                        type="text"
                        name="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={handlePasswordChange} // password 상태 업데이트
                    />
                </label>
                <br />
                <button type="submit">로그인</button>
                {/*<p>해시값: {hashedPassword}</p>*/}
            </form>
        </>
    );
}
//hashedPassword 는 json 코드로 서버로 전송됨
export default Login;
