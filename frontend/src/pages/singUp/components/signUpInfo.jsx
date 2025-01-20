import Select from 'react-select';
import React,{useState,useEffect} from "react";

import Btn from "../../../util/reuseBtn.jsx";
import FormTag from "../../../util/formTag.jsx"
import {validID, validPW, validEachTel,checkDuplicate, validatePasswordMatch} from "../../../util/validation.jsx";
import DaumPostcode from "../../../util/daumPostcode.jsx";
import {generateOptions} from "../../../util/selectDate.jsx";



const SignUpInfo = ({formData,setFormData}) => {


    useEffect(() => {
    }, [formData]);  // formInfoData가 변경될 때마다 실행

    //에러 상태 초기화 관리
    const [msg, setMsg] = useState({
        errorId:"",
        errorpwd:"",
        errorpwdConfirm:"",
        errorEmail:"",
        errorAddr:"",
        errorTel:"",
        errorMemNum:"",
        errorBirth:"",
        memberMsg:""
    });
    // 공통 onChange 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target; // 입력 필드의 name과 value 가져오기
        setFormData({ ...formData, [name]: value });

         // 아이디 유효성 검사
         if (name === "clientId") {
            const idValidation = validID(value);
            setMsg((prev) => ({
                ...prev,
                errorId: idValidation.valid ? "" : idValidation.message,
            }));
       }
//
    };

