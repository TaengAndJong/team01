//유효성 검사 정규식
const inputRegexs = {
    // 이메일 : 공백이나 @를 포함하지 않는 문자열 + @ + 공백이나 @를 포함하지 않는 문자열 + . + 공백이나 @를 포함하지 않는 문자열
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    // 아이디 : 문자로 시작하여, 영문자, 숫자를 사용하여 2~15자 이내
    idRegex: /^[a-zA-Z][a-zA-Z0-9]{2,15}$/,
    // 비밀번호 : 최소 8자 이상, 최소한 하나의 대문자, 하나의 소문자, 하나의 숫자, 하나의 특수문자를 포함, 공백 허용하지 않음
    pwRegex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/,
    // 닉네임 : 영어 대/소문자, 숫자, 한글 자모음 조합, 2~10자 이내
    nicknameRegex: /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]{2,10}$/,
    // 전화번호 :  (010-xxxx-xxxx 형식)
    telRegex: /^(010|011|02)\d{8}$/
};

// 공통 유효성 검사 함수작성
export const validateInput = (regex, value,type) => {
    if (!value || value.trim() === "") { // value가 비어있거나 공백만 있을 경우
        return { valid: false,message:`${type}을(를) 입력해 주세요.` };
    }
    if(!regex.test(value)){
        //아이디일 경우
        if( type==="아이디") return {valid:false, message: "영문 또는 숫자 혼합사용가능(최대15글자)"}
        //비밀번호 경우
        if( type==="비밀번호") return {valid:false, message: " 대문자, 소문자, 숫자,특수문자가 하나이상 포함,최소 8자 이상"}
        // 전화번호일 경우
        if (type === "전화번호") return { valid: false, message: "올바른 전화번호 형식이 아닙니다. (예: 010-xxxx-xxxx)" };
    }
    return {valid: true, message: "사용가능형식"}
}




// 공통 유효성 검사 개별 함수 단순화
export const validEmail = (email) => validateInput(inputRegexs.emailRegex, email,"이메일");
export const validID = (id) => validateInput(inputRegexs.idRegex, id,"아이디");
export const validPW = (pw) => validateInput(inputRegexs.pwRegex, pw,"비밀번호");
export const validTel = (tel) => validateInput(inputRegexs.telRegex, tel, "전화번호");






// 중복 체크 추가 (서버와 통신하기 때문에 비동기로 작성)
export const checkDuplicate = async (apiAddr,field, value) => {
    console.log('apiAddr:', apiAddr);
    console.log('Field:', field);
    console.log('Value:', value);
    // 서버로 요청하는 fetch
    try {
        //서버에 응답 요청
        const response = await fetch(`${apiAddr}?${field}=${value}`);
        console.log("response---------",response);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        //응답 받은 데이터 제이슨으로 파싱
        const result = await response.json();
        //중복여부 반환 ==> result.isDuplicate 는 서버에서 보낸 isDuplicate 속성을 의미함

        if(field ==='clientId'){
          return  result.isDuplicate?{ valid: false, message: `${field}(이)가 중복되었습니다.` }:{ valid: true, message: "사용 가능합니다." };
        }

        if(field ==='staffId'){

          console.log("result--------444-------",result);
            //result.staffInfo 존재하면 true
          if(result.staffInfo){
              let startDate = result.staffInfo.startDate;  // 예: "2015-03-01T00:00:00"
              let [date, time] = startDate.split("T");  // "T"를 기준으로 나눔어 구조 분해 할당 해줌
              // 이제 'date'만 다시 result.staffInfo.startDate에 할당
              result.staffInfo.startDate = date;
              return result.isDuplicate? { valid: true, message: `사원번호 ${value}가 이미 존재합니다.`, staffInfo: result.staffInfo}:{ valid: false, message: `${result.staffInfo.staffName}님 사원번호 ${result.staffInfo.staffId}가 확인되었습니다.` };
          }
        //
        }
//
    } catch (error) {
        console.error("Error checking duplicate:", error);
        return { valid: false, message: "서버와의 통신에 실패했습니다." };
    }

}

// 비밀번호 확인 검사
export const validatePasswordMatch = (password, confirmPassword) => {
    if (password !== confirmPassword) return { valid: false, message: '비밀번호가 일치하지 않습니다.' };
    return { valid: true, message: '비밀번호가 일치합니다.' };
};

