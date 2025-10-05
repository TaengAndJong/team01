import {createContext,useState ,useContext, useEffect} from "react";
import {useLocation} from "react-router-dom";

//1. 전역 상태관리 context 생성
const MenuContext = createContext();

//2.Provider 생성
export const MenuProvider = ({children}) => {

    //메뉴 상태관리 state 선언
    const [menu, setMenu] = useState([]);
    //getfetch 요청
    const getMenuData= async ()=>{

        const response= await fetch("/api/menu",{
            method: "GET",
            //credentials: "include", // 세션 쿠키 포함
            headers: {
                contentType: "application/json", //json으로 데이터 보내달라고 요청
            }
        }); // response는 프라미스 객체를 반환

        //서버로부터 응답이 false이면
        if(!response.ok){
            console.log("response not ok", response.status);
            throw Error("서버 응답 에러");
        }
        //서버로부터 응답이 true이면, json 객체로 Parsing 하여 데이터 변수에 저장

        const menuData = await response.json();
        // 받아온 데이터를 메뉴 상태관리 변수에 갱신
        setMenu(menuData);
        console.log("메뉴데이터 갱신완료",menuData);

    }

    //현재경로관리
    const location = useLocation();
    const currentPath=location.pathname;
    const [standardPoint, setStandardPoint] = useState("");

    const pathManage  = (currentPath) =>{
        console.log("currentPath--------",currentPath);
       const startPoint = currentPath.split("/");
       // "" 인 값을 제외한 배열 생성 및 반환
        const pathDepth = startPoint.filter((item) => item !== "");
        console.log("pathDepth-------",pathDepth);
        let naviPath="";

        if(pathDepth.length<2){
            for (let i=0; i<pathDepth.length; i++) {
                naviPath +="/"+pathDepth[i];
            }
        } else{
            for (let i=0; i<pathDepth.length-1; i++) {
                naviPath +="/"+pathDepth[i];
            }
        }
        // 공백을 제거한 주소 배열에 담기
        setStandardPoint(naviPath);
    }

    console.log("standardPoint-------메뉴 텍스트 ",standardPoint)
    //화면 렌더링 시
    useEffect(() => {
        getMenuData();
        pathManage(location.pathname); //endpoint 설정 함수 (경로 변경될 때마다 갱신)

    },[location.pathname]); //경로 변경될 때마다 실행


    console.log("menuContext----기준경로",standardPoint)

    return (
        <>
            <MenuContext.Provider value={{menu,currentPath,standardPoint}}>
                {children}
            </MenuContext.Provider>
        </>
    )
}

//3.customHook 생성 ==> 전역상태관리의 현재 상태를 다른 곳에서 사용할 수 있도록 하는역할
export const useMenu = () => useContext(MenuContext);