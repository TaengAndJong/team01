import React, {useContext, useEffect} from "react";
import {Link} from "react-router-dom";
import {PaginationContext, WishDispatchContext} from "./WishComponent.jsx";


const WishItem = ({wishList}) => {
    // 컨텍스트에 value가 하나면 구조분해할당 구조 사용할 필요가 없음, value가 여러개 넘어 올 때 사용해야 함 (에러 유발 주의)
    const onInit = useContext(WishDispatchContext);
    const {paginationInfo,setPaginationInfo} = useContext(PaginationContext);

    console.log("wishItems=-----111",wishList);
    console.log("paginationInfo currentPage",paginationInfo.currentPage);


    //찜해제 비동기요청
    const deleteWishFetch = async (bookId) => {

        const UrlSearchParams = new URLSearchParams();
        UrlSearchParams.append("bookId", bookId);
        UrlSearchParams.append("currentPage", paginationInfo.currentPage);

        console.log("deleteWishFetch---bookId",bookId);

        const response = await fetch(`/api/mypage/wishlist/save?${UrlSearchParams.toString()}`, {
            method: "POST",
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const data = await response.json();
        console.log("wishList-------찜상태 변경", data);
        //변경된 bookId 넘겨야함
        const {currentPage,userWishList,pageSize,totalPages,totalRecord} = data;
        console.log("currentPage",currentPage);
        console.log("pageSize",pageSize);
        console.log("totalPages",totalPages);
        console.log("totalRecord",totalRecord);
        console.log("userWishList",userWishList);
        onInit(userWishList);
        setPaginationInfo({
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            totalRecord:totalRecord,
        });

    };
    console.log("wishList-------찜상태 변경2", wishList);


    //찜해제 핸들러
    const deleteWishHandler = (bookId) =>{
        //비동기 요청
        deleteWishFetch(bookId);
    }

    useEffect(() => {

        console.log("업데이트된 찜목록:-- wishItem3", wishList);

    },[wishList]);

    return (
        <>
            <div className="book-list-inner wishList overflow-hidden mt-4">
                {wishList && (() => {
                    const filteredList = wishList.filter(item => item.wishStatus === 'Y');
                    return filteredList.length > 0 ? (
                        <ul className="book-item-list clearfix">
                            {filteredList.map((item, index) => (
                                <li
                                    key={index}
                                    className="book-item mb-3 mx-2 default-border overflow-hidden p-4 float-start"
                                >
                                    <Link
                                        to={`/book/bookDetail/${item.bookVO.bookId}`}
                                        className="book-link d-block"
                                        id={item.bookVO.bookId}
                                    >
                                        <span className="wishId">{item.wishId}</span>
                                        <div
                                            className="item-inner book-img card flex-row position-relative justify-content-center">
                                            <div className="card-header border-end rounded-4 overflow-hidden">
                                                <div className="img-box">
                                                    <div className="img-inner">
                                                        <img
                                                            className="img"
                                                            src={item.bookVO.bookImgList[0]}
                                                            alt="노이미지"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bookInfo card-body mt-4">
                                            <strong className="book-title title-dotted d-block">
                                                {item.bookVO.bookName}
                                            </strong>
                                            <ul className="ul bullet">
                                                <li className="li">
                                                    <span className="tit">저자</span>{item.bookVO.author}
                                                </li>
                                                <li className="li">
                                                    <span className="tit">발행일</span>{item.bookVO.publishDate}
                                                </li>
                                                <li className="li">
                                                    <span className="tit">가격</span><em>{item.bookVO.bookPrice}</em>원
                                                </li>
                                            </ul>
                                        </div>
                                    </Link>

                                    {/* 수량 및 액션 버튼 영역 */}
                                    <div className="item-inner d-flex align-items-center justify-content-end mt-4">
                                        <button
                                            type="button"
                                            aria-label="찜하기"
                                            className="submit btn btn-danger me-2 wish-btn"
                                            onClick={() => deleteWishHandler(item.bookVO.bookId)}
                                        >
                                            찜 해제
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="장바구니담기"
                                            className="submit btn btn-primary me-2 wish-btn"
                                        >
                                            장바구니 담기
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center mt-5">찜한 도서목록이 없습니다.</div>
                    );
                })()}
            </div>

        </>

    );
}

export default WishItem;