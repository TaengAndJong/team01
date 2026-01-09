import React, {useContext, useEffect, useState} from "react";
import SearchBar from "./searchBar.jsx";
import Pagination from "../../../util/pagination.jsx";
import WishItem from "./WishItem.jsx";
import "@css/wishList/wishList.css";
import {PaginationContext, WishStateContext,WishDispatchContext} from "./WishComponent.jsx";


const WishList = () => {

    const wishdata = useContext(WishStateContext);
    const onInit = useContext(WishDispatchContext); // 함수는 구조분해할당하면 안돼!! 주의!
    const {paginationInfo,setPaginationInfo,onChangePageHandler} = useContext(PaginationContext);
    const [wishList, setWishList] = useState(null);



    useEffect(() => {
        //1.부모에서 받아온 데이터를 상태관리 함수에 갱신해줌
        if(wishdata){ // 데이터가 있을경우
            setWishList(wishdata);
        }
    }, [wishdata]);


    //검색어 필터 상태관리 ==> 초기값 빈 배열!
    const [search,setSearch] = useState({
        bookType: 'ALL',
        searchType: 'bookName',   // ✅ 여기서 기본값 설정
        keyword: ''
    });


    //찜목록 검색 비동기 Post 요청
    const handleSearch = async ()=>{
        //search 초기 데이터 URLsearchParam으로 가공

        const param = new URLSearchParams(search);

        const paramString = param.toString();


        //검색버튼 누르면 서버로 검색 필터 전송
        try{
            //URLSearchParam 객체르 사용해서 url에 쿼리스트링으로 값을 담아 보내기때문에
            // Content-Type,body 사용할 필요 없음 (body는 클라이언트가 데이터를 서버로 보낼 때 필요)
            const response  = await fetch(`/api/mypage/wishlist?${paramString}`, {
                method: "POST",
            });

            // 요청 성공실패
            if(!response.ok){
               
                throw Error(response.statusText);
            }
            //요청 성공
            const data = await response.json();
        
            //setbookData에 데이터 갱신 처리 해주어함?
            onInit(data.userWishList);
            setPaginationInfo({
                currentPage: data.currentPage,
                pageSize: data.pageSize,
                totalPages: data.totalPages,
                totalRecord: data.totalRecord,
            })
           
        }catch (e){
            //에러처리
            console.log("검색실패",e.response.statusText);
        }
    }



    return (
        <>
            <SearchBar search={search} setSearch={setSearch} handleSearch={handleSearch}/>
            <WishItem wishList={wishList} setWishList={setWishList}/>
            <Pagination paginationInfo={paginationInfo} onChangePageHandler={onChangePageHandler}/>
        </>
    );
};

export default WishList;
