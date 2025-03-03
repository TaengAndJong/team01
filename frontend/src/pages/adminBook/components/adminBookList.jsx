//전체선택, 개별선택 삭제, 장바구니버튼, 바로구매버튼, 찜목록 버튼 , 리뷰

import React, {useContext, useEffect, useState} from "react";
import Btn from "../../../util/reuseBtn.jsx";
import pathsData from "../../../assets/pathsData.jsx";
import {BookStateContext} from "../adminBookComponent.jsx";

const AdminBookList = () => {

    const bookdata = useContext(BookStateContext);
    const [bookList, setBookList] = useState([]);
    console.log("📚 최종 bookdata", bookdata);
    // bookdata가 존재할 때만 bookList 업데이트
    useEffect(() => {
        if (bookdata) {
            console.log("🔄 bookdata 변경 감지됨", bookdata);
            setBookList(bookdata);
        }
    }, [bookdata]);

    console.log("📚 최종 bookList", bookList);
   // if (bookList.length === 0) return <div>📚 도서 목록을 불러오는 중...</div>;


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
                            <label htmlFor="item1">항목 1</label>
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