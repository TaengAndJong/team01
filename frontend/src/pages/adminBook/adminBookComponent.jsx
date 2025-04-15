import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useReducer,useState} from "react";
import LeftMenu from "../../layout/LeftMenu.jsx";
import {useMenu} from "../common/MenuContext.jsx";
import {menuNavi} from "../../util/menuNavi.jsx";

// 주소에 해당하는 제목 데이터 가져와서 레프트 메뉴 이름과 제목열에 데이터 나열하기

function reducer(state, action) {

    switch (action.type) {

        case "INIT" : {
            return action.data
        }

        case "CREATE": {
            const newState = [action.data, ...state];
            //서버에 한번 insert해야함?
            return newState;
        }


        case "default": {
            return state;
        }
        //
    }
//reducer end
}


//context 상태관리
export const BookStateContext = React.createContext();// state 값을 공급하는 context
export const BookDispatchContext = React.createContext();// 생성, 수정(갱신), 삭제 값을 공급하는 context

const AdminBook = () => {
    //init 데이터가 변경이 감지되면 초기값변경하기위해 기본값 false
    const [isDataLoaded, setIsDataLoaded] = useState(false); //데이터가 로드되기 전에 컴포넌트가 먼저 렌더링되도록 하기 위함
    const [bookdata, dispatch] = useReducer(reducer, []);

    const {menu,currentPath,standardPoint}  = useMenu(); // menuProvider에서 데이터를 제공하는 커스텀훅


    let adminMenuTree = menuNavi(menu?.adminList);
    let adminHome = menu?.adminList?.find(item => item.menuId === "admin")?.menuPath;
    let subNavi = adminMenuTree?.filter(item => item.menuPath.includes(standardPoint));



    useEffect(()=>{
        console.log("관리자 북 컴포넌트 북 데이터 ",  bookdata);
        onInit(bookdata);
    },[]) // 마운트 시에 한 번실행 됨

    const onInit =(bookdata) => {
        console.log("InitBookData", bookdata);
        dispatch({
            type:"INIT",
            data:{
                ...bookdata
            }
        });
    }
    const onCreate = (createBook) => {

        dispatch({
            type: "CREATE", // 이벤트 발생 시 작동해야할 dispatch 타입 결정
            data: {
                // 도서 등록 페이지에서 onSubmit 함수를 실행해 받아온 createBook 데이터 전부 입력
                ...createBook,
            }
        });

    }



    return (
        <>
            <div className="page bookBoard d-flex">
                <div className="left">
                    <LeftMenu/>
                </div>

                {/*링크이동할 사이드메뉴 */}
                <div className="right">
                    <section className="content">
                        <div className="content-inner">
                            {/*현재경로의 페이지명 depth 2 */}
                            <h3 className="sub-title current-title title-border">
                                {
                                    menu?.adminList?.map((item) => {
                                        if (item.menuPath.startsWith(`${currentPath}`)) {
                                            return item.menuName
                                        }
                                    })
                                }

                            </h3>

                            {/*depth별 네비주소,현재페이지일 경우 표시필요*/}

                            <ol className="menu-navi d-flex title-border">
                                {/* 서브페이지 네비게이션 */}
                                <li><Link to={adminHome}>홈</Link></li>
                                {subNavi?.[0] && (
                                    <li><Link to={subNavi?.[0].menuPath}>{subNavi?.[0].menuName}</Link></li>
                                )}
                                {subNavi?.[0]?.secondChild && (
                                    <li> {subNavi?.[0].secondChild?.filter(item => (item.menuDepth === "2차메뉴" && item.menuPath.includes(currentPath)))
                                    .map((item) => item.menuName)}</li>
                                    )
                                }

                            </ol>
                            <BookStateContext.Provider value={bookdata}>
                                <BookDispatchContext.Provider value={{onCreate, onInit}}>
                                    <Outlet/>
                                </BookDispatchContext.Provider>
                            </BookStateContext.Provider>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )

}
export default AdminBook;