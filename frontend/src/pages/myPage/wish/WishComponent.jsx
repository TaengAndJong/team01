import React, {useEffect, useReducer, useState} from "react";
import {Outlet} from "react-router-dom";




//context 상태관리
export const WishStateContext = React.createContext();// state 값을 공급하는 context
export const WishDispatchContext = React.createContext();// 생성, 수정(갱신), 삭제 값을 공급하는 context
export const PaginationContext = React.createContext();

//dispatch 함수로부터 action data를 받아 초기데이터를 갱신하는 reducer 함수
const reducer =(state, action) => {

    switch(action.type){
        case "INIT":
            if(action.data){
                console.log("INIT action",action.data, Array.isArray(action.data));
            }
            return  Array.isArray(action.data) ? action.data : [action.data];
        case "UPDATE":
            if(action.data){
                console.log("UPDATE action",action.data, Array.isArray(action.data));
            }
            //state는 새로 들어온 데이터객체를 담고있는 배열
            // action.data의 bookId가 기존데이터인 book의 bookId와 같으면 새로들어온 action.data로 교체 아니면 기존 데이터 유지
            return state.map((wish) =>
                wish.bookId === action.data.bookId ? action.data : wish
            );
        default:
            return state;
    }
}

const WishComponent=()=>{

    //찜목록 상태관리변수
    const [wishdata, dispatch] = useReducer(reducer,null);
    // //찜목록 검색 상태관리변수
    // const [search,setSearch] = useState([]);
    //페이징 처리 상태관리변수
    const [paginationInfo, setPaginationInfo] = useState({
        currentPage: 1,
        totalPages: 0,
        totalRecord: 0,
        pageSize: 4
    });

    console.log("paginationInfo",paginationInfo)

    //찜목록데이터 비동기 get fetch요청
    const wishFetch = async () => {
        try {

            //get요청시 서버로 전송해 줄 현재페이지(page)와 , 보여줄 페이지수(pageSize)
            const params = new URLSearchParams({
                currentPage: paginationInfo.currentPage, // 클라이언트가 결정하는 현재페이지, 기본값은 1
                pageSize: paginationInfo.pageSize, // 보여줄 페이지 개수 10로 고정
            });


            const response = await fetch(`/api/mypage/wishlist?${params.toString()}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = await response.json();
            console.log("wishList-------getFetch", data);
            onInit(data.userWishList);

            setPaginationInfo({
                currentPage: data.currentPage,
                pageSize: data.pageSize,
                totalPages: data.totalPages,
                totalRecord: data.totalRecord,
            })

        }catch (err) {
            console.log("찜목록 데이터 불러오기 실패", err); // 오류 처리
        }
    };


//dispatch 함수
    const onInit =(wishList) => {
        console.log("onInit", wishList);
        dispatch({
            type:"INIT",
            data: wishList
        });
    }

    const onUpdate=(updateWishList) => {
        console.log("updateWishList", updateWishList);
        dispatch({
            type:"UPDATE",
            data:updateWishList
        })
    }


    //페이지버튼 클릭시 실행되는 핸들러
    const onChangePageHandler = (page) => {
        console.log("changePage----",page);
        //pagination의 currentPage 값 갱신
        setPaginationInfo((prev) =>({
            ...prev,
            currentPage: page
        }))

    }

    useEffect(()=>{
        // 마운트 시 서버 또는 db에서 데이터를 받아온 후 onInit을 실행해야 함
        wishFetch();
    },[paginationInfo.currentPage]) // 마운트 시에 한 번실행 됨

    console.log("wishdata ----------init ",wishdata)
    console.log("paginationInfo ----------init ",paginationInfo)

    return(
        <>
        <WishStateContext.Provider value={wishdata}>
            <WishDispatchContext.Provider value={{onInit,onUpdate}}>
                <PaginationContext.Provider value={{paginationInfo, onChangePageHandler}}>
                    <Outlet/>
                </PaginationContext.Provider>
            </WishDispatchContext.Provider>
        </WishStateContext.Provider>


        </>
    );


}

export default WishComponent