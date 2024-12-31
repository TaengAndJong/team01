import Btn from "../../../util/reuseBtn.jsx";
import {checkDuplicate, validatePasswordMatch, validID, validPW} from "../../../util/validation.jsx";
import {useContext, useState} from "react";
import DaumPostcode from "../../../util/daumPostcode.jsx";
import { signUpDispatchContext} from "../SignUpComponent"; // 부모 컴포넌트에서 제공한 signUpContext를 import
import Select from 'react-select';
import {generateOptions} from "../../../util/selectDate.jsx";


const SignUpInfo = () => {
    // 부모 컴포넌트인 SignUpForm 에서 context.provider의 value  로 전달 받은 context 값 받아오기
   const { formData, dispatch} = useContext(signUpDispatchContext);
   const [formInfoData,setformInfoData] = useState({
       clientId: "",
       password: "",
       passwordConfirm: "",
       errorMessage: "",
       userName:"",
       email: "",
       birth:"",
       tel:"",
       zipCode:"",
       adr:"",
       dtailAdr:""
   });


    console.log("formData",formData);
    console.log("formInfoData",formInfoData);

    // 공통 입력값 변경 핸들러
    const handleInputChange = (e) => {
        //1.이벤트 타겟팅 된 요소의 name과 value 구조분해 할당하기
        const { name, value } = e.target;
        //2. formInfoData 이전데이터 유지 및 상태갱신 해주기
        setformInfoData((prev) => ({
            ...prev,
            [name]: value, // 동적으로 필드 이름 업데이트
        }));

      //비밀번호 검증 ( 비밀번호 와 비밀번호 확인 두 조건을 비교해야함 ?? 동시에 비교가 됨?)
        if (name === "password" || name === "passwordConfirm") {
            //validatePasswordMatch = (password, confirmPassword)
            const validationResult = validatePasswordMatch(
                name === "password" ? value : formInfoData.password, // password 또는 현재 state의 password
                name === "passwordConfirm" ? value : formInfoData.passwordConfirm // passwordConfirm 또는 현재 state의 passwordConfirm
            );

            //입력된 상태값 갱신
            setformInfoData((prevState) => ({
                ...prevState,
                errorMessage: validationResult.message,
            }));
        }



        //이메일

        //전화번호

    };


    //아이디 검증하기
    const handleConfirm = async () => {

    // 서버와 비동기 통신하여 중복 확인 , field이름은 ""(문자열)
        const apiAddr = "/api/signUp/checkDuplicate"
        const params = new URLSearchParams({ clientId:formInfoData.clientId});

        // params에서 key만 가져오기
        const keys = Array.from(params.keys());  // ["clientId"]
        const values = Array.from(params.values());  // []

        // 비동기 함수 호출 //field는 name을 의미하기때문에 문자열("clientId")로 , field의 값이 value니까 value로 전달
        try {
            const result = await checkDuplicate(apiAddr,`${keys.toString()}`,`${values.toString()}`);
            console.log(result);
            alert(result.message);  // 중복 여부 메시지 출력
        }catch(err) {
            console.error("중복 확인 중 오류 발생:", error);

        }
    };

    //생일
    const yearOptions = generateOptions(1990, 2024, "년"); // 1990년부터 2024년까지
    const monthOptions = generateOptions(1, 12, "월", true); // 1월부터 12월까지 (0 패딩)
    const dayOptions = generateOptions(1, 31, "일", true); // 1일부터 31일까지 (0 패딩)


    // 1. 배열을 함수 밖에 선언하여 상태를 유지,  selectedOption을 배열에 하나씩 저장
    let birthObject = {}; // key와 value 형태로 사용할 경우, 빈 객체로 시작
    //생년월일
    const handleBirthChange= (selectedOption,name) => {
        //console.log("selectedOption",selectedOption); // react-select API 옵션값 확인
        //console.log("birthObject",birthObject);// birthObject 초기값 및 , 변경 값 확인
       // console.log("name ",  name ); // name 값을 활용한 조건부
        // 2. 기존 값을 불러와서 키-값 형태로 설정 (객체에 key : value  추가) , name에 따른 vale에 2자리 중 빈자리 0 추가
        if(name === 'birthMonth' || name === 'birthDay'){
            birthObject[name] = String(selectedOption.value).padStart(2, "0");
           
        }else{ 
            // birthYear인 경우 그냥 추가
            birthObject[name] = selectedOption.value;
        }

        // '년, 월 ,일 ' 모든 값이 있을 때만 infoDate의 'birth'를 갱신
        if (birthObject.birthYear && birthObject.birthMonth && birthObject.birthDay) {
            // 'birthYear', 'birthMonth', 'birthDay' 값이 모두 있으면
            setformInfoData((prev) => ({
                ...prev,
                birth: `${birthObject.birthYear}-${birthObject.birthMonth}-${birthObject.birthDay}`,
            }));
        }
        //최종값 확인   console.log("Updated Birth Object:", birthObject); // 객체 출력

    }




    //주소
    const handleAddressSelect = (address) => { // 우편번호 검색한 데이터를 입력해주는 handler
        onInputChange('adr', address); // adr 필드 업데이트
    };

//
    return(
        <>
            {/*아이디*/}
            <div>
                <label>아이디 </label>
                <input type="text" name="clientId" placeholder="아이디를 입력해주세요" value={formInfoData.clientId}
                       onChange={handleInputChange}
                />
                <Btn text="중복확인" type="" onClick={() => {
                    handleConfirm()
                }}/>
                <span className="error"></span>

            </div>

            {/*비밀번호*/}
            <div>
                <label>비밀번호 </label>
                <input type="password" name="password" placeholder="비밀번호를 입력해주세요" value={formInfoData.password}  onChange={handleInputChange} />
            </div>
            <div>
                <label>비밀번호 확인 </label>
                <input type="password" name="passwordConfirm" placeholder="비밀번호를 입력해주세요"
                       value={formInfoData.passwordConfirm} onChange={handleInputChange} />
                {formInfoData.errorMessage && (
                    <span className="error">{formInfoData.errorMessage}</span>
                )}
            </div>
           
            <h4>-----------------------------------</h4>
            {/*이름*/}
            <div className="Info name">
                <label>이름</label>
                <input type="text" name="userName" placeholder="이름을 입력해주세요"/>
            </div>
            {/*생일*/}
            <div className="Info birth">
                <label>생년월일</label>
                <Select
                    name="birthYear"
                    id="birthYear"
                    options={yearOptions}
                    onChange={(selectedOption) => handleBirthChange(selectedOption, "birthYear")}
                    placeholder="연도 선택"
                />
                <Select
                    name="birthMonth"
                    id="birthMonth"
                    options={monthOptions}
                    onChange={(selectedOption) => handleBirthChange(selectedOption, "birthMonth")}
                    placeholder="월 선택"
                />
                <Select
                    name="birthDay"
                    id="birthDay"
                    options={dayOptions}
                    onChange={(selectedOption) => handleBirthChange(selectedOption, "birthDay")}
                    placeholder="일 선택"
                />
            </div>
            {/*이메일*/}
            <div className="Info email">
                <label>이메일 </label>
                <input type="text" name="emailId" placeholder="ex)이메일아이디"/>
                <span id="at">@</span>
                {/*메일주소 데이터로 뿌리기*/}
                <select name="emailAddr" >
                    <option key="1" value="">직접선택</option>
                </select>
                {/*<p>{emailCheckMessage}</p>*/}
            </div>

            {/*전화번호*/}
            <div className="Info tel">
                <label>전화번호</label>
                {/*첫번째 전화번호 스크립트 조작*/}
                <select name="FirstTelNum" id="FirstTelNum">
                    <option key="1" value="">직접선택</option>
                </select>
                <span>-</span>
                <input type="text" name="secondTelNum" placeholder={`"두 번째 전화번호 입력"`}
                />
                <span>-</span>
                <input type="text" name="lastTelNum" placeholder={`"마지막 번째 전화번호 입력"`}

                />
            </div>
            
            {/*주소*/}
            <div className="Info Address">
                <div>
                    {/* 카카오톡 API 주소 , 각각 갈라서 백으로 전달*/}
                    <label>주소 </label>
                    <input type="text" name="zipCode" placeholder="우편번호입력"/>
                    <DaumPostcode onAddressSelect={handleAddressSelect}/>
                </div>
                <div>
                    <label>주소</label>
                    <input type="text" name="adr" placeholder="주소를 입력해주세요"/>
                </div>
                <div>
                    <label>상세주소</label>
                    <input type="text" name="dtailAdr" placeholder="상세주소를 입력해주세요"/>
                </div>
            </div>
        </>
    )
}

export default SignUpInfo;



//react -select https://react-select.com/home
// React-Select는 기본적으로 name 속성을 전달하지 않으므로, onChange 핸들러에서 name 정보를 가져오려면 별도의 설정이
// Select 컴포넌트에 inputId 속성을 사용하거나, onChange 핸들러의 두 번째 매개변수를 활용
