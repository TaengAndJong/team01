import {Link} from "react-router-dom";
import React from "react";

const BookItem = ({bookList}) =>{

    return (
        <div className="book-list-inner overflow-hidden mt-4">
            {bookList && (
                <ul className="book-item-list clearfix">
                    {bookList?.map((book, index) => (
                        <li key={index} className="book-item mb-3 mx-2 default-border overflow-hidden p-4 float-start">
                            <Link to={`/book/bookDetail/${book.bookId}`} className="book-link">
                                <div className="item-inner d-flex card flex-row  position-relative">
                                    <div className="card-header border-end rounded-4 overflow-hidden">
                                        <div className="img-box">
                                            <div className="img-inner">
                                                <img className="img" src={book.bookImgList[0]}
                                                     alt="노이미지"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bookInfo card-body">
                                        <strong className="book-title title-dotted d-block">{book.bookName}</strong>
                                        <ul className="ul bullet">
                                            <li className="li"><span className="tit">저자</span>{book.author}</li>
                                            <li className="li"><span className="tit">발행일</span>{book.publishDate}</li>
                                            {/*<li className="li"><span className="tit">출판사</span>{book.publishDate}</li>*/}
                                            <li className="li"><span className="tit">가격</span><em>{book.bookPrice}</em>원
                                            </li>
                                            <li className="li"><span className="tit">배송비</span><em>2,000</em>원
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </Link>
                            {/* 수량 및 액션 버튼 영역 */}
                            <div className="item-inner d-flex align-items-center justify-content-end mt-4">
                                {/*수량*/}
                                <div className="count w-25">
                                    <div className="count-inner d-inline-flex">
                                        <button className="btn btn-light minus" type="button">
                                            -
                                            <span className="sr-only">도서상품개수 하나씩 감소</span>
                                        </button>
                                        {/* input value 상태관리로 관리필요 */}
                                        <input className="form-control" type="text" value={""} min={1}
                                               title="수량" autoComplete="off"/>
                                        <button className="btn btn-light plus" type="button">
                                            +
                                            <span className="sr-only">도서상품개수 하나씩 증가</span>
                                        </button>
                                    </div>
                                </div>
                                {/*수량*/}

                                <button type="submit" aria-label="찜하기"
                                        className="submit btn btn-danger me-2">찜
                                </button>
                                <button type="submit" aria-label="장바구니"
                                        className="submit btn btn-primary me-2">장바구니
                                </button>
                                <button type="submit" aria-label="선택구매"
                                        className="submit btn btn-secondary">선택구매
                                </button>
                            </div>

                        </li>

                    ))}

                </ul>
            )}

        </div>
    );
}

export default BookItem;