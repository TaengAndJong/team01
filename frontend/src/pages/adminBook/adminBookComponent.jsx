import {Outlet} from "react-router-dom";
import React, {useEffect, useReducer,useState} from "react";
import LeftMenu from "../../layout/LeftMenu.jsx";


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
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [bookdata, dispatch] = useReducer(reducer, []);

    const onCreate = () => {

        dispatch({
            type: "CREATE", // 이벤트 발생 시 작동해야할 dispatch 타입 결정
            data: {}
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
                    <BookStateContext.Provider value={bookdata}>
                        <BookDispatchContext.Provider value={{onCreate}}>
                            <Outlet/>
                        </BookDispatchContext.Provider>
                    </BookStateContext.Provider>

                </div>
            </div>
        </>
    )
}
export default AdminBook;