import axios from "axios";
// Axios 기본 설정
axios.defaults.withCredentials = true;

//로그인이 필요 없는 경로 목록
const publicPath = ["/", "/signup"];

//미로그인 경로 확인 함수
const confirmPublicPath = (path)=>{
    console.log("confirmPublicPath ",path);
    // 공용경로이면 true   //book, book/bookDetail/** ==> /book으로 시작하는 경로 (클라이언트)
    if(publicPath.includes(path) || path.startsWith("/book")){ return true};
    //해당 조건이 없을경우
    return false;// false 반환
}


// Axios 응답 인터셉터
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const path = window.location.pathname;
            console.log("axios 인터셉터 경로",path);
            if(confirmPublicPath(path)){
                console.log("공용경로가 아니면 인터셉터 경로",path);
                //여기에서 해당페이지로 이동후 모달띄우기?
                //window.location.href = "/login"
                alert("로그인이 필요합니다. 로그인페이지로 이동하시겠습니까?");
            }

            console.log("공용경로-----------",path);

        }
        return Promise.reject(error);
    }
);