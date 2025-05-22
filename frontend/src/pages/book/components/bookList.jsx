//전체선택, 개별선택 삭제, 장바구니버튼, 바로구매버튼, 찜목록 버튼 , 리뷰
import React, {useContext, useEffect, useState} from "react";
import {BookStateContext} from "../bookComponent.jsx";
import "@assets/css/book/bookList.css";
import {Link, useParams} from "react-router-dom";
import SearchBar from "./searchBar.jsx";
import BookItem from "./bookItem.jsx";
import Pagination from "@util/pagination.jsx";



const BookList = () => {

    const data = useContext(BookStateContext);
    console.log("data------------??",data) // 부모 컨텍스트로부터 받아온 데이터


    const [bookList, setBookList] = useState([]);

    useEffect(() => {
        if(data){
            setBookList(data);
        }
    })

    console.log("bookList 자식컴포넌트------------------",bookList);

    return (
        <>
            <div className="book-list">
                {/*<SearchBar search={search} setSearch={setSearch} handleSearch={handleSearch}/>*/}
                <SearchBar/>
                <BookItem bookList={bookList}/>
                {/*  페이지네이션 */}
                <Pagination paginationInfo={""} onChangePageHandler={""}/>
            </div>

        </>
    )
}

export default BookList;