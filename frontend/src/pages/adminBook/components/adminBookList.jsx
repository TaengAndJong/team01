//전체선택, 개별선택 삭제, 장바구니버튼, 바로구매버튼, 찜목록 버튼 , 리뷰

import React, {useContext, useEffect, useState} from "react";
import Btn from "../../../util/reuseBtn.jsx";
import pathsData from "../../../assets/pathsData.jsx";
import { BookStateContext} from "../adminBookComponent.jsx";
import {Link, useLocation} from "react-router-dom";

const AdminBookList = () => {
    const bookdata = useContext(BookStateContext);
    const [bookList, setBookList] = useState([]);

    //데이터를 부모컴포넌트로부터 받아 온다.
    console.log("bookData---관리자 목록",bookdata);
    // bookdata가 존재할 때만 bookList 업데이트
    useEffect(() => {
        //1.부모에서 받아온 데이터를 상태관리 함수에 갱신해줌
        if(bookdata){
            setBookList(bookdata);
        }

    }, [bookdata]);

    console.log("bookList--------------",bookList)

    return(
        <>

            <table className="table table-custom">
                <caption className="sr-only">
                    등록된 도서상품 테이블
                </caption>
                <thead>
                <tr>
                    <th scope="col" className="text-center">
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
                    <th scope="col" className="text-center">No.</th>
                    <th scope="col" className="text-center">이미지</th>
                    <th scope="col" className="text-center">카테고리</th>
                    <th scope="col" className="text-center">도서명</th>
                    {/*<th className="text-center">설명</th>*/}
                    <th scope="col" className="text-center">저자</th>
                    <th scope="col" className="text-center">가격</th>
                    <th scope="col" className="text-center">발행일</th>
                    <th scope="col" className="text-center">등록자</th>
                    <th scope="col" className="text-center">등록일</th>
                    <th scope="col" className="text-center">재고</th>
                </tr>
                </thead>

                <tbody className="">
                {/* undefined 와 데이터의 개수 검증*/}
                {!bookList || bookList?.length === 0 ? (
                    <tr className="">
                        <td colSpan="12" className="text-center">데이터가 없습니다.</td>
                    </tr>
                ) : (
                    bookList?.map((item, index) => (

                        <tr key={index} className="table-light border-bottom">
                            <td className="text-center">
                                <input
                                    type="checkbox"
                                    id={`item${index}`}
                                    name={`item${index}`}
                                />
                                <label htmlFor="item1">{`항목${index+1}`}</label>
                            </td>
                            <td className="text-center " id={`bookId${index}`}>{item.bookId}</td>

                            <td className="text-center" id={`bookImg${index}`}>
                                <div className="imgbox">
                                    <img src={`${item.bookImgList[0]}`} alt={`${item.bookName}도서 이미지`}/>
                                </div>
                            </td>

                            <td className="text-left" id={`bookCateNm${index}`}>{item.bookCateNm}</td>
                            <td className="text-left" id={`bookNm${index}`}>
                                <Link to={`/admin/book/bookDetail/${item.bookId}`} title={`${item.bookName} 상세페이지로 이동`}>{item.bookName}</Link>
                            </td>
                            {/*<td className="text-left" id={`bookDesc${index}`}>{item.bookDesc}</td>*/}
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