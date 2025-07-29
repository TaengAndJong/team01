import React from "react";

const PayItem = ({books}) => {

    console.log("books",books);

    return (
        <>
            <ul className="cart-list">
                {books?.map((item) => (
                    <li key={item.cartId} className="cart-item mb-2">
                        <div className="item-inner d-flex card flex-row default-border position-relative p-4 mb-2 ">
                            <div className="card-header border-end rounded-4 overflow-hidden">
                                <div className="img-box">
                                    <div className="img-inner">
                                        <img className="img" src={`${item.book.bookImgList[0]}`} alt="노이미지"/>
                                    </div>
                                </div>
                            </div>
                            {/* 도서 정보*/}
                            <div className="bookInfo card-body">
                                <strong
                                    className="book-title title-dotted d-block">{item.book.bookName}</strong>
                                <ul className="ul bullet">
                                    <li className="li"><span
                                        className="tit">저자</span>{item.book.author}</li>
                                    <li className="li"><span
                                        className="tit">발행일</span>{item.book.publishDate}</li>
                                    <li className="li"><span
                                        className="tit">가격</span><em>{item.book.bookPrice}</em>원
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </li>
                ))}
            </ul>
        </>
    )
}

export default PayItem;