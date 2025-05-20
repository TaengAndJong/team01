import BookList from "./components/bookList.jsx";
import React, {createContext, useEffect, useReducer} from "react";
import {Outlet} from "react-router-dom";


//판매하는 도서 목록 전역상태관리 컨텍스트
export const BookStateContext = createContext();
//판매도서 crud 상태관리 context
export const BookDispatchContext = createContext();

// reducer를 이용한 상태관리 함수
const reducer = (state, action) => {

    switch (action.type) {
        case "INIT" :
            if(action.data){
                console.log("INIT action",action.data, Array.isArray(action.data));
            }
            // 서버에서 단일객체{} 또는 여러 개의 객체가  action.data로 넘어오면 배열에 담아줘야 함.
            return Array.isArray(action.data) ? action.data : [action.data];
        default:
            return state;
    }


}


const Book = () => {

    const [bookData,dispatch]= useReducer(reducer, null);

    const onInit =(bookData)=>{
        console.log("bookList bookData" , bookData);
        dispatch({
            type:"INIT",
            data:bookData,
        })
    }

    const bookListFetch = async ()=> {
        try{
            //클라이언트 도서 컨트롤러에 비동기 요청 보내기
            const response = await fetch("/api/book",{
                method: "GET",
            });

            if(!response.ok){
                throw Error(response.statusText);
            }

            const data =await response.json();
            //초기 데이터를 data가 될 수 있게 파라미터로 넘겨주기
            onInit(data);
            console.log("data",data);
        }catch(err){

        }

    }

    useEffect(()=>{

        bookListFetch(); // 도서데이터 요청

    },[]); // 처음 렌더링 시에만 한 번 실행

    console.log("bookData 최상위 부모 컴포넌트",bookData);

    return(
        <>
            <div className="hoverLeaf"></div>

            <BookStateContext.Provider value={bookData}>
                <BookDispatchContext.Provider value={{onInit}}>
                    <Outlet/>
                </BookDispatchContext.Provider>
            </BookStateContext.Provider>

        </>
    )
}

export default Book;