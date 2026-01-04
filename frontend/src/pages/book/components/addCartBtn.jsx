import React from "react";
import axios from "axios";
import {useModal} from "../../common/modal/ModalContext.jsx";
import {useNavigate} from "react-router-dom";
import {catchError} from "../../../util/error.jsx";

const AddCartBtn = ({bookId,quantity}) =>{


    //전역모달 사용
    const {openModal,closeModal}=useModal();
    //네입게이트 리액트훅
    const navigate=useNavigate();
    
    
    
    //장밥구니 컨트롤러로 전송할 fetch 함수
    const sendCartFetch= async(bookId,quantity)=>{

        try{
         const response = await axios.post("/api/cart",
             {bookId:bookId,quantity:quantity} // 서버로 보내는 데이터
            , { withCredentials: true }//쿠키허용
         );

         //여기 resonse data 있을경우 조건 추가 ?
            if(response.status === 200){
               // console.log("장바구니 추가 비동기요청 ",response.data);
                // insert 요청일때와 , 중복도서 존재할때 모달 분기

                if(response.data.exist){
                    openModal({
                        modalType: "confirm",
                        content: <>
                            <p>{response.data.message}</p>
                            <p>장바구니로 이동하시겠습니까?</p>
                        </>,
                        onConfirm:()=>{
                            closeModal(); // 모달 닫고
                            navigate(`/cart`);  // 장바구니로 이동
                        },
                    });

                }else{
                    //exist가 false ==> 중복도서가 없어서 도서가 추가됨
                    openModal({
                        modalType:"default",
                        content:<><p>{response.data.message}</p></>,
                    });
                }

            }

        }catch(err){
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