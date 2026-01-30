

//1) 검증에 필요한 paymentInfo 파라미터로 받아오기
//검증할 목록 : 1) cardNumber, bankAccount, payConfirm 의 true여부

const ValidationPay = (paymentInfo) =>{


    const paymentMethod = paymentInfo.payMethod;

    switch (paymentMethod) {
        case "card":
            const cardNumberStr = 
                String(paymentInfo.cardNumber ?? "").trim()//공백제거
                   // .replace(/\s+/g, ""); // 모든 공백 제거;
            const cardName = String(paymentInfo.cardName ?? "").trim();

            if (!cardNumberStr) {
                return { valid: false, message: "카드번호를 입력해주세요." };
            }

            if (!/^\d+$/.test(cardNumberStr)) {
                return { valid: false, message: "카드번호는 숫자만 입력해주세요." };
            }

            if (cardNumberStr.length !== 16) {

                return { valid: false, message: "카드번호는 16자리를 입력해주세요." };
            }
            if(!cardName){
                return{valid:false,message: "카드사를 선택해주세요"};
            }
            break;
        case "bank":
            const bankNumberStr =
                String(paymentInfo.bankAccount ?? "").trim()//공백제거
            // .replace(/\s+/g, ""); // 모든 공백 제거;
            const bankName = String(paymentInfo.bankName ?? "").trim();

            if(!bankNumberStr){
                return { valid : false, message : "계좌번호를 입력해주세요."}
            }
            if (!/^\d+$/.test(bankNumberStr)) {
                return { valid: false, message: "계좌번호는 숫자만 입력해주세요." };
            }

            if (bankNumberStr.length < 8 || bankNumberStr.length > 20) {
                return { valid: false, message: "계좌번호 형식이 올바르지 않습니다." };
            }

            if(!bankName){
                return{valid:false,message: "은행을 선택해주세요"};
            }
            break;
        default:break; // default를 설정하지 않으면 블록을 벗어남
    }

    //조건 모두 통과했다면 valid = true
    return { valid: true };
}

export default ValidationPay;


/*
 *  const cardNumberStr =
          String(paymentInfo.cardNumber ?? "").trim()//공백제거
          .replace(/\s+/g, ""); // 모든 공백 제거;
 *
 *         String() 함수를 사용하는 이유 : "undefined"를 안전하게 문자로 변환
 *          ?? (null 병합 연산자)를 사용하는 이유 : 
 *              "undifined"라는 글자가 나올 수 있기때문에, null이나 undefined일 경우 ""(빈문자열)로 대체
            trim()은 맨 앞뒤 공백을 제거 예) " 1234123  " ==> "12341234"
 *          .replace(/\s+/g, "")를 사용해서 중간공백도 제거
 *
 * */
