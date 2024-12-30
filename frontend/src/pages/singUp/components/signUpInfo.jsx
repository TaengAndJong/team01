import Btn from "../../../util/reuseBtn.jsx";
import {checkDuplicate, validatePasswordMatch, validID, validPW} from "../../../util/validation.jsx";
import {useContext, useState} from "react";
import DaumPostcode from "../../../util/daumPostcode.jsx";
import { signUpDispatchContext} from "../SignUpComponent"; // 부모 컴포넌트에서 제공한 signUpContext를 import



const SignUpInfo = () => {
    // 부모 컴포넌트인 SignUpForm 에서 context.provider의 value  로 전달 받은 context 값 받아오기
   const { formData, dispatch} = useContext(signUpDispatchContext);
   const [formInfoData,setformInfoData] = useState("");
    console.log("formData",formData);
    console.log("formInfoData",formInfoData);

    // input에 입력된 텍스트를 중복검사 버튼을 눌렀을 때 상태변화가 일어나게 만들자.. dispatch 를 사용하면 계속 갱신되서 값이 유지가 안됨
    //여기서 formData 전부 갱신 저장 ??해야 할 듯한데 ...머리아프다 handleInputChange 사용해야하느니디이이이
    // 목표 : handleIdChange의 Id 값을 dispatch 함수로 formData 초기값 갱신
    //dispatch 함수 설정하기
    const handleIdChange = (e) => {
        console.log("name---", e.target.name);
        console.log("inputId---",e.target.value);

        const newClientId = e.target.value;
        setformInfoData((prev) => ({
            ...prev,
            clientId: newClientId,
        }));
    };

    //아이디 검증하기
    const handleConfirm = async () => {

    // 서버와 비동기 통신하여 중복 확인 , field이름은 ""(문자열)
        const apiAddr = "/api/signUp/checkDuplicate"
        const params = new URLSearchParams({ clientId:formInfoData.clientId});
        console.log(apiAddr,formInfoData.clientId);

        // params에서 key만 가져오기
        const keys = Array.from(params.keys());  // ["clientId"]
        console.log(keys);  // ["clientId"]

        const values = Array.from(params.values());  // ["clientId"]
        console.log(values);  // ["clientId"]

        // 비동기 함수 호출 //field는 name을 의미하기때문에 문자열("clientId")로 , field의 값이 value니까 value로 전달

        try {
            const result = await checkDuplicate(apiAddr,`${keys.toString()}`,`${values.toString()}`);
            console.log(result);
            alert(result.message);  // 중복 여부 메시지 출력
        }catch(err) {
            console.error("중복 확인 중 오류 발생:", error);

        }
    };

    const handleAddressSelect = (address) => { // 우편번호 검색한 데이터를 입력해주는 handler
        onInputChange('adr', address); // adr 필드 업데이트
    };

//
    return(
        <>
            {/*아이디*/}
            <div >
                <label>아이디 </label>
                <input type="text" name="clientId" placeholder="아이디를 입력해주세요" value={formInfoData.clientId}
                       onChange={handleIdChange}
                />
                <Btn text="중복확인" type=""  onClick={()=>{handleConfirm()}} />

            </div>

            {/*비밀번호*/}
            <div>
                <label>비밀번호 </label>
                <input type="password" name="pw" placeholder="비밀번호를 입력해주세요"   />
            </div>
            <div>
                <label>비밀번호 확인 </label>
                <input type="password" name="pwd" placeholder="비밀번호를 입력해주세요"
                       maxLength={20}/>
                {/*<p>비밀번호 경고문 입력하기</p>*/}
            </div>
           
            <h4>-----------------------------------</h4>
            {/*이름*/}
            <div className="Info name">
                <label>이름</label>
                <input type="text" name="name" id="userName" placeholder="이름을 입력해주세요"

                />
            </div>
            {/*생일*/}
            <div className="Info birth">
                <label>생년월일</label>
                {/*연,월,일 데이터로 뿌리기*/}
                <select name="birthYear" id="birthYear"  value=""  onChange="">
                    <option key="1" value="">직접선택</option>
                </select>
            </div>
            {/*이메일*/}
            <div className="Info email">
                <label>이메일 </label>
                <input type="text" name="emailId" id="emailId" placeholder="ex)이메일아이디"

                />
                <span id="at">@</span>
                {/*메일주소 데이터로 뿌리기*/}
                <select name="emailAddr" id="emailAddr"  >
                    <option key="1" value="">직접선택</option>
                </select>
                {/*<p>{emailCheckMessage}</p>*/}
            </div>

            {/*전화번호*/}
            <div className="Info tel">
                <label>전화번호 </label>
                {/*첫번째 전화번호 스크립트 조작*/}
                <select name="FirstTelNum" id="FirstTelNum"  >
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
            <div className="Info Adsress">
                <div>
                    {/* 카카오톡 API 주소 , 각각 갈라서 백으로 전달*/}
                    <label>주소 </label>
                    <input type="text" name="zipCode" placeholder="우편번호입력" />
                    <DaumPostcode onAddressSelect={handleAddressSelect}/>

                </div>
                <div>
                    <label>상세주소 </label>
                    <input type="text" name="dtailAdr" placeholder="상세주소를 입력해주세요"

                    />
                </div>
            </div>
        </>
    )
}

export default SignUpInfo;