import React, {useEffect, useState} from "react";
import SearchBar from "./searchBar.jsx";
import Pagination from "../../../util/pagination.jsx";
import WishItem from "./WishItem.jsx";

import "@css/wishList/wishList.css";

const WishListComponent = () => {
    //찜목록 상태관리변수
    const [wishList, setWishList] = useState(null);
    //찜목록 검색 상태관리변수
    const [search,setSearch] = useState([]);
    //페이징 처리 상태관리변수
    const [paginationInfo, setPaginationInfo] = useState({
        currentPage: 1,
        totalPages: 0,
        totalRecord: 0,
        pageSize: 6
    });

    //찜목록데이터 비동기 get fetch요청
    const wishFetch = async () => {
        const response = await fetch("/api/mypage/wishlist", {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const data = await response.json();
        console.log("wishList-------", data);
        setWishList(data.userWishList);
    };

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
            const response  = await fetch(`/api/admin/book/bookList?${paramString}`, {
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
            setWishList(data);
        }catch (e){

        }
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

    useEffect(() => {
        wishFetch();
    }, []); // 또는 [] 만 넣어도 됨

    console.log("wishList-------", wishList);


    return (
        <>
            <SearchBar search={search} setSearch={setSearch} handleSearch={handleSearch}/>
            <WishItem wishList={wishList}/>
            <Pagination paginationInfo={paginationInfo} onChangePageHandler={onChangePageHandler}/>
        </>
    );
};

export default WishListComponent;
