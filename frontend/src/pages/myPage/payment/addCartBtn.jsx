import React from "react";
import {useModal} from "../../common/modal/ModalContext.jsx";
import {useNavigate} from "react-router-dom";

const AddCartBtn = ({bookId,quantity}) =>{


    console.log(`addBTn bookId: ${bookId}, quantity:${quantity}`);

    //모달
    const {openModal,closeModal} = useModal();
    const navigate = useNavigate();
    //장밥구니 컨트롤러로 전송할 fetch 함수
    const sendCartFetch= async(bookId,quantity)=>{

        try{
            const response = await fetch("/api/cart",{
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({
                    bookId: bookId,
                    quantity: quantity
                })
            })

            if(!response.ok){
                throw new Error("Failed to fetch cart list",response.statusText);
            }

            const data = await response.json();


            if(data.exist){
                //modal 띄우기
                openModal({
                    modalType:"confirm",
                    content:<>
                        <p>{data.message}</p>
                    </>,
                    onConfirm: () => {
                        closeModal();
                        navigate("/cart");
                    }
                });
                return;// 모달띄우고 종료
            }
            //존재하지않으면 실행
            openModal({
                modalType:"confirm",
                content:<>
                    <p>{data.message}</p>
                </>,
                onConfirm: () => {
                    closeModal();
                    navigate("/cart");
                }
            });

        }catch(err){
            //에러처리
            console.log("장바구니에 담기 실패",err);

        }
    }


    return(
        <>
            <button type="button" aria-label="장바구니"
                    className="submit btn btn-primary me-2" onClick={() => sendCartFetch(bookId, quantity)}>
                장바구니
            </button>

        </>
    )
}

export default AddCartBtn;