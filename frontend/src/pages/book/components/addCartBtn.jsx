import React from "react";
import axios from "axios";
import {useModal} from "../../common/modal/ModalContext.jsx";
import {useNavigate} from "react-router-dom";
import {catchError} from "../../../util/error.jsx";

const AddCartBtn = ({bookId,quantity}) =>{

    console.log(`addBTn bookId: ${bookId}, quantity:${quantity}`);
    //전역모달 사용
    const {openModal,closeModal}=useModal();
    //네입게이트 리액트훅
    const navigate=useNavigate();
    
    
    
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
            openModal({
                modalType:"confirm",
                data:{message:"장바구니 담기 성공"},
                onConfirm:closeModal,
            });

        }catch(err){
            console.error("서버 상태 코드:", err.response.status);
            console.error("서버 메시지---데이터:", err.response.data);
            console.error("서버 메시지--- 메시지:", err.response.data.message);
            //에러 처리 핸들러
            catchError(err, { openModal, closeModal, navigate });
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