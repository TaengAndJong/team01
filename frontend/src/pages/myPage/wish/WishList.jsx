import React, {useContext, useEffect, useState} from "react";
import SearchBar from "./searchBar.jsx";
import Pagination from "../../../util/pagination.jsx";
import WishItem from "./WishItem.jsx";
import "@css/wishList/wishList.css";
import {PaginationContext, WishStateContext,WishDispatchContext} from "./WishComponent.jsx";


const WishList = () => {

    const InitData = useContext(WishStateContext);
    const {onInit} = useContext(WishDispatchContext);
    const {paginationInfo,onChangePageHandler} = useContext(PaginationContext);
    const [wishList, setWishList] = useState(null);



    useEffect(() => {
        //1.부모에서 받아온 데이터를 상태관리 함수에 갱신해줌
        if(InitData){ // 데이터가 있을경우
            console.log("InitData--------useEffect",InitData);
            setWishList(InitData);
        }
    }, [InitData]);




    //검색어 필터 상태관리 ==> 초기값 빈 배열!
    const [search,setSearch] = useState({
        bookType: 'ALL',
        searchType: 'bookName',   // ✅ 여기서 기본값 설정
        keyword: ''
    });
    console.log("search 상태관리",search);

    //찜목록 검색 비동기 Post 요청
    const handleSearch = async ()=>{
        //search 초기 데이터 URLsearchParam으로 가공
        console.log("search--fetch",search);
        const param = new URLSearchParams(search);
        console.log("search--param",param);
        //URLSearchParam {size: 3}
        const paramString = param.toString();
        console.log("search--paramString",paramString);
        //type=DOMESTIC&keyword=%ED%8C%A8%ED%8B%B0&field=category

        //검색버튼 누르면 서버로 검색 필터 전송
        try{
            //URLSearchParam 객체르 사용해서 url에 쿼리스트링으로 값을 담아 보내기때문에
            // Content-Type,body 사용할 필요 없음 (body는 클라이언트가 데이터를 서버로 보낼 때 필요)
            const response  = await fetch(`/api/mypage/wishlist?${paramString}`, {
                method: "POST",
            });

            // 요청 성공실패
            if(!response.ok){
                console.log("통신에러",response.status);
                throw Error(response.statusText);
            }
            //요청 성공
            const data = await response.json();
            console.log("search---------------",data);
            //setbookData에 데이터 갱신 처리 해주어함?
            onInit(data.userWishList);

        }catch (e){
            console.log("검색실패",e);
        }
    }

    console.log("wishList--------",wishList);
    console.log("paginationInfo-------", paginationInfo);


    return (
        <>
            <SearchBar search={search} setSearch={setSearch} handleSearch={handleSearch}/>
            <WishItem wishList={wishList} setWishList={setWishList}/>
            <Pagination paginationInfo={paginationInfo} onChangePageHandler={onChangePageHandler}/>
        </>
    );
};

export default WishList;
