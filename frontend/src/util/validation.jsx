//유효성 검사 정규식
const inputRegexs = {
    // 이메일 : 공백이나 @를 포함하지 않는 문자열 + @ + 공백이나 @를 포함하지 않는 문자열 + . + 공백이나 @를 포함하지 않는 문자열
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    // 아이디 : 문자로 시작하여, 영문자, 숫자를 사용하여 3~20자 이내
    idRegex: /^[a-zA-Z][a-zA-Z0-9]{6,15}$/,
    // 비밀번호 : 최소 8자 이상, 최소한 하나의 대문자, 하나의 소문자, 하나의 숫자, 하나의 특수문자를 포함, 공백 허용하지 않음
    pwRegex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/,
    // 닉네임 : 영어 대/소문자, 숫자, 한글 자모음 조합, 2~10자 이내
    nicknameRegex: /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]{2,10}$/,
};


// 비동기 함수 - 이메일 중복 체크
const checkEmailDuplicate = async (email) => {
    try {
        const response = await fetch(`/api/check-email?email=${encodeURIComponent(email)}`);
        const data = await response.json();

        if (data.exists) {
            return true; // 중복임
        } else {
            return false; // 중복 아님
        }
    } catch (error) {
        console.error("중복 검사 중 서버 오류:", error);
        return false;
    }
};

//이메일 유효성 검사
const vailEmail = async (data) => {
    // 이메일이 입력되었는가?
    if(!data){
        return "이메일이 입력되지 않았습니다."
    }
    // 이메일이 정규식에 부합하는가?
    if(inputRegexs.emailRegex.test(data)){
        return "유효한 이메일 입니다."
    }else {
        return "유효하지 않은 이메일 입니다."
    }
};


// 필드 유효성 검사 함수
export const FormValid = (formData) => {
    const requiredFields = ["id", "password", "passwordConfirm", "userName", "emailId","emailAddr", "tel", "adr", "dtailAdr"];
    for (const field of requiredFields) {
        if (!formData[field] || formData[field].trim() === "") {
            return false;
        }
    }
    for (const key in formData) {
        if (formData[key] === null || formData[key] === undefined) {
            return false;
        }
    }
    return true;
};


//GPT 가 알려준 최적화

// 공통 유효성 검사 함수작성
export const validateInput = (regex, value) => {
    if(!value)return {valid: false}
        if(!regex.test(value)) return {valid:false, massage: "형식이 올바르지 않습니다."}
    return {valid: true, massage: "사용가능 합니다."}
}

// 공통 유효성 검사 개별 함수 단순화
export const validEmail = (email) => validateInput(inputRegexs.emailRegex, email);
export const validID = (id) => validateInput(inputRegexs.idRegex, id);
export const validPW = (pw) => validateInput(inputRegexs.pwRegex, pw);

// 중복 체크 추가 (서버와 통신하기 때문에 비동기로 작성)
export const checkDuplicate = async (apiAddr,field, value) => {

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

        console.log("field----------------", field);
        console.log("result.isDuplicate--------------------------", result.isDuplicate);

        if(field ==='clientId'){
          return  result.isDuplicate?{ valid: false, message: `${field}(이)가 중복되었습니다.` }:{ valid: true, message: "사용 가능합니다." };
        }

        if(field ==='staffId'){

          console.log("result---------------",result);
            //result.staffInfo 존재하면 true
          if(result.staffInfo){
              let startDate = result.staffInfo.startDate;  // 예: "2015-03-01T00:00:00"
              let [date, time] = startDate.split("T");  // "T"를 기준으로 나눔어 구조 분해 할당 해줌
              // 이제 'date'만 다시 result.staffInfo.startDate에 할당
              result.staffInfo.startDate = date;
              return result.isDuplicate? { valid: true, message: "확인되었습니다.", staffInfo: result.staffInfo}:{ valid: false, message: `${field}(을)를 존재하지 않습니다.` };
          }
        //result.staffInfo 존재하지 않으면 false
            return result.isDuplicate? { valid: true, message: "확인되었습니다."}:{ valid: false, message: `사원번호 ${value}가 존재하지 않습니다.` };
        }

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

