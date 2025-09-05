import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";

import Btn from "../../../util/reuseBtn.jsx";
import pathsData from "../../../assets/pathsData.jsx";
import BookSlide from "../../common/bookSlide.jsx";
import BuySelectedBtn from "./BuySelectedBtn.jsx";
import AddCartBtn from "./addCartBtn.jsx";
import BookCount from "./bookCount.jsx";


const BookDetail = () => {
    //useParams()로 url의 파라미터로 넘어온 bookId 가져오기
    const {bookId} = useParams();
    console.log("클라이언드 도서 상세----bookId",bookId);
    //detail 상태관리변수  ==> 초기값은 [](배열)로 해야 map함수를 바로 사용할 수 있음!
    const [bookDetail, setBookDetail] = useState([]);
    //구매할 도서 수량 상태관리 객체 ==> 아이디별로 도서수량 저장하기 위해 {} 빈 객체로 초기값 설정
    const [bookCount,setBookCount]=useState({});

    //console.log("북아이템 자식 컴포넌트 wishIds",wishIds);
    console.log("북아이템 자식 컴포넌트 bookCount",bookCount);

    //해당 bookId에 대한 비동기 fetch 요청을 보내어 서버로부터 데이터를 받아온다
    const fetchBookDetails = async () => {
        //try,catch를 사용하는 이유 => 코드실행 중 발생하는 에러로 인해 앱이 멈추는 상황을 안전하게 처리하기위해서!
        try{
            const response = await fetch(`/api/book/bookDetail/${bookId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if(!response.ok){
                throw new Error(response.statusText);
            }

            const data = await response.json();
            console.log("bookDetail-----data", data);
            setBookDetail(data.bookVO);

        }catch(e){
            console.log("catch-Error", err);
        }

    }

    useEffect(() => {
        fetchBookDetails();
        console.log("상세페이지 렌더링")
    },[]) // 렌더링(마운트) 시 한번 실행

    console.log("bookDetail--------", bookDetail);

    return (
        <>
            <div className="bookDetail">

                <div className="box slide">
                    <div className="card horizontal">
                        <div className="card-header">
                            <BookSlide slideData={bookDetail}/>
                        </div>
                        <div className="bookInfo card-body">
                            <h3 className="book-title title-dotted">{bookDetail.bookName}</h3>
                            <ul className="ul bullet">
                                <li className="li"><span className="tit">저자</span>{bookDetail.author}</li>
                                <li className="li"><span className="tit">발행일</span>{bookDetail.publishDate}</li>
                                <li className="li"><span className="tit">가격</span>{bookDetail.bookPrice}<span>원</span>
                                </li>
                                {/*할인적용할건지 */}
                                {/*<li className="li"><span className="tit">할인가</span><span>원</span>*/}
                                {/*</li>*/}
                            </ul>
                            {/* 수량 및 액션 버튼 영역 */}

                            <div className="btn d-flex">
                                {/*수량*/}
                                <BookCount bookId={bookDetail.bookId} bookCount={bookCount} setBookCount={setBookCount} />
                                {/*장바구니추가*/}
                                <AddCartBtn bookId={bookDetail.bookId} bookCount={bookCount[bookDetail.bookId] ?? 1}  />
                                {/*바로구매*/}
                                <BuySelectedBtn  type={"buyNow"}  book={ {...bookDetail, quantity: bookCount[bookDetail.bookId] ?? 1} } />
                            </div>
                            {/*bookDesc end */}
                        </div>
                    </div>

                </div>


                <div className="box">
                    <h4 className="h4 title-dotted">도서설명</h4>
                    {bookDetail.bookDesc}
                </div>
                {/*bookDetail end */}

                <div className="d-grid gap-2 d-md-flex justify-content-md-between mt-4">
                    <Btn className={"modify btn btn-secondary"} type={"button"} path={pathsData.page.book}
                         text="목록"/>
                    <Btn className={"modify btn btn-primary"} type={"button"}
                         path={`${pathsData.page.adminBookModify}/${bookId}`}
                         text="수정"/>
                </div>

            </div>

        </>
    )
}

export default BookDetail;