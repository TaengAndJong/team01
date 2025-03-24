import {createContext,useState ,useContext, useEffect} from "react";

//1. 전역 상태관리 context 생성
const MenuContext = createContext();

//2.Provider 생성
export const MenuProvider = ({ children }) => {

    //메뉴 상태관리 state 선언
    const [menu, setMenu] = useState([]);

    //getfetch 요청
    const getMenuData= async ()=>{
        console.log("fetch 전체메뉴 요청중");
        const response= await fetch("/api/menu",{
            method: "GET",
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
        console.log(response);
        const menuData = await response.json();
        // 받아온 데이터를 메뉴 상태관리 변수에 갱신
        setMenu(menuData);
        console.log("메뉴데이터 갱신완료",menuData);

    }

    //화면 렌더링 시 
    useEffect(() => {
        console.log("전체메뉴 요청 중");
        getMenuData();
        console.log("menu",menu);
    },[])

    return (
        <>
            <MenuContext.Provider value={{menu}}>
                {children}
            </MenuContext.Provider>
        </>
    )
}

//3.customHook 생성 ==> 전역상태관리의 현재 상태를 다른 곳에서 사용할 수 있도록 하는역할
export const useMenu = () => useContext(MenuContext);