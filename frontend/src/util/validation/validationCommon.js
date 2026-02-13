import {inputRegexs} from "./regex.js";



/*
* 검증 코드 작성 시 유의 사항
* 1) 빈 값, 공백 확인 ==> 값 존재 여부 확인
* 2) 정규식 형식 검증 ==> 입력값 상태 확인
* 1,2번 입력 행위에 대한 문자열 패턴 검증
*
* 3) 타입 변환 가능 여부 ==> 의미있는 데이터인지에 대한 검증, 숫자가 존재하는 필드
* 4) 값의 범위 ==> 허용 가능한 데이터 범위 검증
* 5) 필드 간 관계 ==> 단일필드끼리 조함 가능 검증
* 6) 서버 검증 ==> 아이디 중복, 이메일 존재, 사원번호 유효 등 실제데이터 확인
* ( 프론트는 요청만, 서버는 사실여부 판단)
* */


/* 각 컴포넌트별 사전검증 */
//아이디형식 검증


export const idvalidation = (value) =>{

    // 값 없음 !value ==> null 포함 비어있는 모든 값 검증
    // 빈 문자열  ==> value.trim()
    if(!value || value.trim() === ""){
        return {
            valid: false,
            message: "사용할 아이디 입력"
        }
    }
    // 정규식에 맞는지 형식 검증
    if(!inputRegexs.idRegex.test(value)){
        return {
            valid: false,
            message: "3~16글자의 영문 또는 숫자 혼합 사용 가능"
        }
    }

    // 조건 통과하면 반환
    return {
        valid: true,
    }
}

// 비밀번호형식  검증
export const pwvalidation = (value) =>{

    if(!value || value.trim() === ""){
        return {
            valid: false,
            message: "사용할 비밀번호를 입력"
        }
    }

    // 정규식에 맞는지 형식 검증
    if(!inputRegexs.pwRegex.test(value)){
        return {
            valid: false,
            message: "8자 이상 대문자·소문자·숫자·특수문자를 각각 1개 이상 포함."
        }
    }

    // 조건 통과하면 반환 
    return {valid: true}; // 메시지 전달할 필요 없으면 valid만 반환
}

// 비밀번호형식  일치 검증 ==> 기존 입력된 패스워드와 재입력한 패스워드 비교할 파라미터 2개
export const pwConfirmValidation = (password,passwordConfirm) =>{

    // passwordConfirm 의 빈 값과 공백 검증
    if(!passwordConfirm || passwordConfirm.trim() === ""){
        return {
            valid: false,
            message:"확인할 비밀번호를 입력"
        }
    }
    //비밀번호와 확인비밀번호 일치여부 검증
    if(password !== passwordConfirm){
        return {
            valid: false,
            message: "비밀번호 불일치"
        }
    }
    // 조건 통과하면 반환
    return {valid: true};
}

//생년월일 검증
export const birthValidation = (birth, birthType) => {
    const { year, month } = birth;
    const val = birth[birthType];

    // 공통 반환 객체
    const result = {
        type: birthType,
        valid: true,
        message: "",
    };

    // 입력 중 또는 비어있음 ---> 에러메시지 반환 x
    if (!val) return result;

    // 숫자만 허용
    if (!inputRegexs.numberRegex.test(val)) {
        return {
            ...result,
            message: "숫자로 입력",
        };
    }


    // 년
    if (birthType === "year") {
        if (val.length < 4) return result;

        if (val.length !== 4) {
            return {
                ...result,
                message: "년도는 4자리로 입력",
            };
        }
    }

    // 월
    if (birthType === "month") {
        if (val.length < 2) return result; // 2미만이면 입력중

        //2자리 아니면, 1보다 작으며, 12보다 크면
        if (val.length !== 2 || Number(val) < 1 || Number(val) > 12) {
            return {
                ...result,
                message: "월은 01~12 사이 입력",
            };
        }
    }

    // 일
    if (birthType === "day" && year && month) {

        if (val.length < 2) return result; // 2미만이면 입력중

        //  해당 년,월일의 0번째날 == 이전달의 마지막날 반환 공식
        const lastDay = new Date(
            Number(year),
            Number(month),
            0
        ).getDate();

        //2자리가 아니면, 1보다 작으면, 마지막날 보다 크면
        if (val.length !== 2 || Number(val) < 1 || Number(val) > lastDay) {
            return {
                ...result,
                message: `일은 01~${lastDay} 사이 입력`,
            };
        }
    }

    // 최종반환
    return {
        ...result,
        valid: true,
    };
};

