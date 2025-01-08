import Btn from "../../../util/reuseBtn.jsx";
import {checkDuplicate, validatePasswordMatch} from "../../../util/validation.jsx";
import {useState,useEffect} from "react";
import DaumPostcode from "../../../util/daumPostcode.jsx";
import Select from 'react-select';
import {generateOptions} from "../../../util/selectDate.jsx";


const SignUpInfo = () => {
    // 부모 컴포넌트인 SignUpForm 에서 context.provider의 value  로 전달 받은 context 값 받아오기

   const [formInfoData,setformInfoData] = useState({
       clientId: "",
       password: "",
       passwordConfirm: "",
       passwordErrorMessage: "",
       userName:"",
       staffId:"",
       email: "",
       birth:"",
       tel:"",
       addr:"",
       zoneCode:"",
       detailAddr:""
   });


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
                passwordErrorMessage: validationResult.message,
            }));
        }


    };


    const [result, setResult] = useState({ staffInfo: null });
    //아이디와 사원아이디 검증
    const handleIdConfirm = async (fieldName) => {

    // 서버와 비동기 통신하여 중복 확인 , field이름은 ""(문자열)
        const apiAddr = "/api/signUp/checkDuplicate"

        const params = new URLSearchParams({ [fieldName]: formInfoData[fieldName] });
      //  const params = new URLSearchParams({ clientId:formInfoData.clientId});
        console.log("params",params);
        // params에서 key만 가져오기

        // 비동기 함수 호출
        try {
            // 비동기 함수 호출 (fieldName과 해당 값을 전달)
            const result = await checkDuplicate(apiAddr, fieldName, params.get(fieldName));
            console.log("result------------frontEnd",result);
            // result가 넘어왔을 때 객체 내부에 staffInfo를 담고 있으니까, result값 state 초기값을 갱신
            setResult(result);
            //result.staffInfo 가 잇으면 (True  이면)
            if (result.staffInfo) {
                // 사원번호 확인이 되면 이름 자동 입력
                setformInfoData((prev) => ({
                    ...prev,
                    userName: result.staffInfo.staffName, // 사원명 자동 입력
                }));
            }

            alert(result.message); // 중복 여부 메시지 출력
        } catch (err) {
            console.error(`중복 확인 중 오류 발생 (${fieldName}):`, err);
        }
    };

    //생일
    const yearOptions = generateOptions(1990, 2024, "년"); // 1990년부터 2024년까지
    const monthOptions = generateOptions(1, 12, "월", true); // 1월부터 12월까지 (0 패딩)
    const dayOptions = generateOptions(1, 31, "일", true); // 1일부터 31일까지 (0 패딩)

    // 사원여부
    const [isStaff, setIsStaff] = useState("no"); // 기본값을 "no"(아니오)로 설정
    // 라디오 버튼 변경 핸들러
    const handleStaffChange = (e) => {
        console.log("staffId",e.target.value);
        setIsStaff(e.target.value);
    };



    // 1. 배열을 함수 밖에 선언하여 상태를 유지,  selectedOption을 배열에 하나씩 저장
    let birthObject = {}; // key와 value 형태로 사용할 경우, 빈 객체로 시작 또는 useState로 관리
    //생년월일
    const handleBirthChange= (selectedOption,name) => {

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

    //전화번호 : handlerObject , e.target.name, e.target.value
    let telObject = {};
    const handleTelChange=(e)=>{
        //console.log("tel",e.target.value,e.target.name);
        let value;
        //두 번째 전화번호 이거나 세 번째 전화번호이면
        if(e.target.name === "secondTelNum" || e.target.name === "lastTelNum"){
            // 숫자만 가능하고 자리수 제한 4자리까지 아니면 자리수 안내 경고 문구 반환
            value =  /^\d*$/.test(value) ? alert("숫자만 입력해주세요"): e.target.value;
            // 2. 최대 길이 확인  --> 빈 값일 때는 ??????
            if (value.length > 4) {
                alert("최대 4자리까지만 입력 가능합니다.");
                e.target.value="";
            }
        }else{
            value = e.target.value;
        }

        // 3. e.target.name과 value를 telObject 객체에 저장
        telObject[e.target.name] = value;
        // 3개의 전화번호를 합쳐서 setFormInfoData에 갱신해주기
        console.log("telObject",telObject);
        if (telObject.FirstTelNum && telObject.secondTelNum && telObject.lastTelNum) {
            // 'FirstTelNum', 'secondTelNum', 'lastTelNum' 값이 모두 있으면
            setformInfoData((prev) => ({
                ...prev,
                tel: `${telObject.FirstTelNum}-${telObject.secondTelNum}-${telObject.lastTelNum}`,
            }));

        }
        console.log("telObject------",telObject);

    }

    //email
    const [emailData, setemailData] = useState({
        emailId: "",
        emailAddrInput: "",
        emailAddrSelect: "직접선택",
    });
    //email
    useEffect(() => {
        if (emailData.emailId && emailData.emailAddrInput) {
            setformInfoData((prev) => ({
                ...prev,
                email: `${emailData.emailId}@${emailData.emailAddrInput}`,
            }));
        }
    },  [emailData.emailId, emailData.emailAddrInput]); // emailData가 변경될 때 실행

    //emailHandler
    const handleEmailChange = (e)=>{
        console.log("e.target.name", e.target.name);
        console.log("e.target.value", e.target.value);
    //...(스프레드 연산자)는 객체를 "펼쳐서" 새로운 객체에 병합하거나 추가하는 역할을 합니다.
        setemailData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
            ...(e.target.name === "emailAddrSelect" && { emailAddrInput: e.target.value }), // emailAddrSelect 처리
        }));
        //end
    }

    //주소
    const handleAddressSelect = (addressObject) => {

        // 다음 API에서 받은 데이터 infoData에 갱신해주기
        setformInfoData((prev)=>({
            ...prev,
            addr:addressObject.fullAddress,
            zoneCode:addressObject.zonecode,
        }));

    };
