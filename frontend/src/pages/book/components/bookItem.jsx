import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import AddCartBtn from "../../cart/components/addCartBtn.jsx";
import BuySelectedBtn from "./BuySelectedBtn.jsx";
import BookCount from "./bookCount.jsx";
import WishBtn from "./wishBtn.jsx";

const BookItem = ({bookList,wishIds,setWishIds}) =>{


    //구매할 도서 수량 상태관리 객체 ==> 아이디별로 도서수량 저장하기 위해 {} 빈 객체로 초기값 설정
    const [bookCount,setBookCount]=useState({});

    //console.log("북아이템 자식 컴포넌트 wishIds",wishIds);
    console.log("북아이템 자식 컴포넌트 bookCount",bookCount);

    return (
        <div className="book-list-inner overflow-hidden">
            {bookList && (
                <ul className="book-item-list clearfix">
                    {bookList?.map((book, index) => (
                        <li key={index} className="book-item mb-3 mx-2 \overflow-hidden p-4 float-start">
                            <Link to={`/book/bookDetail/${book.bookId}`} className="book-link d-block" id={book.bookId}>
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

                                <WishBtn wishIds={wishIds} setWishIds={setWishIds} bookId={book.bookId} />
                                {book.stock === 0 ?(
                                    <p>품절</p>
                                ):(
                                    <>
                                        {/*수량*/}
                                        <BookCount bookId={book.bookId} bookCount={bookCount} setBookCount={setBookCount} />
                                        {/*장바구니추가*/}
                                        <AddCartBtn bookId={book.bookId} bookCount={bookCount[book.bookId] ?? 1}  />
                                        {/*바로구매*/}
                                        <BuySelectedBtn  type={"buyNow"}  book={ {...book, quantity: bookCount[book.bookId] ?? 1} } />
                                    </>
                                    )}
                            </div>

                        </li>

                    ))}

                </ul>
            )}

        </div>
    );
}

export default BookItem;