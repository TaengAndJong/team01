import {Outlet, useNavigate} from "react-router-dom";
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
    const [isDataLoaded, setIsDataLoaded] = useState(false); //데이터가 로드되기 전에 컴포넌트가 먼저 렌더링되도록 하기 위함
    const [bookdata, dispatch] = useReducer(reducer, []);
    console.log("bookdata11111111111 ", bookdata); // 1번째 렌더링 .. 없음

    useEffect(()=>{
        //마운트 될 때, 서버로 데이터 요청 보내서 데이터 갱신하기
        const initFetch = async () => {
            try{
                // 서버로 응답 요청
                const response = await fetch("/api/admin/book/bookList", {
                    method: "GET",
                });
                // 돌아온 응답 상태
                if(!response.ok){ // 응답 상태가 200아니면
                    console.log(response.status)
                    throw new Error("서버 응답 에러");
                }
                // 응답 성공시
                const data = await response.json(); // 프라미스객체 (resolve) JSON형태로 파싱
                console.log("bookdata222222 ", data);// 있음
                setIsDataLoaded(true);  // state에 반환하여 저장
                //상태촉발함수,초기값 갱신
                dispatch({
                    type:"INIT",
                    data:data, // 서버로부터 받아온 데이터 갱신해주기
                });

            }catch(e){
                console.log("catch-Error",e); // 오류 처리
            }
        }
        initFetch(); // 정의 (함수 호출)
        console.log("bookdata333333 ", bookdata); // 세번째 렌더링 없음
    },[])



    const onCreate = (createBook) => {
        console.log("createBook--------------????",createBook);
        dispatch({
            type: "CREATE", // 이벤트 발생 시 작동해야할 dispatch 타입 결정
            data: {
                // 도서 등록 페이지에서 onSubmit 함수를 실행해 받아온 createBook 데이터 전부 입력
                ...createBook,
            }
        });

    }

    console.log("bookdata4444",bookdata); // 두번째 렌더링  없음



    if(!isDataLoaded){ //isDataLoaded 가 true 가 아니면 = false
        return <div>데이터를 불러오는중 </div>
    }else{
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
}
export default AdminBook;