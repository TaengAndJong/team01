//전체선택, 개별선택 삭제, 장바구니버튼, 바로구매버튼, 찜목록 버튼 , 리뷰
import React, { useContext, useEffect, useState } from "react";
import {
  BookDispatchContext,
  BookStateContext,
  PaginationContext,
} from "../bookComponent.jsx";
import "@assets/css/book/bookList.css";
import SearchBar from "./searchBar.jsx";
import BookItem from "./bookItem.jsx";
import Pagination from "@util/pagination.jsx";
import { useAuth } from "@common/AuthContext.jsx";
import axios from "axios";

const BookList = () => {
  const bookdata = useContext(BookStateContext);
  const {
    paginationInfo,
    onChangePageHandler,
    search,
    setSearch,
    handleSearch,
  } = useContext(PaginationContext);

  //  const {onInit} = useContext(BookDispatchContext); // 사용할 함수 가져올때 전역설정이면 context 훅 불러와야함
  const [bookList, setBookList] = useState([]);
  const [wishIds, setWishIds] = useState([]); //찜목록 아이디들 상태관리변수
  const { isAuthenticated } = useAuth();


  //찜목록에 Y 인 bookId들만 비동기요청 조회
  const wishBookIds = async () => {
    try {
      //서버로 비동기 요청
      const response = await axios.get(`/api/mypage/wishlist/selectWishIds`);
    
      //조회된 도서아이디들 값 wishIds 변수에 저장
      setWishIds(response.data.map(Number));
    } catch (e) {
        //에러처리필요
      console.log("비동기요청 실패", e);
    }
  };

  // bookdata가 존재할 때만 bookList 업데이트
  useEffect(() => {
    //1.부모에서 받아온 데이터를 상태관리 함수에 갱신해줌
    if (bookdata) {
      setBookList(bookdata);
    }
  }, [bookdata]);



  //로그 아웃 시 위시 리스트 초기화
  useEffect(() => {
    if (isAuthenticated) {
      // 로그인 상태 → 서버에서 찜 목록 조회
      wishBookIds();
    } else {
      // 로그아웃 상태 → 찜 목록 초기화
      setWishIds([]);
    }
  }, [isAuthenticated]);
  return (
    <>
      <div className="book-list">
        <SearchBar
          search={search}
          setSearch={setSearch}
          handleSearch={handleSearch}
        />
        {bookList?.length > 0 ? (
          <BookItem
            bookList={bookList}
            wishIds={wishIds}
            setWishIds={setWishIds}
          />
        ) : (
          <div className="book-list-inner overflow-hidden">
            <ul className="book-item-list clearfix w-100">
              <li className="book-item text-center w-100 m-0">
                <span className="fw-bold"> 조회된 데이터가 없습니다.</span>
              </li>
            </ul>
          </div>
        )}

        {/*pagination*/}
        <Pagination
          paginationInfo={paginationInfo}
          onChangePageHandler={onChangePageHandler}
        />
      </div>
    </>
  );
};

export default BookList;
