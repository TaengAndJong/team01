//전체선택, 개별선택 삭제, 장바구니버튼, 바로구매버튼, 찜목록 버튼 , 리뷰

import React, {useContext, useEffect, useState} from "react";
import Btn from "../../../util/reuseBtn.jsx";
import pathsData from "../../../assets/pathsData.jsx";
import { BookStateContext} from "../adminBookComponent.jsx";
import {useLocation} from "react-router-dom";

const AdminBookList = () => {
    const {bookdata} = useContext(BookStateContext);
    const [bookList, setBookList] = useState([]);
    const location = useLocation();

    //데이터를 부모컴포넌트로부터 받아 온다.
    const initFetch = async () => {
        try {
            // 서버로 응답 요청
            const response = await fetch("/api/admin/book/bookList", {
                method: "GET",
            });
            // 돌아온 응답 상태
            if (!response.ok) { // 응답 상태가 200아니면
                console.log(response.status)
                throw new Error("서버 응답 에러");
            }
            // 응답 성공시
            const addData = await response.json(); // 프라미스객체 (resolve) JSON형태로 파싱
            console.log("bookdata목록 get 요청 데이터 받아오기-----", addData);// 있음
            //부모로부터 받아온 데이터 초기값 도서목록에 갱신하기
            setBookList(addData);
            console.log("데이터 목록 갱신완료")
        } catch (e) {
            console.log("catch-Error", e); // 오류 처리
        }

    }//fetch end

    // bookdata가 존재할 때만 bookList 업데이트
    useEffect(() => {
        console.log("📚 목록페이지 여기 먼저 실행1?", bookdata);
        //1.비동기요청을 보낸다
         initFetch();
        console.log("📚 목록페이지 여기 먼저 실행2?", bookdata);
        setBookList(bookdata); // bookList 업데이트
        console.log("📚 목록페이지 여기 먼저 실행3?", bookdata);
        //3.응답에 데이터가 null, undefined이면 "데이터가 없습니다"반환
    }, [location.search,bookdata]);

    console.log("📚 최종 bookList", bookList);
    return(
        <>
            <table className="table">
                <caption className="sr-only">
                    등록된 도서상품 테이블
                </caption>
                <thead>
                <tr>
                    <th className="text-center">
                        {/*<input*/}
                        {/*    type="checkbox"*/}
                        {/*    id="selectAll"*/}
                        {/*    checked={isSelectAll}*/}
                        {/*    onChange={handleSelectAllChange}*/}
                        {/*    aria-checked={isSelectAll}*/}
                        {/*/>*/}
                        <input
                            type="checkbox"
                            id="selectAll"
                        />
                        <label htmlFor="selectAll">전체 선택</label>
                    </th>
                    <th className="text-center">No.</th>
                    <th className="text-center">이미지</th>
                    <th className="text-center">카테고리</th>
                    <th className="text-center">도서명</th>
                    <th className="text-center">설명</th>
                    <th className="text-center">저자</th>
                    <th className="text-center">가격</th>
                    <th className="text-center">발행일</th>
                    <th className="text-center">등록자</th>
                    <th className="text-center">등록일</th>
                    <th className="text-center">재고</th>
                </tr>
                </thead>

                <tbody>

                </tbody>

                  <tbody className="">
                  {/* undefined 와 데이터의 개수 검증*/}
                  { !bookList?.data || bookList.data.length === 0 ?(
                      <tr>
                          <td colSpan="12" className="text-center">데이터가 없습니다.</td>
                      </tr>
                  ):(
                      bookList.data.map((item,index) => (
                          <tr key={index}>
                      <td className="text-center">
                          <input
                              type="checkbox"
                              id={`item${index}`}

                              name={`item${index}`}
                          />
                          <label htmlFor="item1">{`항목${index}`}</label>
                      </td>
                      <td className="text-center" id={`bookId${index}`}>{item.bookId}</td>
                      <td className="text-center" id={`bookImg${index}`}>{item.bookImgPath}</td>
                      <td className="text-center" id={`bookCateNm${index}`}>{item.cateName}</td>
                      <td className="text-left" id={`bookNm${index}`}>{item.bookName}</td>
                      <td className="text-left" id={`bookDesc${index}`}>{item.bookDesc}</td>
                      <td className="text-center" id={`bookAuthor${index}`}>{item.author}</td>
                      <td className="text-center" id={`bookPrice${index}`}>{item.bookPrice}원</td>
                      <td className="text-center" id={`bookPublishDt${index}`}>{item.publishDate}</td>
                      <td className="text-center" id={`bookWriter${index}`}>{item.writer}</td>
                      <td className="text-center" id={`bookPublishDt${index}`}>{item.createDate}</td>
                      <td className="text-center" id={`bookStock${index}`}>{item.stock}</td>
                      </tr>
                    ))
                  )}

                  </tbody>


            </table>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <Btn className={"create btn btn-primary"} type={"button"} path={pathsData.page.adminBookCreate}
                     text="도서등록"/>
            </div>

        </>
    )
}

export default AdminBookList;