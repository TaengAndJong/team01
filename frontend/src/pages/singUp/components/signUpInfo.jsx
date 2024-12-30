import Btn from "../../../util/reuseBtn.jsx";
import {checkDuplicate, validatePasswordMatch, validID, validPW} from "../../../util/validation.jsx";
import {useContext, useState} from "react";
import DaumPostcode from "../../../util/daumPostcode.jsx";
import { signUpDispatchContext} from "../SignUpComponent"; // 부모 컴포넌트에서 제공한 signUpContext를 import



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

            setformInfoData((prevState) => ({
                ...prevState,
                errorMessage: validationResult.message,
            }));
        }

        //생년월일 : 1) 공통 핸들러 생성해서 value값 받기  2) 이전 데이터를 포함한 value값 데이터를 상태 갱신해주기

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
        const values = Array.from(params.values());  // ["clientId"]

        // 비동기 함수 호출 //field는 name을 의미하기때문에 문자열("clientId")로 , field의 값이 value니까 value로 전달
        try {
            const result = await checkDuplicate(apiAddr,`${keys.toString()}`,`${values.toString()}`);
            console.log(result);
            alert(result.message);  // 중복 여부 메시지 출력
        }catch(err) {
            console.error("중복 확인 중 오류 발생:", error);

        }
    };

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
                {/*연,월,일 데이터로 뿌리기*/}
                <select name="birthYear" id="birthYear" value="" onChange="">
                    <option key="1" value="">2024</option>
                </select>
                <span>년</span>
                <select name="birthMonth" id="birthMonth" value="" onChange="">
                    <option key="1" value="">01</option>
                </select>
                <span>월</span>
                <select name="birthMonth" id="birthMonth" value="" onChange="">
                    <option key="1" value="">01</option>
                </select>
                <span>일</span>
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