import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from "../common/AuthContext.jsx";
import axios from "axios";


const Login = (data) =>{

    //입력 태그 상태관리 - 아이디
    const [clientId, setClientId] = useState("");
    //입력 태그 상태관리 - 비밀번호
    const [password, setPassword] = useState("");
    //에러 관리
    const [loginError, setLoginError] = useState([]);
    //프론트 인증 성공,실패 컨텍스트 관리
    const {logoutReset,loginSuccess} = useAuth();
    const navigate = useNavigate();

    // 아이디 변경 값 onChangeHandler
    const idChangehandler = (id)=>{
        console.log("id 온체인지 핸들러",id);
        // 여기에서 상태값 갱신
        setClientId(id);
    }
    // 비밀번호 변경 값 onChangeHandler

    const passwordChangehandler = (pw)=>{
        console.log("pw 온체인지 핸들러",pw);
        setPassword(pw);
    }

    const handleFormSubmit= async (e)=>{
        e.preventDefault(); // 기본 제출 막기
        //1차 빈 값 (빈 문자열 포함) 검증
        if (!clientId.trim() || !password.trim()) {
            setLoginError("아이디와 비밀번호를 입력해주세요.");
            return;
        }


        //시큐리티 기본 처리방식 : application/x-www-form-urlencoded 형태의 데이터 (key = value)
        // JS 내장객체 URLSearchParams로 key=value 형태의 쿼리스트링으로 변환
        const params  = new URLSearchParams();
        params.append("clientId", clientId);
        params.append("password", password);

       try{
           //서버로 post 요청 보내기
           const response = await axios.post("/api/login", params, {
               headers: { "Content-Type": "application/x-www-form-urlencoded" }, // 시큐리티가 기대하는 형식
               withCredentials: true, // 쿠키 전송 허용
           });
           console.log("로그인 성공,실패 응답 ",response); // 시큐리티에서 성공,실패 핸들러 설정했기 때문에 200으로 받아옴
           const data = response.data;
           // 인증 실패, 성공 두 응답 모두  200코드로 응답, 응답에 대한 status로 조건 분기
           if(response.data.status == "error"){
                //에러 관리 갱신해주기
               logoutReset(); // 로그인 실패 처리 -> 세션 무효화, 사용자 데이터 초기화,로컬 스토리지 초기화
               setLoginError(data.message);
               return; // 종료
           }

           // 로그인 성공
           loginSuccess(data);// 로그인 성공 시,
           navigate(data.redirect);
           
       }catch(err){
           //서버 처리에 대한 에러 예) cors에러, 500코드, 네트워크오류, 서버다운,
           // 401, 403 등등으로 axios가 무응답 또는 예외를 던질 때
           // 사용자에게 보여줄 공통 메시지
           setLoginError("서버와 통신 중 문제가 발생했습니다.");
       }

    }



    return (
        <>

            <div className="page login-inner">
                <div className="d-flex align-items-center flex-column justify-content-center custom-border p-3">
                    <h4 className="h4 title mb-3">로그인</h4>
                    <form  className="login-form" onSubmit={handleFormSubmit}>
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
                                    onChange={(e)=>idChangehandler(e.target.value)} // id 상태 업데이트
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
                                    onChange={(e)=>passwordChangehandler(e.target.value)} // password 상태 업데이트
                                />
                            </div>
                        </div>
                        <div className="d-flex justify-content-center align-items-center pt-2" >
                            <Link className="btn custom-btn02 w-50 me-1" to={"/signup"}>회원가입</Link>
                            <button type="submit" className="btn custom-btn00 w-50 ms-1">로그인 </button>
                        </div>
                    </form>
                    {loginError?.length > 0 && <div className="msg error">
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