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
            console.log("wishList-------getFetch----component", data);
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
        console.log("onInit----------------", wishList);
        console.log("onInit----------------Array.isArray", Array.isArray(wishList));
        dispatch({
            type:"INIT",
            data: wishList
        });
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
        console.log("wishData---wishComponent",wishdata)
        //페이지네이션값 갱신? 해줘야함?

    },[paginationInfo.currentPage]) // 마운트 시에 한 번실행 됨

    console.log("wishdata ----------init ",wishdata)
    console.log("paginationInfo ----------init ",paginationInfo)

    return(
        <>
        <WishStateContext.Provider value={wishdata}>
            <WishDispatchContext.Provider value={onInit}>
                <PaginationContext.Provider value={{paginationInfo,setPaginationInfo,onChangePageHandler}}>
                    <Outlet/>
                </PaginationContext.Provider>
            </WishDispatchContext.Provider>
        </WishStateContext.Provider>


        </>
    );


}

export default WishComponent