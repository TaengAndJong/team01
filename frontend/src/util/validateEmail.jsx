//유효성 검사
const inputRegexs = {
    // 이메일 : 공백이나 @를 포함하지 않는 문자열 + @ + 공백이나 @를 포함하지 않는 문자열 + . + 공백이나 @를 포함하지 않는 문자열
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    // 아이디 : 문자로 시작하여, 영문자, 숫자, 하이픈(-), 언더바(_)를 사용하여 3~20자 이내
    idRegex: /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/,
    // 비밀번호 : 최소 8자 이상, 최소한 하나의 대문자, 하나의 소문자, 하나의 숫자, 하나의 특수문자를 포함, 공백 허용하지 않음
    pwRegex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/,
    // 닉네임 : 영어 대/소문자, 숫자, 한글 자모음 조합, 2~10자 이내
    nicknameRegex: /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]{2,10}$/,
};

// 비동기 함수 예제 - 이메일 중복 체크
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

// 비동기 함수 예제 - 이메일 중복 체크
const checkIdDuplicate = async (id) => {
    try {
        const response = await fetch(`/api`);
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
    // 이메일이 중복되지 않았는가? (중복 검사 함수 작성)
    const isDuplicate = await checkEmailDuplicate(data);

    if (isDuplicate) {
        return "유효하지 않은 이메일 입니다.";
    } else {
        return "유효한 이메일 입니다.";
    }
};

const vailID = async (data) => {
    // 아이디가 입력되었는가?
    // 아이디가 정규식에 부합하는가?
    // 아이디가 중복되지 않았는가? (중복 검사 함수 작성)
    if(!data){
        return "아이디가 입력되지 않았습니다."
    }
    // 이메일이 정규식에 부합하는가?
    if(inputRegexs.idRegex.test(data)){
        return "유효한 아이디 입니다."
    }else {
        return "유효하지 않은 아이디 입니다."
    }
    // 이메일이 중복되지 않았는가? (중복 검사 함수 작성)
    const isDuplicate = await checkIdDuplicate(data);

    if (isDuplicate) {
        return "유효하지 않은 아이디 입니다.";
    } else {
        return "유효한 아이디 입니다.";
    }

};

const vailPW = () => {
    // 비밀번호가 입력되었는가?
    // 비밀번호가 정규식에 부합하는가?
    // 비밀번호가 처음 입력한 값과 같은가?
}

const vailNickname = () => {
    // 닉네임이 입력되었는가?
    // 닉네임이 정규식에 부합하는가?
    // 닉네임이 중복되지 않았는가? (중복 검사 함수 작성)
}

//GPT 가 알려준 최적화

// 공통 유효성 검사 함수작성
// 공통 유효성 검사 함수를 사용해 개별 함수를 단순화
// 중복 체크 추가 (서버와 통신하기 때문에 비동기로 작성)
// 비밀번호 확인 검사