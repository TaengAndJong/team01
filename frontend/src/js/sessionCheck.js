
import axios from "axios";
import {catchError} from "../util/error.jsx";
import {useModal} from "../pages/common/modal/ModalContext.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useRef} from "react";
import {useAuth} from "../pages/common/AuthContext.jsx";

//커스텀 훅 사용법
export const useSessionCheck = () =>{

    const { isAuthenticated } = useAuth();
    const {openModal,closeModal}= useModal();
    const navigate = useNavigate();
    const isRunning = useRef(false); // 세션확인 중복방지 관리


// 개발/배포 환경 구분
    const baseURL = import.meta.env.PROD
        ? "" // 배포 서버 URL
        : "/api"; // 개발 시 Vite 프록시 => vite config에서 http://localhost:8081를 api로 대체함, 프론트엔드 기준

    //axios 생성
    const sessionCheck = axios.create({
        baseURL,
        withCredentials: true, // 쿠키전송
    });

   useEffect(() => {
       //이미 세션체크가 실행중이라면
       if (isRunning.current) return; // 종료
       isRunning.current = true; // 값 true로 변경

       //interceptor 등록 (모든 응답에서 401 처리)
       const interceptor = sessionCheck.interceptors.response.use(
           response => response,
           error => {

               console.log("error.response interceptor",error.response)
               if (error.response && error.response.status === 401) {
                   console.log("권한 없음 접근 불가 메뉴 인터셉트 ")
                   catchError(error, { openModal, closeModal, navigate });
               }
               return Promise.reject(error);
           }
       );
       //실제 세션 체크 요청 보내기
       const intervalSessionCheck = setInterval(async () => {

           if (!isAuthenticated) return; // 로그인 안했으면 그냥 종료시키기 위한 코드

           try {
               const res = await sessionCheck.get("/check/session"); // 여기가 매핑주소
               console.log("세션 유효:", res.data);

           } catch (err) {
               console.log("세션 무효 : ",err.message);
               //에러데이터는 에러처리 유틸로
               catchError(err, { openModal, closeModal, navigate });
           }
       },60000)//1분마다


       
       // 컴포넌트 언마운트 시 interceptor ,interval 제거하여 메모리 누수방지
       return () => {
           clearInterval(intervalSessionCheck);
           sessionCheck.interceptors.request.eject(interceptor);
           isRunning.current = false;
       }

   },[openModal, closeModal, navigate]);

}



// 배포할때 확인==>배포 시에는 보통 프록시 없이 백엔드 서버 URL을 직접 사용
// export const sessionCheck = axios.create({
//   baseURL: import.meta.env.PROD ? "https://your-production-backend.com" : "/api",
//   withCredentials: true,
// });