import React, {useEffect} from "react";
import axios from "axios";
import {useLocation} from "react-router-dom";

const BookCount = ({ bookId, cartId, bookCount, setBookCount,modifyQuantity}) =>{

   // console.log("bookCount", bookCount);
    const location = useLocation(); // 수량 변경 완료 버튼 조건부 렌더링

    // 장바구니에 담을 도서 수량버튼 관리 핸들러 ==> 고려사항 각각의 도서에 대한 개별 수량 구분 필요
    const bookCountChangHandler=(bookId,e)=>{

        // console.log("bookCountChangHandler bookId",bookId);
        // console.log("bookCountChangHandler e.target.name",e.target.name);

        const bookIdCount = bookCount[bookId] || 1;


        //button name으로 plus , minus 구분
        //최소 수량이 1보다 작음 방지 필요, 최대 개수는 100개까지 제한
        const btnName= e.target.name;
        switch(btnName){
            case "minus":
                if (bookIdCount > 1) {

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

                    setBookCount(prev => ({
                        ...prev,
                        [bookId]:parseInt(bookIdCount,10) + 1
                    }))
                } else {
                    alert("최대 수량은 100개까지입니다.");
                }
                break;
            default:
                //에러처리 예외처리
                console.warn("정의되지 않은 버튼 name입니다:", btnName);break;

        }

       // console.log("bookCountChangHandler의  bookIdCount---11",bookIdCount);
    }

    // 도서 수량 입력 input 관리 핸들러
    const bookCountInputHandler=(bookId,e)=>{
        //input[type=text]로 들어오는 value는 String 타입으로 들어오기 때문에 숫자로 검증필요
        const val = e.target.value;

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

    }


    useEffect(() => {
      //  console.log("useEffect bookCount[bookId]",bookCount[bookId]);
        // bookCount[bookId]의 초기값이 undefined라서 1로 보이지만 0으로 설정되는 부분 UI와 동일하게 맞추기
        //prev를 사용하는 이유는,직접 복사해서 사용하면 비동기 상태 갱신으로 인해 초기값이 갱신 전 값으로 적용될 수 잇어서,
        //prev를 사용해 해당 시점의 데이터를 참조(얕은복사)하고 스프레드 연산자를 사용해 기존객체내용을 새 객체에 복사
        if(!bookCount[bookId]){
            setBookCount(prev=>({
                ...prev,
                [bookId]:1,
            }))
        }
    }, []);


   // console.log("useEffect bookCount[bookId]---------------------",bookCount[bookId]);

    return (
        <>
            <div className="count">
                <div className="count-inner d-inline-flex mx-2">
                    <button className="btn btn-light minus" name="minus" type="button"
                            onClick={(e) => bookCountChangHandler(bookId, e)}>
                        -
                        <span className="sr-only">도서상품개수 하나씩 감소</span>
                    </button>
                    {/* input value 상태관리로 관리필요 */}
                    <input className="form-control" name="bookCountInput" type="text"
                           value={bookCount[bookId] ?? 1} min={1}
                           title="수량" autoComplete="off" onChange={(e) => bookCountInputHandler(bookId, e)}/>
                    <button className="btn btn-light plus" name="plus" type="button"
                            onClick={(e) => bookCountChangHandler(bookId, e)}>
                        +
                        <span className="sr-only">도서상품개수 하나씩 증가</span>
                    </button>

                    {!location.pathname.startsWith("/book") && (
                        <button className="btn btn-primary"
                                onClick={() => {
                                    modifyQuantity(cartId, bookId, bookCount[bookId])
                                }}
                        >완료
                        </button>
                    )
                    }
                </div>
            </div>
        </>
    )
}

export default BookCount;