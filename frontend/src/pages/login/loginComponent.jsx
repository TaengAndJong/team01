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
            credentials: 'include',  // 쿠키를 포함시키기 위해 'include' 설정
        });
        console.log("response",userCredentials);
        console.log("response",response);

        const contentType = response.headers.get("Content-Type");
        let data='';
        //백엔드 서버로부터 응답 받기
        if(response.ok){
            console.log("contentType",contentType);
            console.log("컨텐츠타입 들어가기전",response);
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
                console.log("json data",data);
                console.log("응답 제이슨 성공",data.message);

                if (data.redirect) {
                    console.log("리디렉션 URL:", data.redirect);
                    window.location.href = data.redirect;
                } else {
                    console.error("리디렉션 URL이 없습니다");
                }

            } else {

                data = response.text();// 텍스트 응답일 경우
                console.log("텍스트data",data);
                console.log("텍스트mgs",data.message);
                return data;
            }

        }else{
            console.error("서버와 통신 중 에러 발생:", error);
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
                        type="password"
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
