import React from "react";
import axios from "axios";

const AddCartBtn = ({bookId,quantity}) =>{

    console.log(`addBTn bookId: ${bookId}, quantity:${quantity}`);

    //장밥구니 컨트롤러로 전송할 fetch 함수
    const sendCartFetch= async(bookId,quantity)=>{
      //  console.log("addCartBtn-------data",data);
        console.log("bookId---------sendCartFetch",bookId);
        console.log("quantity-----------sendCartFetch",quantity);
        try{
         const response = await axios.post("/api/cart",
             {bookId:bookId,quantity:quantity} // 서버로 보내는 데이터
            , { withCredentials: true }//쿠키허용
         );
            console.log("장바구니 추가 비동기요청 ",response.data);
            alert(`장바구니 담기 성공`);
        }catch(err){
            if (err.response) {
                // 서버가 응답은 했지만 상태코드가 400, 401, 403, 500 등
                console.error("서버 상태 코드:", err.response.status);
                console.error("서버 메시지---:", err.response.data);
                console.error("서버 메시지---:", err.response.data.message);
                alert(`주문가능한 수량은 ${err.response.data.maxQuantity}개 입니다.`);
            } else if (err.request) {
                // 요청은 했는데 서버가 응답이 없음
                console.error("서버 응답 없음:", err.request);
            } else {
                // 기타 에러
                console.error("요청 설정 에러:", err.message);
            }
        }
    }


    return(
        <>
            <button type="button" aria-label="장바구니"
                    className="submit btn custom-btn00 me-2" onClick={() => sendCartFetch(bookId, quantity)}>
                장바구니
            </button>

        </>
    )
}

export default AddCartBtn;