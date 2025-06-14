import React from "react";
import {Link} from "react-router-dom";


const WishItem = ({wishList}) => {
    console.log("wishListItem",wishList);

    return (
        <>
            <div className="book-list-inner wishList overflow-hidden mt-4">
                {wishList && (
                    <ul className="book-item-list clearfix">
                        {wishList?.map((item,index)=>(
                            <li key={index}
                                className="book-item mb-3 mx-2 default-border overflow-hidden p-4 float-start">
                                <Link to={`/book/bookDetail/${item.bookVO.bookId}`} className="book-link d-block"
                                      id={item.bookVO.bookId}>
                                    <span className="wishId">{item.wishId}</span>
                                    <div className="item-inner book-img card flex-row  position-relative justify-content-center">
                                        <div className="card-header border-end rounded-4 overflow-hidden">
                                            <div className="img-box">
                                                <div className="img-inner">
                                                    <img className="img" src={item.bookVO.bookImgList[0]}
                                                         alt="노이미지"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bookInfo card-body mt-4">
                                        <strong
                                            className="book-title title-dotted d-block">{item.bookVO.bookName}</strong>
                                        <ul className="ul bullet">
                                            <li className="li"><span className="tit">저자</span>{item.bookVO.author}</li>
                                            <li className="li"><span className="tit">발행일</span>{item.bookVO.publishDate}
                                            </li>
                                            <li className="li"><span
                                                className="tit">가격</span><em>{item.bookVO.bookPrice}</em>원
                                            </li>
                                        </ul>
                                    </div>
                                </Link>
                                {/* 수량 및 액션 버튼 영역 */}
                                <div className="item-inner d-flex align-items-center justify-content-end mt-4">
                                    {/*찜목록에서 N 으로 값 변경하는 핸들러 작성하기 */}
                                    <button type="button" aria-label="찜하기"
                                            className="submit btn btn-danger me-2 wish-btn">
                                        찜 해제
                                    </button>
                                    {/*장바구니 insert 쿼리 요청  비동기 post요청 필요*/}
                                    <button type="button" aria-label="장바구니담기"
                                            className="submit btn btn-primary me-2 wish-btn"
                                            >
                                     장바구니 담기
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>

    );
}

export default WishItem;