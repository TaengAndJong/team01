import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from "../common/AuthContext.jsx";


function Login({data}) {

    // 상태 관리
    const [clientId, setclientId] = useState(''); // id 상태 추가
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(""); // 실패 메시지 상태
    const {login, loginFailure} = useAuth(); // 로그인 상태 업데이트 함수
    const navigate = useNavigate();


    const handleIdChange = (e) => {
        console.log("id", e.target.value)
        setclientId(e.target.value);
    };

    const handlePasswordChange = (e) => {
        console.log("pwd", e.target.value)
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

        //application/x-www-form-urlencoded 형식으로 보내기 위해 사용
        const formData = new URLSearchParams();
        formData.append("clientId", clientId);
        formData.append("password", password);

        // 로그인 요청 백엔드 서버로 보내기
        const response = await fetch("/api/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(), // .toString()변환; application/x-www-form-urlencoded 형식으로 데이터를 변환하기 위해서
            mode: 'cors',  // CORS 모드 명시
            credentials: 'include',  // 쿠키를 포함시키기 위해 'include' 설정
        });


        const contentType = response.headers.get("Content-Type");
        let data;
        //백엔드 서버로부터 응답 받기
        if (response.ok) {
            //Json과 text 데이터 요청 받는데 성공하면 실행되는 로직

            if (contentType && contentType.includes("application/json")) {
                data = await response.json();

                //로그인 성공여부에 따른 리다이렉션 로직
                console.log("data", data);
                if (data.status === "success") {
                    handleLoginSuccess(data); // 로그인 성공 처리
                } else if (data.status === "error") {
                    handleLoginFailure(); // 로그인 실패 처리
                    setLoginError(data.message);//에러 메시지 갱신
                } else {
                    console.error("알 수 없는 상태:", data.status);
                    handleLoginFailure(); // 로그인 실패 처리
                }

            } else {

                data = await response.text();// 텍스트 응답일 경우
                return data;
            }

        } else {
            console.error("서버와 통신 중 에러 발생:", error);
            // navigate("/login");  // React Router를 통해 리다이렉트
        }

    };


    return (
        <>

            <div className="page login-inner">
                <div className="d-flex align-items-center flex-column justify-content-center custom-border p-3">
                    <h4 className="h4 title mb-3">로그인</h4>
                    <form onSubmit={handleFormSubmit} className="login-form">
                        <div className="d-flex login-row my-3">
                            <label htmlFor="clientId" className="col-sm-1 col-form-label icon login-user me-3">
                                <span className="sr-only">아이디</span>
                            </label>
                            <div className="col-sm-11">
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
                        <div className="d-flex login-row mb-4">
                            <label htmlFor="password" className="col-sm-1 col-form-label icon login-pw me-3">
                                <span className="sr-only">비밀번호</span>
                            </label>
                            <div className="col-sm-11">
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
                        <div className="d-flex justify-content-center align-items-center pt-2" >
                            <Link className="btn custom-btn02 w-50 me-1" to={"/signup"}>회원가입</Link>
                            <button type="submit" className="btn custom-btn00 w-50 ms-1">로그인 </button>
                        </div>
                    </form>
                    {loginError && <div className="msg error">
                        <p className="d-flex align-items-center"><span className="icon info me-2"></span> {loginError}</p>

                    </div>} {/* 실패 메시지 표시 */}
                </div>
            </div>
        </>
    );
}

//hashedPassword 는 json 코드로 서버로 전송됨
export default Login;


//react-router-dom의 useNavigate를 사용해 리다이렉트하며, 상태를 유지
//window.location.href