//

    console.log("formInfoData----",formInfoData);

//
    return(
        <>
            {/*아이디*/}
            <div>
                <label>아이디 </label>
                <input type="text" name="clientId" placeholder="아이디를 입력해주세요" value={formInfoData.clientId}
                       onChange={handleInputChange}
                />
                <Btn text="중복확인" type="button" onClick={() => {
                    handleIdConfirm("clientId", formInfoData.clientId)
                }}/>
                <span className="error"></span>

            </div>

            {/*비밀번호*/}
            <div>
                <label>비밀번호 </label>
                <input type="password" name="password" placeholder="비밀번호를 입력해주세요" value={formInfoData.password}
                       onChange={handleInputChange}/>
            </div>
            <div>
                <label>비밀번호 확인 </label>
                <input type="password" name="passwordConfirm" placeholder="비밀번호를 입력해주세요"
                       value={formInfoData.passwordConfirm} onChange={handleInputChange}/>
                {formInfoData.passwordErrorMessage && (
                    <span className="error">{formInfoData.passwordErrorMessage}</span>
                )}
            </div>
            {/*사원확인*/}
            <div className="Info staff">
                <label>사원여부</label>
                <div>
                    <label htmlFor="yes">예</label>
                    <input
                        type="radio"
                        id="yes"
                        name="yes"
                        value="yes"
                        checked={isStaff === "yes"} // 선택 상태 확인
                        onChange={handleStaffChange}
                    />

                    <label htmlFor="no">아니오</label>
                    <input
                        type="radio"
                        id="no"
                        name="no"
                        value="no"
                        checked={isStaff === "no"} // 기본값으로 설정
                        onChange={handleStaffChange}
                    />

                    {isStaff === "yes" && (
                        // 조건부 렌더링 시 다중 요소를 React Fragment로 감쌈
                        <>
                            <input
                                type="text"
                                name="staffId"
                                value={formInfoData.staffId}
                                onChange={handleInputChange}
                                placeholder="사원번호를 입력해주세요"
                            />
                            <Btn text="사원번호확인" type="button" onClick={()=>{
                                handleIdConfirm("staffId", formInfoData.staffId)
                            }}  />
                        </>
                    )}
                    {/* result.staffInfo가 존재하면 그 정보를 출력 */}
                    {result.staffInfo && (
                        <div>
                            <div><strong>사원번호:</strong> {result.staffInfo.staffId}</div>
                            <div><strong>사원명:</strong> {result.staffInfo.staffName}</div>
                            <div><strong>부서명:</strong> {result.staffInfo.departName}</div>
                            <div><strong>입사일:</strong> {result.staffInfo.startDate}</div>
                        </div>
                    )}

                </div>

            </div>
            {/*이름*/}
            <div className="Info name">
                <label>이름</label>
                <input type="text" name="userName" value={formInfoData.userName} onChange={handleInputChange}
                       placeholder="이름을 입력해주세요"/>
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
                <input type="text" name="emailId" onChange={handleEmailChange} value={emailData.emailId}
                       placeholder="ex)이메일아이디"/>
                <span id="at">@</span>
                <input type="text" name="emailAddrInput" onChange={handleEmailChange} value={emailData.emailAddrInput}
                       placeholder="ex)이메일주소"/>
                <select name="emailAddrSelect" onChange={handleEmailChange} value={emailData.emailAddrSelect}>
                    <option key="1" value="직접선택">직접선택</option>
                    <option key="2" value="naver.com">naver.com</option>
                    <option key="3" value="google.com">google.com</option>
                    <option key="4" value="daum.net">daum.net</option>
                </select>
                {/*<p>{emailCheckMessage}</p>*/}
            </div>

            {/*전화번호*/}
            <div className="Info tel">
                <label>전화번호</label>
                <select name="FirstTelNum" id="FirstTelNum" onChange={handleTelChange}>
                    <option key="1" value="직접선택">직접선택</option>
                    <option key="2" value="010">010</option>
                </select>
                <span>-</span>
                <input type="text" name="secondTelNum" onChange={handleTelChange} placeholder={`"두 번째 전화번호 입력"`}/>
                <span>-</span>
                <input type="text" name="lastTelNum" onChange={handleTelChange} placeholder={`"마지막 번째 전화번호 입력"`}/>
            </div>
            {formInfoData.errorMessage && (
                <span className="error">{formInfoData.errorMessage}</span>
            )}

            {/*주소*/}
            <div className="Info Address">
                <div>
                    {/* 카카오톡 API 주소 , 각각 갈라서 백으로 전달*/}
                    <label>주소 </label>
                    <input type="text" name="addr" value={formInfoData.addr} placeholder="주소"/>
                    <input type="text" name="zoneCode" value={formInfoData.zoneCode} placeholder="우편번호"/>
                    <DaumPostcode onAddressSelect={handleAddressSelect}/>
                </div>
                <div>
                    <label>상세주소</label>
                    <input type="text" name="detailAddr" value={formInfoData.detailAddr} onChange={handleInputChange}
                           placeholder="상세주소 입력"/>
                </div>
            </div>
        </>
    )
}

export default SignUpInfo;


//react -select https://react-select.com/home
// React-Select는 기본적으로 name 속성을 전달하지 않으므로, onChange 핸들러에서 name 정보를 가져오려면 별도의 설정이
// Select 컴포넌트에 inputId 속성을 사용하거나, onChange 핸들러의 두 번째 매개변수를 활용
