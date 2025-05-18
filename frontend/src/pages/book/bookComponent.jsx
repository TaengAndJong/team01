import BookList from "./components/bookList.jsx";
import {createContext, useEffect, useReducer} from "react";


//판매하는 도서 목록 전역상태관리 컨텍스트
export const bookStatusContext = createContext();
//판매도서 crud 상태관리 context
export const bookDispatchContext = createContext();

// reducer를 이용한 상태관리 함수
const reducer = (state, action) => {

    switch (action.type) {
        case "INIT" :
            if(action.data){ // 배열인지 확인
                console.log("INIT action",action.data, Array.isArray(action.data));
            }
            return "INIT"
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
    },[bookData]); // 도서 데이터 변경 시, 재반영

    console.log("bookData ----client Book",bookData);

    return(
        <>
            <div className="hoverLeaf"></div>
            <bookStatusContext.Provider value={bookData}>
                <bookDispatchContext.Provider>
                    <BookList bookData={bookData} onInit={onInit}/>
                </bookDispatchContext.Provider>
            </bookStatusContext.Provider>

        </>
    )
}

export default Book;