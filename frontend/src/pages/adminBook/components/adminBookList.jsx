//전체선택, 개별선택 삭제, 장바구니버튼, 바로구매버튼, 찜목록 버튼 , 리뷰

import React, {useContext, useEffect, useState} from "react";
import Btn from "../../../util/reuseBtn.jsx";
import pathsData from "../../../assets/pathsData.jsx";
import {BookStateContext} from "../adminBookComponent.jsx";
import {useLocation} from "react-router-dom";

const AdminBookList = () => {

    //context API로 받아 온 함수나, 상태변수 등을 객체로 받아와 구조분해할당 해야함.
    const {bookdata,initFetch} = useContext(BookStateContext);
    const [bookList, setBookList] = useState([]);
    const location = useLocation();

    console.log("📚 최종 bookdata", bookdata);
    // bookdata가 존재할 때만 bookList 업데이트
    useEffect(() => {
        //1.비동기요청을 보낸다
        initFetch();
        // 2. 응답에 대한 데이터가 있다면 bookList 갱신하여 반영
        if (bookdata !== null && bookdata !== undefined) {
            console.log("🔄 bookdata 변경 감지됨", bookdata);
            setBookList(bookdata); // bookList 업데이트
        } else {
            // 3. 응답에 데이터가 null, undefined이면 "데이터가 없습니다" 반환
            console.log("📭 데이터가 없습니다");
        }
        //3.응답에 데이터가 null, undefined이면 "데이터가 없습니다"반환
    }, [location.search]);

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
                {bookList?.data?.map((item,index) => (
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
                ))}
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