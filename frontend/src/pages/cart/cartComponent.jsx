import CartList from "./components/cartList.jsx";
import React, {useContext, useReducer} from "react";
import LeftMenu from "../../layout/LeftMenu.jsx";
import {Link, Outlet} from "react-router-dom";
import {BookDispatchContext, BookStateContext, PaginationContext} from "../adminBook/adminBookComponent.jsx";
import {useMenu} from "../common/MenuContext.jsx";
import {menuNavi} from "../../util/menuNavi.jsx";

//1.장바구니 상태전역관리 context
export const cartStateContext = React.createContext();
//2.장바구니 상태전역관리 reduce , dispatch 컨텍스트
export const cartDispatchContext = React.createContext();

//3.reducer 함수
function reducer(state, action){

};


const Cart = () => {

    //4.장바구니 전역관리 상태 함수
    const [cartData, dispatch] = useReducer(reducer,null);

    //메뉴 받아오기
    const {menu,currentPath,standardPoint}  = useMenu(); // menuProvider에서 데이터를 제공하는 커스텀훅
    let adminMenuTree = menuNavi(menu?.adminList);
    //let adminHome = menu?.adminList?.find(item => item.menuId === "admin")?.menuPath;
    //let subNavi = adminMenuTree?.filter(item => item.menuPath.includes(standardPoint));

    return(
        <>
            <div className="page">
                <section className="content">
                    <div className="content-inner custom-border">
                        <cartStateContext.Provider value={null}>
                            <cartDispatchContext.Provider value={null}>
                                <CartList></CartList>
                            </cartDispatchContext.Provider>
                        </cartStateContext.Provider>
                    </div>
                </section>

            </div>


        </>
    )
}

export default Cart;