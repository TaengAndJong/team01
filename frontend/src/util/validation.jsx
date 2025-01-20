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
    // 전체 전화번호 :  (010-xxxx-xxxx 형식)
    telRegex: /^(010|011|02)-\d{4}-\d{4}$/,
    //각 전화번호 : 숫자사용, 자리수는 4자리까지
    telEachRegex:/^\d{0,4}$/,
};

// 공통 유효성 검사 함수작성
export const validateInput = (regex, value,name,type) => {
    if (!value || value.trim() === "") { // value가 비어있거나 공백만 있을 경우
        return { valid: false,message: `${type}을(를) 입력해 주세요.`  };
    }

    if(!regex.test(value)){
        //아이디일 경우 (대소문자 구부없이 )
        if( name.toLowerCase().includes("id")) return {valid:false, message: "영문 또는 숫자 혼합사용가능(최대15글자)"}
        //비밀번호 경우
        if(name.toLowerCase().includes("password")) return {valid:false, message: " 대문자, 소문자, 숫자,특수문자가 하나이상 포함,최소 8자 이상"}
        // 전화번호일 경우 :  null 또는 undefined일 수 있으므로 안전하게 접근하기 위해 조건 필요
        // ? 옵셔널 체이닝 연산자로 객체나 변수의 속성이나 메서드에 접근하려고 할때 , 해당 값이 null, undefined인 경우 오류 방지하고 undefinde 반환
        if (name?.trim().toLowerCase().includes("secondtelnum") || name?.trim().toLowerCase().includes("lasttelnum") ){

            if(!regex.test(value)) {
                return { valid: false, message: "숫자로 4자리까지만 입력 가능합니다." };
            }
        }
    }
    return {valid: true, message: "사용가능형식"}
}




// 공통 유효성 검사 개별 함수 단순화
export const validID = (id) => validateInput(inputRegexs.idRegex, id,"id","아이디");
export const validPW = (pw) => validateInput(inputRegexs.pwRegex, pw,"password","비밀번호");
export const validEachTel = (name,tel) => validateInput(inputRegexs.telEachRegex, tel, name,"전화번호");
export const validFullTel = (tel) => validateInput(inputRegexs.telRegex, tel, "전화번호");
export const validEmail = (email) => validateInput(inputRegexs.emailRegex, email,"이메일");




// 중복 체크 추가 (서버와 통신하기 때문에 비동기로 작성)
export const checkDuplicate = async (apiAddr,field, value) => {
    // 여기서 유효성 1차 검사
    const validIdResult = validID(value); // validID 함수 호출로 아이디 검사
    if (!validIdResult.valid) {
        return validIdResult; // 유효하지 않으면 검사 결과 반환
    }

    // 서버로 요청하는 fetch 중복여부 검사
    try {
        //서버에 응답 요청
        const response = await fetch(`${apiAddr}?${field}=${value}`);

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        //응답 받은 데이터 제이슨으로 파싱
        const result = await response.json();
        // 빈값 여부 ?확인 ?


        //중복여부 반환 ==> result.isDuplicate 는 서버에서 보낸 isDuplicate 속성을 의미함
        if(field ==='clientId'){
            return  result.isDuplicate?{ valid: false, message: `${field}(이)가 중복되었습니다.` }:{ valid: true, message: "사용가능합니다." };
        }

        if(field ==='staffId'){
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

//전화번호 확인검사