import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import AddCartBtn from "../../cart/components/addCartBtn.jsx";
import BuySelectedBtn from "./BuySelectedBtn.jsx";

const BookItem = ({bookList,wishIds,setWishIds}) =>{

    //서버에서 클라이언트까지 응답이 도달할 때까지의 상태관리
    const [isLoading, setIsLoading] = useState(false);
    //구매할 도서 수량 상태관리 객체 ==> 아이디별로 도서수량 저장하기 위해 {} 빈 객체로 초기값 설정
    const [bookCount,setBookCount]=useState(1);
 

    // 장바구니에 담을 도서 수량버튼 관리 핸들러 ==> 고려사항 각각의 도서에 대한 개별 수량 구분 필요
    const bookCountChangHandler=(bookId,e)=>{
    
        console.log("eventTarget",e.target);
        console.log("eventTarget",e.target.name);
    
        const bookIdCount = bookCount[bookId] || 1;


        //button name으로 plus , minus 구분
        //최소 수량이 1보다 작음 방지 필요, 최대 개수는 100개까지 제한
        const btnName= e.target.name;
        switch(btnName){
            case "minus":
                if (bookIdCount > 1) {
                    console.log("minus");
                    setBookCount(prev => ({
                        ...prev,
                        [bookId]:parseInt(bookIdCount,10) - 1 // 아이디별 도서 수량 반영
                    }));
                } else {
                    alert("최소 수량은 1개입니다.");
                }
                break;//input 숫자 감소 >> 1이 최소값, 내려가려고 하면 알림 모달 필요
            case "plus":
               //input 숫자 증가 >> 제한 수량 100까지 >> 100 넘으면 알림 모달 필요
                if (bookIdCount < 100) {
                    console.log("plus");
                    setBookCount(prev => ({
                        ...prev,
                        [bookId]:parseInt(bookIdCount,10) + 1
                    }))
                } else {
                    alert("최대 수량은 100개까지입니다.");
                }
                break;
            default:
                //예외처리
                console.warn("정의되지 않은 버튼 name입니다:", btnName);break;
    
        }

        console.log("bookCountChangHandler의  bookIdCount---11",bookIdCount);
    }
    
    // 도서 수량 입력 input 관리 핸들러
    const bookCountInputHandler=(bookId,e)=>{
        //input[type=text]로 들어오는 value는 String 타입으로 들어오기 때문에 숫자로 검증필요
        const val = e.target.value;
        console.log("bookCountInput",e.target.value);
        //숫자인지 검증필요 숫자(0~9)로 이루어진 문자열(빈 문자열도 포함)을 허용 ==> 문자가 섞이거나 음수(-1) 같은 값은 차단
        if (!/^\d*$/.test(val)){
            // 숫자만 입력 알림 필요
            return;
        }
        //값을 지울 경우,  nan 값 방지
        if (val === "") {
            setBookCount(prev=>({
                ...prev,
                [bookId]:"",// 빈 문자열일 경우
            }));
            return;
        }
    
        const inputNum = parseInt(val, 10); // 10진수로 파싱
        //입력값의 기본값은 1이고 1미만 100초과는 안됨
        if(inputNum < 1){
            alert("최소 수량은 1개입니다.");
            return; //종료
        }
    
        if(inputNum>100){
            alert("최대 수량은 100개입니다.");
            return; //종료
        }
        // 1 초과 ~ 100 이하 (정상 범위) 값 갱신
        setBookCount(prev=>({
            ...prev,
            [bookId]:inputNum,// 10진수로 파싱된 도서수량
        }));


        console.log("bookCountInputHandler 의 bookCount ----222",bookCount);
    }

    console.log("전역 bookCount---------3",bookCount);



    //찜목록 비동기 fetch 요청
    const wishFetch = async(bookId) =>{
        
        // bookId는 쿼리스트링보다 body 에 담아주는게 더 나음
        const UrlSearchParams = new URLSearchParams();
        UrlSearchParams.append("bookId", bookId);
        console.log("bookId wishList",bookId);
        //경로에 bookId 담아서 보내기
        const response = await fetch(`/api/mypage/wishlist/save?${UrlSearchParams.toString()}`, {
            method: "POST"
        });
      
        if(!response.ok){
            console.log("비동기 요청 실패")
            throw Error(response.statusText);
        }

        // wishIds 값 재설정할 때에 이전 상태값에 대해서 bookId가 있는 지 확인후 동일한 bookId 이면 필터링해서 새배열반환, 없으면 기존배열을 복사 후 bookId 추가
        setWishIds((prev) =>
            prev.includes(bookId) //bookId를 포함하고 있다면
                ? prev.filter((id) => id !== bookId) // 제거
                : [...prev, bookId] // 없으면 추가
        );
    }

    //찜목록 핸들러
    const wishHandler=(bookId)=>{
        // 클릭하면 selected 클래스 추가,
        //찜버튼 누르면 전송 되기 전까지 disable 되게  해야하나?
        if (isLoading) return;      // 클라이언트가 서버로 정보 요청 중이면 중단
        setIsLoading(true);         // 클라이언트가 서버로 요청 중

        //bookId를 받아서 비동기요청, 컨트롤러로 전송
        try{
            console.log("찜목록 페치요청 보내는 듕")
            wishFetch(bookId);

        }catch(e){
            console.error("찜 토글 실패", e);
        } finally {
            setIsLoading(false);      // 응답 완료되면 다시 클릭 가능하게 설정
        }
    }


    console.log("북아이템 자식 컴포넌트 wishIds",wishIds);

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

                                <button type="button" className={`submit btn me-2 icon wish ${wishIds.includes(book.bookId) ? "selected" : ""}`} onClick={()=>wishHandler(book.bookId)}>
                                    <span className="sr-only">위시리스트에 담기</span>
                                </button>
                                {book.stock === 0 ?(
                                    <p>품절</p>
                                ):(
                                    <>
                                        {/*수량*/}
                                        <div className="count w-25">
                                            <div className="count-inner d-inline-flex mx-2">
                                                <button className="btn btn-light minus" name="minus" type="button" onClick={(e)=>bookCountChangHandler(book.bookId,e)}>
                                                    -
                                                    <span className="sr-only">도서상품개수 하나씩 감소</span>
                                                </button>
                                                {/* input value 상태관리로 관리필요 */}
                                                <input className="form-control" name="bookCountInput" type="text" value={bookCount[book.bookId] ?? 1} min={1}
                                                       title="수량" autoComplete="off" onChange={(e)=> bookCountInputHandler(book.bookId,e)}/>
                                                <button className="btn btn-light plus" name="plus" type="button" onClick={(e)=>bookCountChangHandler(book.bookId,e)}>
                                                    +
                                                    <span className="sr-only">도서상품개수 하나씩 증가</span>
                                                </button>
                                            </div>
                                        </div>
                                        {/*수량*/}
                                        <AddCartBtn bookId={book.bookId} bookCount={bookCount[book.bookId] ?? 1}  />
                                        <BuySelectedBtn  book={book}/>
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