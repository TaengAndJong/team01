import React, {useEffect, useState} from "react";
import axios from "axios";

const AddCartBtn = ({ bookId, bookCount }) => {
    // bookCount props 이름 다름
    // 비동기 요청에 보낼 데이터 객체
    const [toCart, setToCart] = useState({});


    //장밥구니 컨트롤러로 전송할 fetch 함수
    const sendCartFetch= async(bookId,quantity)=>{
        //  console.log("addCartBtn-------data",data);
        //console.log("bookId---------sendCartFetch",bookId);
       // console.log("quantity-----------sendCartFetch",quantity);
        try{
            const response = await axios.post("/api/cart",
                {bookId:bookId,quantity:quantity} // 서버로 보내는 데이터
                , { withCredentials: true }//쿠키허용
            );
            console.log("장바구니 추가 비동기요청 ",response.data);

        }catch(err){
            if (err.response) {
                // 서버가 응답은 했지만 상태코드가 400, 401, 403, 500 등
                console.error("서버 상태 코드:", err.response.status);
                console.error("서버 메시지---:", err.response.data.message);
            } else if (err.request) {
                // 요청은 했는데 서버가 응답이 없음
               console.error("서버 응답 없음:", err.request);
            } else {
                // 기타 에러
                console.error("요청 설정 에러:", err.message);
            }
        }
    }

    //장바구니 버튼 누르면 toCart 객체에 도서정보와 수량 담아주는 핸들러 및 장바구니 컨트롤러로 전송
    const handleAddToCart = (bookId,bookCount) => {
        console.log("handleAddToCart -bookId",bookId);
        console.log("handleAddToCart -bookCount",bookCount);
        // ToCart에 먼저 변경된 데이터 갱신하기 
        setToCart( {
            bookId:bookId,
            quantity: bookCount
        }); // 배열로 저장

    };


    //toCart 데이터 변경 감지 시 비동기요청
    useEffect(() => {

        // console.log("toCart useEffect out ",toCart);
        // console.log("toCart toCart.bookId",toCart.bookId);
        // console.log("toCart toCart.quantity",toCart.quantity);
        // 변경된 데이터가 아래 조건과 같으면 비동기요청 실행
        if( toCart.bookId != null && toCart.quantity >  0 ){

          //  console.log("toCart useEffect in",toCart);
            // bookId null이 아닐 때와 quantity가 0 이아닌 경우  실행되어야 함
            sendCartFetch(); // cart 컨트롤러로 전송
        }
    }, [toCart]);


    return(
        <>
            <button type="button" aria-label="장바구니"
                    className="submit btn custom-btn00 me-2" onClick={()=> handleAddToCart(bookId,bookCount)}>장바구니
            </button>
        </>
    );
}

export default AddCartBtn;