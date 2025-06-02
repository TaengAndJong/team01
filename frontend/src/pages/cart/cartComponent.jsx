import CartList from "./components/cartList.jsx";
import React, { useEffect, useReducer} from "react";
import {useMenu} from "../common/MenuContext.jsx";
import {menuNavi} from "../../util/menuNavi.jsx";
import {Outlet} from "react-router-dom";

//1.장바구니 상태전역관리 context
export const CartStateContext = React.createContext();
//2.장바구니 상태전역관리 reduce , dispatch 컨텍스트
export const CartDispatchContext = React.createContext();

//3.reducer 함수
function reducer(state, action){

    switch(action.type){
        case "INIT" :
            if(action.data){
                console.log("INIT action",action.data, Array.isArray(action.data));
            }
            // 서버에서 단일객체{} 또는 여러 개의 객체가  action.data로 넘어오면 배열에 담아줘야 함.
            return Array.isArray(action.data) ? action.data : [action.data];
        case "DELETE":
            if(action.data){
                console.log("delete action",action.data);
                console.log("delete Array", Array.isArray(action.data));
            }
            // action.data가 배열이고(객체일경우, key가 없는 데이터일경우, 키로 접근할수 없음!)
            return state.filter((item) => { return !action.data.includes(String(item.bookId))})

        default:
            return state;
    }

};


const Cart = () => {

    //4.장바구니 전역관리 상태 함수
    const [cartData, dispatch] = useReducer(reducer,null);

    //메뉴 받아오기
    const {menu,currentPath,standardPoint}  = useMenu(); // menuProvider에서 데이터를 제공하는 커스텀훅
    let adminMenuTree = menuNavi(menu?.adminList);
    //let adminHome = menu?.adminList?.find(item => item.menuId === "admin")?.menuPath;
    //let subNavi = adminMenuTree?.filter(item => item.menuPath.includes(standardPoint));

    //초기값 갱신 함수
    const onInit = (cartData) =>{
        console.log("cartList Init ",cartData);
        dispatch({
            type: "INIT",
            data: cartData,
        })
    }



    const cartList = async() =>{

        try{
            const response = fetch("/api/cart",{
                method: "GET",
                credentials: 'include'
            });

            if(!response.ok){
                console.log("요청 실패");
                throw Error(response.statusText);
            }

            const data = await response.json();
            console.log("data------ cartList",data);
            onInit(data);

        }catch(error){


        }
    }

    useEffect(()=>{

        //마운트 시 fetch요청 보내기
        cartList();
    },[]) // 빈 배열일 경우 마운트시 한 번만 실행




    return(
        <>
            <div className="page">
                <section className="content">
                    <div className="content-inner custom-border">
                        <CartStateContext.Provider value={cartData}>
                            <CartDispatchContext.Provider value={{onInit}}>
                                <Outlet />
                            </CartDispatchContext.Provider>
                        </CartStateContext.Provider>
                    </div>
                </section>

            </div>


        </>
    )
}

export default Cart;