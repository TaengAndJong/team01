import {Link, useNavigate} from "react-router-dom";
import React, {useRef, useState} from "react";
import AddCartBtn from "@pages/book/components/addCartBtn.jsx";
import BuySelectedBtn from "./BuySelectedBtn.jsx";
import BookCount from "./bookCount.jsx";
import WishBtn from "./wishBtn.jsx";
import axios from "axios";
import {useAuth} from "@common/AuthContext.jsx";
import ImgBaseUrl from "@/util/imgBaseUrl";

/*
* 1) 조회에 대한 서버요청 줄이기 위한 조회 및 중복조회  처리
*
* */


const BookItem = ({bookList,wishIds,setWishIds}) =>{

    //구매할 도서 수량 상태관리 객체 ==> 아이디별로 도서수량 저장하기 위해 {} 빈 객체로 초기값 설정
    const [bookCount,setBookCount]=useState({});
    const viewBookRef = useRef(new Set());// 세션 내 중복 클릭 방지
    const navigate = useNavigate();
    const userData = useAuth(); // 로그인 인증 정보

    //console.log("북아이템 자식 컴포넌트 wishIds",wishIds);
   // console.log("북아이템 자식 컴포넌트 bookCount",bookCount);
  console.log("북아이템 자식 컴포넌트 bookList",bookList);

    //로그인 정보가 있을경우

    //상세페이지로 이동시 link 태그 ( a 태그 ) 로 사용자가 조회한 bookId 서버로 전송하는 핸들러
    const viewBookFetch = async(e, bookId) => {
        e.preventDefault();// link 태그 이동이벤트 방지 ==> 이벤트가 발생하면 비동기요청이 처리되지 않을 수 있음

       //서버로 전송된 도서, 로그인 상태 여부
        if(viewBookRef.current.has(bookId) || !userData.isAuthenticated) {
            //서버전송 안하고 상세페이지로 이동
            navigate(`/book/bookDetail/${bookId}`);
            return; // 종료
        }
        //없는 bookId 이면 ref에 추가
        viewBookRef.current.add(bookId);
        //서버로 booId전송
        //formData 또는 쿼리스트링일 때만 RequestParam, jSON boody는 RequestBody
        try{
            const response = await axios.post("/api/viewBook",{bookId});
          //  console.log("도서조회시 도서 아이디 전송에 대한 응답",response);

        }catch(error){
            console.log("조회된 도서 Id 전송 에러 ", error);

        }finally{//최종적으로 실행 ==> 해당도서의 상세페이지로 이동
            console.log("상세페이지로 이동 : ",bookId);
            navigate(`/book/bookDetail/${bookId}`);
        }

    }


    const recomTypeMap = {
        NORMAL: { recomType: "normal", label: "일반" },
        RECOMMEND: { recomType: "recom", label: "추천" },
        POPULAR: { recomType: "popular", label: "인기" },
    };

    const recomTultip = (status) => {
        console.log(
            `status : ${status} , recomtype : ${recomTypeMap[status]?.recomType},label: ${recomTypeMap[status]?.label}`
        );

        return (
            <span className={`tultip d-inline-flex ${recomTypeMap[status]?.recomType}`}>
        {recomTypeMap[status]?.label}
      </span>
        );
    };

    const saleStatus=(status)=>{
        switch (status) {
            case "판매중": return (<span className="tultip d-inline-flex">{status}</span>);
            case "미판매": return (<span className="tultip d-inline-flex popular">{status}</span>);
            case "단종": return (<span className="tultip d-inline-flex complete">{status}</span>);
            default:return "판매상태 알수없음";
        }
    }



    return (
        <div className="book-list-inner overflow-hidden">
            {bookList && (
                <ul className="book-item-list clearfix d-flex flex-wrap">
                    {bookList?.map((book, index) => (
                        <li key={index} className="book-item mb-3 mx-2 overflow-hidden justify-content-between">
                            <Link to={`/book/bookDetail/${book.bookId}`} className="book-link d-block" id={book.bookId} onClick={(e)=>viewBookFetch(e,book.bookId)}>
                                <div className="item-inner d-flex card flex-row  position-relative">
                                    <div className="card-header border-end rounded-4 overflow-hidden">
                                        <div className="img-box">
                                            <div className="img-inner">
                                                <img className="img" src={ImgBaseUrl(book.bookImgList[0])}
                                                     alt="노이미지"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bookInfo card-body">
                                        <strong className="book-title title-dotted d-block">
                                            {recomTultip(book.recomType)}
                                            {saleStatus(book.saleStatus)}
                                            <span>{book.bookName}</span>
                                        </strong>
                                        <ul className="ul bullet">
                                            <li className="li"><span className="tit fw-bold">저자</span>{book.author}</li>
                                            <li className="li"><span className="tit fw-bold">발행일</span>{book.publishDate}</li>
                                            {/*<li className="li"><span className="tit">출판사</span>{book.publishDate}</li>*/}
                                            <li className="li"><span className="tit fw-bold">가격</span><span>{book.bookPrice}</span>원
                                            </li>
                                            <li className="li"><span className="tit fw-bold">배송비</span><span>2,000</span>원
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
                                        <AddCartBtn bookId={book.bookId} quantity={bookCount[book.bookId] ?? 1}  />
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