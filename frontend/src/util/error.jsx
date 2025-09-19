
//함수는 {} 객체로 묶어서 파라미터로 가져옴
export const catchError =(err,{openModal,closeModal,navigate})=>{

    //1) 서버 응답 없을 경우
    if(!err.response){
        console.error("서버 응답 없음:", err.request || err.message);
        openModal({
            modalType: "error",
            data: { message: "서버에 연결할 수 없습니다. 네트워크를 확인해주세요." },
            onConfirm: () => closeModal(),
        });
        return;//종료
    }

    //2) 응답이 있는 경우 = status : 에러 상태 코드, data : 서버에서 반환하는 자세한 에러데이터내용
    const {status, data} = err.response; // 객체 구조분해할당

    //3) 상태값에 따른 에러 처리 핸들러
    const errorHandler = {
        //status: 화살표 함수
        401:()=>{
            openModal({
                modalType:"login",
                data:{message:err.response.data.message},
                onConfirm:()=>{
                    navigate("/login");//로그인페이지로 이동
                    //모달 닫기
                    closeModal();
                }
            });
        },//401

        400:()=>{
            if (data?.maxQuantity) { // 주문가능수량 에러처리
                openModal({
                    modalType: "error",
                    data: { message: `주문가능한 수량은 ${data.maxQuantity}개 입니다.` },
                    onConfirm: () => closeModal(),
                });
            } else {
                openModal({
                    modalType: "error",
                    data: { message: data?.message || "잘못된 요청입니다." },
                    onConfirm: () => closeModal(),
                });
            }
        },//400

        500:()=>{
            openModal({
                modalType: "error",
                data: { message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
                onConfirm: () => closeModal(),
            })
        },//500
    }
    //errorHandler end

    // 4) 매핑된 핸들러 실행 또는 기본 핸들러 실행
    const sendError = errorHandler[status] || (
        ()=>{
            openModal({
                modalType: "error",
                data: { message: data?.message || "알 수 없는 오류가 발생했습니다." },
                onConfirm: () => closeModal(),
            })
        }
    );// sendError end
    sendError();
}