//단일 전화번호 검증 ( 입력 중인 상태의 전화번호 )
export const eachTelValidation=(tel,telType)=>{

    //소문자로 치환
    const type = telType.toLowerCase();
    // 변경된 타입명으로 객체의 값 접근, val에 저장
    const val = tel[telType]; // 해당 타입에 대한 값

    // 공통 반환 결과 객체
    const result = {
        type: telType,
        valid: true,
        message: "",
    };

    // 입력 중 또는 비어있음 ---> 에러메시지 반환 x
    if (!val) return result;

    //공통 : 한글x -> 숫자만 허용
    if(!inputRegexs.numberRegex.test(val)){
        return {
            ...result,
            message:"숫자만 입력"
        }
    }

    //첫번째 번호 3자리까지만
    if(type === "firsttelnum" &&  val.length > 3 ){

        return  {
            ...result,
            message: "3자리까지 입력가능",
        }
    }

    //두번째 번호 3,4자리까지만
    if(type=== "secondtelnum" &&  val.length > 4 ){

        return  {
            ...result,
            message: "4자리까지 입력가능",
        }
    }

    //세번째 번호 4자리이여야하고 4자리까지만허용
    if(type === "lastTelNum" && val.length > 4 ){

        return  {
            ...result,
            message: "4자리까지 입력가능",
        }
    }

    // 공통 최종 반환
    return{
        ...result,
        valid: true,
    };

}//단일 전화번호형식 검증

//이메일 아이디 검증
export const emailIdValidation = (emailId) =>{
    console.log("Emailid --- 검증",emailId);
    // 값이 입력 중이거나 미입력일 경우, value는  " "
    if(!emailId) return {valid: true, message:""}

    //형식 검증
    if(!inputRegexs.emailIdRegex.test(emailId)){
        return {
            valid: false,
            message: "영문자, 숫자, 특수문자('_'또는'-')로 30자 이내 입력"
        }
    }

    return {valid: true, message:""};
}


//숫자검증
export const numberValidation = (value) =>{

    //숫자 검증
    if(!inputRegexs.numberRegex.test(value)){
        return {
            valid: false,
            message: "숫자로 입력"
        }
    }

    return {valid: true};

}

//도서가격 검증 ==> onchange핸들러에서 입력될 때마다 실행 되어야하는 검증
export const bookPriceValidation = (value) =>{

    //빈 값 검증, 기본값이 0인데  검증 필요한가 ?
    if (value === "") { // 사용자가 지웠을 때 입력중이니까 에 대한 상황 검증 코드
        return { valid: false, allowEmpty: true };
    }
    // 숫자인지 검증
    if (!inputRegexs.numberRegex.test(value)) {
        return {
            valid: false,
            message: "숫자만 입력하세요."
        };
    }

    return { valid: true };

}

//도서재고 검증
export const bookStockValidation = (value) =>{


    //빈 값 검증, 기본값이 0인데  검증 필요한가 ?
    if (value === "") { // 사용자가 지웠을 때 입력중이니까 에 대한 상황 검증 코드
        return { valid: false, allowEmpty: true };
    }

    if(inputRegexs.numberRegex.test(value)){
        return {
            valid: false,
            message:" 숫자만 입력"
        }
    }

    // input에서 text 타입으로 value 가 들어오기 떄문에 Number Type 으로 변환 후 검증필요
    const num = Number(value);
    //입력값의 기본값은 1이고 1미만 100초과는 안됨
    if(value < 1){
        return{
            valid: false,
            message:"최소 수량은 1개입니다."
        };
    }

    if(value>100){
        return{
            valid: false,
            message:"최대 수량은 100개입니다."
        }; //종료
    }

    return { valid: true };

}


/* 서버 전송 전 검증 */
//전체 전화번호형식  검증 ==> 수정필요
export const fulltelValidation = (value) =>{

    //빈 값 검증
    if(!value || value.trim() === ""){
        return {
            valid: false,
            message: "사용할 전화번호 입력"
        }
    }

    //전화번호 형식 검증 ==> 지역번호와 휴대폰형식이 아닌 것들이니까 and 로 작성해야함
    if(!inputRegexs.telMobileRegex.test(value) &&  !inputRegexs.telAreaRegex.test(value)){
        return {
            valid: false,
            message: "전화번호 형식 다름"
        }
    }
    // 조건 통과하면 반환
    return {valid: true};
}

//이메일 전체 주소 형식 검증
export const fullemailValidation = (value) =>{

    if(!value || value.trim() === ""){
        return {
            valid: false,
            message:"사용할 이메일 입력"
        }
    }

    if(!inputRegexs.emailRegex.test(value)){
        return {
            valid: false,
            message: "이메일 형식 다름"
        }
    }

    return {valid: true};
}

//생년월일 전체 형식 검증
export const fullbirthValidation = (value) =>{}