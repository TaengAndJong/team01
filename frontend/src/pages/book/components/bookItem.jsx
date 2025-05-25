import {Link} from "react-router-dom";
import React, {useState} from "react";

const BookItem = ({bookList}) =>{


//장바구니 버튼 클릭 시 상태관리 객체
const [addBook,setAddBook]= useState([]);
//구매할 도서 수량 상태관리 객체
const [bookCount,setBookCount]=useState(1);
// 장바구니에 담을 도서 수량버튼 관리 핸들러
const bookCountChangHandler=(e)=>{
    //button name으로 plus , minus 구분
    //최소 수량이 1보다 작음 방지 필요, 최대 개수는 100개까지 제한
    console.log("eventTarget",e.target);
    console.log("eventTarget",e.target.name);
    const btnName= e.target.name;
    switch(btnName){
        case "minus":
            if (bookCount > 1) {

                console.log("minus");
                setBookCount(parseInt(bookCount,10) - 1);
            } else {
                alert("최소 수량은 1개입니다.");
            }
            break;//input 숫자 감소 >> 1이 최소값, 내려가려고 하면 알림 모달 필요
        case "plus":
           //input 숫자 증가 >> 제한 수량 100까지 >> 100 넘으면 알림 모달 필요
            if (bookCount < 100) {
                console.log("plus");
                setBookCount(parseInt(bookCount,10) + 1);
            } else {
                alert("최대 수량은 100개까지입니다.");
            }
            break;
        default: 
            console.log("기본");
    }
}
// 도서 수량 입력 input 관리 핸들러
const bookCountInputHandler=(e)=>{
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
        setBookCount("");
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
    setBookCount(val);
}


//장밥구니 컨트롤러로 전송할 fetch 함수



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
                                        <button className="btn btn-light minus" name="minus" type="button" onClick={bookCountChangHandler}>
                                            -
                                            <span className="sr-only">도서상품개수 하나씩 감소</span>
                                        </button>
                                        {/* input value 상태관리로 관리필요 */}
                                        <input className="form-control" name="bookCountInput" type="text" value={bookCount} min={1}
                                               title="수량" autoComplete="off" onChange={bookCountInputHandler}/>
                                        <button className="btn btn-light plus" name="plus" type="button" onClick={bookCountChangHandler}>
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