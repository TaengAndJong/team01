import React from "react";
import {useNavigate} from "react-router-dom";
import cartList from "../../cart/components/cartList.jsx";
import axios from "axios";
import {useModal} from "../../common/modal/ModalContext.jsx";
import {catchError} from "../../../util/error.jsx";
import {useAuth} from "../../common/AuthContext.jsx";

// 선택도서구매와 바로구매 동일 버튼 사용하게 구현하기
// 버튼은 type으로 구분, 도서 데이터 book,
const BuySelectedBtn = ({type, book,cartId,isDisable}) => {
    // 로그인 여부
    const { isAuthenticated } = useAuth(); //

    const params = {type,book,cartId};
    const navigate = useNavigate();
    // 전역 모달
    const {openModal, closeModal} = useModal();


    //단건구매일때에는 cartId도 같이 결제페이지로 넘겨줘야함
    // 단건구매(selected)일 경우에만 cartId 추가
    if (type === "selected" && cartId) {
        params.cartId = cartId;
    }

    const btnName = type ==="selected"? "단건구매" : "바로구매";

    //선택구매 버튼을 누르면 결제페이지로 이동되고, 도서정보도 같이 넘겨줘야함
    const gotoPayment = async (book,type) => {

        // 도서정보, 버튼type, cartId
        
        // 서버 세션유지확인 & 에러처리
        try{
            if (!isAuthenticated) {
                openModal({
                    modalType: "confirm",
                    content:<><p>로그인페이지로 이동하시겠습니까?</p></>,
                    onConfirm: () => {closeModal(); navigate("/login");}
                });

                return;
            }else{
                const response = await axios.get("/api/auth",)
                if(response.status === 200) {
                    //세션유지,로그인 확인 시
                    // 결제페이지로 파라미터를 담아서 이동하기
                    navigate("/payment",{
                        state:{
                            book,
                            type :type,
                            cartId: type === "selected" ? cartId : null // 결제페이지에서 null 체크 필요
                        }
                    });
                }
            }

        }catch(err){

            if (err.response && err.response.status === 401) {
                catchError(err, { openModal, closeModal, navigate });

            } else {
                console.error("로그인 체크 오류:", err);
            }
        }

        


    }

    return (
        <>
            <button type="button" aria-label={btnName}
                    className="submit btn btn-dark"
                    onClick={()=> gotoPayment(book,type)}
                    disabled={isDisable}
            >
                {btnName}
            </button>
        </>
    )
}

export default BuySelectedBtn;