//전체선택, 개별선택 삭제, 장바구니버튼, 바로구매버튼, 찜목록 버튼 , 리뷰
import React, {useContext, useEffect, useState} from "react";
import {BookDispatchContext, BookStateContext} from "../bookComponent.jsx";
import "@assets/css/book/bookList.css";
import SearchBar from "./searchBar.jsx";
import BookItem from "./bookItem.jsx";
import Pagination from "@util/pagination.jsx";
import {PaginationContext} from "../../adminBook/adminBookComponent.jsx";



const BookList = () => {

    const bookdata = useContext(BookStateContext);
    const {paginationInfo,onChangePageHandler} = useContext(PaginationContext);
    const {onInit} = useContext(BookDispatchContext); // 사용할 함수 가져올때 전역설정이면 context 훅 불러와야함
    console.log("data------------??",bookdata) // 부모 컨텍스트로부터 받아온 데이터


    const [bookList, setBookList] = useState([]);
    const [search,setSearch] = useState({
        bookType: 'ALL',         // 전체 / 국내도서 / 국외도서
        searchType: 'bookName',  // bookName(도서명), author(저자)
        keyword: ''              // 검색어
    });
    console.log("search 상태관리",search);

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
            const response  = await fetch(`/api/book/bookList?${paramString}`, {
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
            onInit(data);
        }catch (e){
            console.log("검색실패",e);
        }
    }




// bookdata가 존재할 때만 bookList 업데이트
    useEffect(() => {
        //1.부모에서 받아온 데이터를 상태관리 함수에 갱신해줌
        if(bookdata){
            setBookList(bookdata);
        }
    },[bookdata])
    console.log("bookList--------",bookList);



    return (
        <>
            <div className="book-list">

                <SearchBar search={search} setSearch={setSearch} handleSearch={handleSearch}/>
                <BookItem bookList={bookList}/>
                {/*pagination*/}
                <Pagination paginationInfo={paginationInfo} onChangePageHandler={onChangePageHandler}/>
            </div>

        </>
    )
}

export default BookList;