
//함수는 {} 객체로 묶어서 파라미터로 가져옴
export const catchError =(err,{openModal,closeModal,navigate,redirectPath})=>{
    console.log("error",err);
    //1) 서버 응답 없을 경우
    if(!err.response){
        console.error("서버 응답 없음:", err.request || err.response.data.message);
        openModal({
            modalType: "error",
            content: { message: "서버에 연결할 수 없습니다. 네트워크를 확인해주세요." },
            onConfirm: () => {closeModal();   console.log("여기고기") }

        });
        return;//종료
    }

    //2) 응답이 있는 경우 = status : 에러 상태 코드, data : 서버에서 반환하는 자세한 에러데이터내용
    const {status, data} = err?.response; // 객체 구조분해할당

    //3) 상태값에 따른 에러 처리 핸들러
    const errorHandler = {

        //status: 화살표 함수
        401:()=>{

            openModal({
                modalType:"login",
                content:<><p>{data?.message}</p></>,
                onConfirm:()=>{
                    //모달 닫기
                    closeModal();
                    navigate("/login");//로그인페이지로 이동
                },
                onClose: closeModal,
            });
            return;//종료
        },//401

        //400
        400:()=>{
            console.log("400")
            //주문재고가 0일경우 , 품절
            if (data?.maxQuantity === 0) {
                openModal({
                    modalType: "error",
                    content: <p>{`${data?.message} (품절)`}</p>,
                    onConfirm: () => closeModal(),
                });
                return; //종료
            }
            // 주문가능수량 에러처리 ( typeof "number" 체크시 , 0 이상 숫자처리, undefined, null 방지
            if (typeof data?.maxQuantity === "number" && data.maxQuantity > 0) {
                openModal({
                    modalType: "error",
                    content:<>
                        <p>{`주문가능한 수량은 ${data.maxQuantity}개 입니다.`}</p>
                        <p>장바구니로 이동하시겠습니까?</p>
                    </>,
                    onConfirm: () => {closeModal(); navigate("/cart"); },
                });
                return; //종료
            }
            //그외 에러처리
            openModal({
                modalType: "error",
                content: <p>{`${data?.message}` || "잘못된 요청입니다." }</p>,
                onConfirm: () => { closeModal();
                    console.log("여기")
                    if(redirectPath && typeof navigate === "function"){ // navigate 함수여부조건 추가 ==> undefined 발생 방지
                        navigate(redirectPath);
                    }
                }
            });
            return;//종료
        },//400


        //500
        500:()=>{
            openModal({
                modalType: "error",
                content: <p>{  "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." }</p>,
                onConfirm: () => {closeModal()},
            })
        },//500
    }
    //errorHandler end

    // 4) 매핑된 핸들러 실행 또는 기본 핸들러 실행
    const sendError = errorHandler[status] || (
        ()=>{
            openModal({
                modalType: "error",
                content: <p>{ data?.message || "알 수 없는 오류가 발생했습니다." }</p>,
                onConfirm: () => {
                    closeModal();

                },
            })
        }
    );// sendError end
    sendError();
}