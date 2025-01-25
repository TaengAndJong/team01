import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import Btn from "../../util/reuseBtn.jsx";
import Paths from "../../assets/pathsData.jsx"
import { useAuth } from "../common/AuthContext.jsx";

import "../../../dist/assets/pages/login.css";
import pathsData from "../../assets/pathsData.jsx";

function Login({data}) {

    // 상태 관리
    const [clientId, setclientId] = useState(''); // id 상태 추가
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(""); // 실패 메시지 상태
    const { login ,loginFailure } = useAuth(); // 로그인 상태 업데이트 함수
    const navigate = useNavigate();


    const handleIdChange = (e) => {
        console.log("id" , e.target.value)
        setclientId(e.target.value);
    };

    const handlePasswordChange = (e) => {
        console.log("pwd" , e.target.value)
        setPassword(e.target.value);
    };

    //로그인 성공
    const handleLoginSuccess = (data) => {
        login(data); // 로그인 성공 처리

        if (data.redirect) {
            navigate(data.redirect); // 리디렉션
        } else {
            console.error("리디렉션 URL이 없습니다.");
        }
    };
    //로그인 실패
    const handleLoginFailure = (data) => {
        loginFailure(); // 로그인 실패 처리
    };



    // submit 버튼 클릭 시 fetch 통해 로그인 컨트롤러에 데이터 요청
    const handleFormSubmit = async (e) => {
        e.preventDefault();// 이벤트 버블링 방지
    console.log("login------");
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
        console.log("userCredentials",userCredentials);
        console.log("response----------",response);

        const contentType = response.headers.get("Content-Type");
        let data;
        //백엔드 서버로부터 응답 받기
        if(response.ok){
            //Json과 text 데이터 요청 받는데 성공하면 실행되는 로직
            console.log("contentType",contentType);
            console.log("json /text 분기전 응답",response);
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();

              //로그인 성공여부에 따른 리다이렉션 로직
                console.log("data",data);
                if (data.status === "success") {
                    handleLoginSuccess(data); // 로그인 성공 처리
                } else if (data.status === "error") {
                    handleLoginFailure(); // 로그인 실패 처리
                    setLoginError(data.message);//에러 메시지 갱신
                } else {
                    console.error("알 수 없는 상태:", data.status);
                }

            } else {

                data = await response.text();// 텍스트 응답일 경우
                console.log("텍스트data",data);
                console.log("텍스트mgs",data.message);
                return data;
            }

        }else{
            console.error("서버와 통신 중 에러 발생:", error);
            // navigate("/login");  // React Router를 통해 리다이렉트
        }

    };


    return (
        <>
           Received data: {JSON.stringify(data)}
            <div className="login-form text-center">
                 <span className="title">로그인</span>
                <form onSubmit={handleFormSubmit}>
                    <div className="row mb-3">
                        <label htmlFor="clientId" className="col-sm-2 col-form-label">ID</label>
                        <div className="col-sm-10">
                            <input
                                className="form-control"
                                type="text"
                                name="clientId"
                                id="clientId"
                                placeholder="아이디"
                                value={clientId}
                                onChange={handleIdChange} // id 상태 업데이트
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="password" className="col-sm-2 col-form-label">PW </label>
                        <div className="col-sm-10">
                            <input
                                className="form-control"
                                type="password"
                                name="password"
                                id="password"
                                placeholder="비밀번호"
                                value={password}
                                onChange={handlePasswordChange} // password 상태 업데이트
                            />
                        </div>
                    </div>
                    <div className="btn-group-vertical">
                      <Btn className={"login btn btn-secondary"} text={"로그인"}
                           type="submit"/>
                       <Btn className={"signup btn btn-primary"} text={"회원가입"}
                                 path={pathsData.page.signup}/>
                    </div>
                </form>

                {loginError && <div className="msg error"><p>{loginError}</p></div>} {/* 실패 메시지 표시 */}
            </div>
        </>
    );
}

//hashedPassword 는 json 코드로 서버로 전송됨
export default Login;


//react-router-dom의 useNavigate를 사용해 리다이렉트하며, 상태를 유지
//window.location.href