// 비밀번호 데이터가 변경될 때마다 갱신
    useEffect(() => {
        // 비밀번호 동일 여부 확인 , 바로 데이터를 파라미터로 넘겨주기
        const pwdConfirm = validatePasswordMatch(formData.password, formData.passwordConfirm);
        setMsg((prev) => ({
            ...prev,
            errorpwdConfirm: pwdConfirm.valid ? "" : pwdConfirm.message,
        }));

        // 비밀번호 유효성 검사
        const pwValidation = validPW(formData.password);
        setMsg((prev) => ({
            ...prev,
            errorpwd: pwValidation.valid ? "" : pwValidation.message,
        }));
    }, [formData.password, formData.passwordConfirm]);


    //아이디와 검증 핸들러
    const handleIdConfirm = async (fieldName) => {
        // 서버와 비동기 통신하여 중복 확인 , field이름은 ""(문자열)
        const apiAddr = "/api/signUp/checkDuplicate"
        const params = new URLSearchParams({ [fieldName]: formData[fieldName] });
        //  const params = new URLSearchParams({ clientId:formInfoData.clientId});
        // 비동기 함수 호출
        try {
            // 비동기 함수 호출 (fieldName과 해당 값을 전달 , 아이디 중복검증 비동기 요청)
            const userInfo = await checkDuplicate(apiAddr, fieldName, params.get(fieldName));
                console.log("userInfo-------",userInfo)
            //사원번호와 아이디 검증 분기점
            if (userInfo.message.includes("사원번호")) {

                setMsg((prevState) =>(
                    {
                        ...prevState,
                        memberMsg: userInfo.message
                    }))

                setFormData((prevState) =>(
                    {
                        ...prevState,
                        roleId:userInfo.roleId,
                        joinDate:userInfo.joinDate,
                    }
                ));
            }else{
                setMsg((prevState) =>(
                    {
                        ...prevState,
                        errorId: userInfo.message
                    }))
            }


        } catch (err) {
            console.error(`중복 확인 중 오류 발생 (${fieldName}):`, err);
        }
    };

    //birth handler
    //react-select Api에서 생년월일 가져오기
    const yearOptions = generateOptions(1920, 2030, "년"); // 1990년부터 2024년까지
    const monthOptions = generateOptions(1, 12, "월", true); // 1월부터 12월까지 (0 패딩)
    const dayOptions = generateOptions(1, 31, "일", true); // 1일부터 31일까지 (0 패딩)
    
    const [birth, setBirth] = useState({})
    const handleBirthChange= (selectedOption,name) => {

        // 2. 기존 값을 불러와서 키-값 형태로 설정 (객체에 key : value  추가) , name에 따른 vale에 2자리 중 빈자리 0 추가
        if (name === 'birthMonth' || name === 'birthDay') {
            //  name에 따른 value에 2자리 중 빈자리 0 추가
            const value = String(selectedOption.value).padStart(2, "0");

            setBirth((prevState) => ({
                ...prevState,
                [name]: value, // 이전 상태를 유지하면서 name에 해당하는 값만 업데이트
            }));

            console.log("birth=------",birth)
        } else {
            // birthYear인 경우 그냥 추가
            setBirth((prevState) => ({
                ...prevState,
                [name]: selectedOption.value,
            }));

            console.log("birth=------",birth)
        }

    }

    //birth 상태 변경 될 때마다 갱신
    useEffect(() => {
        // '년, 월 ,일 ' 모든 값이 있을 때만 infoDate의 'birth'를 갱신
        if (birth.birthYear && birth.birthMonth && birth.birthDay) {
            // 'birthYear', 'birthMonth', 'birthDay' 값이 모두 있으면
            setFormData((prev) => ({
                ...prev,
                birth: `${birth.birthYear}-${birth.birthMonth}-${birth.birthDay}`,
            }));
        }

    }, [birth]);


    //주소
    const handleAddressSelect = (addressObject) => {

        // 다음 API에서 받은 데이터 infoData에 갱신해주기
        setFormData((prev)=>({
            ...prev,
            addr:addressObject.fullAddress,
            zoneCode:addressObject.zonecode,
        }));

    };

    //이메일
    const [emailData, setemailData] = useState({
        emailId: "",
        emailAddrInput: "",
        emailAddrSelect: "직접선택",
    });
    //email
    useEffect(() => {
        if (emailData.emailId && emailData.emailAddrInput) {

            setFormData((prev) => ({
                ...prev,
                email: `${emailData.emailId}@${emailData.emailAddrInput}`,
            }));
        }
    },  [emailData.emailId, emailData.emailAddrInput]); // emailData가 변경될 때 실행

    // 이메일 유효성 검사 및 중복 검사
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

    //전화번호 : handlerObject , e.target.name, e.target.value
    const [tel, setTel] = useState({}); // 빈값으로 두면 undefind로 출력되기때문에 태그요소 value 초기값 설정하기
    const handleTelChange=(eventTarget,name)=>{
        // Select 컴포넌트의 onChange
        if (name) { // 파라미터에 name값이 넘어올 경우
            setTel((prevState) => ({
                ...prevState,
                [name]: eventTarget.value,
            }));
        } else {
            // FormTag 컴포넌트의 onChange
            const { name, value } = eventTarget.target;
            console.log("Input change: ", name, value);

            // 전화번호 업데이팅 되기전 두 or 세번째 데이터  검증 후 업데이팅
            if(name === "secondTelNum" || name === "lastTelNum"){

                //true ,false 반환
                const eachTelNumVailid = validEachTel(name,value);
                //한번만 갱신하면됨
                setMsg((prev) => ({
                    ...prev,
                    errorTel: eachTelNumVailid.valid ? "" : eachTelNumVailid.message, // true , false 에 따라 출력
                }));

            }
        //전화번호 입력값 상태관리
        setTel((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        //
        }

        return tel;
    }

    // tel 객체 갱신될 때마다 반영
    useEffect(()=>{
        // 전체 데이터 formData에 갱신하기
        if (tel.FirstTelNum && tel.secondTelNum && tel.lastTelNum) {
            // FormInfoData의 tel 갱신
            setFormData((prev) => ({
                ...prev,
                tel: `${tel.FirstTelNum}-${tel.secondTelNum}-${tel.lastTelNum}`
            }));
        }
    },[tel])



//사원여부 --> 이름, 생년월일, 전화번호, 사원번호로 조회하여 확인하기

    // 사원여부
    const [isStaff, setIsStaff] = useState("no"); // 기본값을 "no"(아니오)로 설정
    // 라디오 버튼 변경 핸들러
    const handleStaffChange = (e) => {

        setIsStaff(e.target.value);
    };


    console.log("formData", formData);
    //
    return(
        <>
            {/*아이디*/}
            <form>
                {/*id*/}
                <div>
                    <FormTag label="아이디" name="clientId"
                             value={formData.clientId}
                             onChange={handleInputChange} msg={msg.errorId}/>
                    <Btn text="중복확인" type="button" onClick={() => {
                        handleIdConfirm("clientId", formData.clientId)
                    }}/>
                </div>

                {/*pw*/}
                <div>
                    <FormTag label="비밀번호" name="password" type="password"
                             value={formData.password}
                             onChange={handleInputChange} msg={msg.errorpwd}/>
                    <FormTag label="비밀번호확인" name="passwordConfirm"  type="password"
                             value={formData.passwordConfirm }
                             onChange={handleInputChange} msg={msg.errorpwdConfirm}/>
                    <FormTag label="이름" name="clientName"
                             value={formData.clientName}
                             onChange={handleInputChange}/>
                </div>
                {/* 생년월일 */}
                <div>
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
                </div>
                {/*전화번호*/}
                <div>
                    <Select
                        name="FirstTelNum"
                        id="FirstTelNum"
                        onChange={(selectedOption) => {
                            console.log("selectedOption", selectedOption);
                            handleTelChange({ target: { name:"FirstTelNum", value: selectedOption.value } });
                        }}
                        options={[
                            { value: '직접선택', label: '직접선택' },
                            { value: '010', label: '010' },
                        ]}
                    />
                    <span>-</span>
                    <FormTag
                        name="secondTelNum"
                        value={tel.secondTelNum || ""}
                        onChange={handleTelChange}
                        placeholder="두 번째 전화번호 입력"
                    />
                    <span>-</span>
                    <FormTag
                        name="lastTelNum"
                        value={tel.lastTelNum || ""}
                        onChange={handleTelChange}
                        placeholder="마지막 전화번호 입력"
                    />
                    {msg.errorTel && (
                        <span>{msg.errorTel}</span>
                    )}
                </div>
                {/*이메일*/}
                <div>
                    <FormTag
                        label="이메일아이디"
                        name="emailId"
                        value={emailData.emailId}
                        onChange={handleEmailChange}
                        placeholder="ex) 이메일아이디"
                    />
                    <span id="at">@</span>
                    <FormTag
                        label="이메일주소"
                        name="emailAddrInput"
                        value={emailData.emailAddrInput}
                        onChange={handleEmailChange}
                        placeholder="ex) 이메일주소"
                    />

                    <Select
                        name="emailAddrSelect"
                        value={{ value: emailData.emailAddrSelect, label: emailData.emailAddrSelect }}
                        onChange={(selectedOption) => {
                            console.log("selectedOption", selectedOption);
                            handleEmailChange({ target: { name: 'emailAddrSelect', value: selectedOption.value } });
                        }}
                        options={[
                            { value: '직접선택', label: '직접선택' },
                            { value: 'naver.com', label: 'naver.com' },
                            { value: 'google.com', label: 'google.com' },
                            { value: 'daum.net', label: 'daum.net' },
                        ]}
                    />

                </div>

                {/*주소*/}
                <div>
                    <FormTag
                        label="주소"
                        name="addr"
                        value={formData.addr}
                        placeholder="주소"
                        onChange={handleInputChange}
                    />
                    <FormTag
                        label="우편번호"
                        name="zoneCode"
                        value={formData.zoneCode}
                        placeholder="우편번호"
                        onChange={handleInputChange}
                    />
                    <DaumPostcode onAddressSelect={handleAddressSelect} />
                    <FormTag
                        label="상세주소"
                        name="detailAddr"
                        value={formData.detailAddr}
                        onChange={handleInputChange}
                        placeholder="상세주소 입력"
                    />
                </div>
                {/*member*/}
                <div>
                    <FormTag
                        label="예"
                        name="isStaff"
                        value="yes"
                        type="radio"
                        checked={isStaff === "yes"} // 선택 상태 확인
                        onChange={handleStaffChange}
                        htmlFor="yes"
                    />
                    <FormTag
                        label="아니오"
                        name="isStaff"
                        value="no"
                        type="radio"
                        checked={isStaff === "no"} // 선택 상태 확인
                        onChange={handleStaffChange}
                        htmlFor="no"
                    />
                    {isStaff === "yes" && (
                        <>
                            <FormTag
                                label="사원번호"
                                name="staffId"
                                value={formData.staffId}
                                type="text"
                                onChange={handleInputChange}
                                placeholder="사원번호를 입력해주세요"
                                msg={msg.memberMsg}
                            />
                            <Btn
                                text="사원번호확인"
                                type="button"
                                onClick={() => {
                                    handleIdConfirm("staffId", formData.staffId);
                                }}
                            />
                        </>
                    )}
                </div>

            </form>
        </>
    )
}

export default SignUpInfo;


//react -select https://react-select.com/home
// React-Select는 기본적으로 name 속성을 전달하지 않으므로, onChange 핸들러에서 name 정보를 가져오려면 별도의 설정이
// Select 컴포넌트에 inputId 속성을 사용하거나, onChange 핸들러의 두 번째 매개변수를 활용
