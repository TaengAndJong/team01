import Btn from "../../../util/reuseBtn.jsx";
import {checkDuplicate, validatePasswordMatch, validID, validPW} from "../../../util/validation.jsx";
import {useContext, useState} from "react";
import DaumPostcode from "../../../util/daumPostcode.jsx";

const SignUpInfo = () => {
    // 부모 컴포넌트인 SignUpForm 에서 context.provider의 value  로 전달 받은 사용자 정의 훅 가져오기
    // `useSignUpContext`로 context에서  데이터 가져오기
   const {formData,handleInputChange} = useContext(signUpContext);

    // id handler
    const handleIdChange = (e) => {
        const newId = e.target.value;
        onInputChange("id", newId);  // 부모로 상태 전달

        const validationResult = validID(newId);
        if(validationResult && validationResult.massage) {
            setIdCheckMessage(validationResult.massage);
        } else {
            setIdCheckMessage('대소문자, 숫자를 포함한 ~20자 이내');
        }
    }


    return(
        <>
            {/*아이디*/}
            <div >
                <label>아이디 </label>
                <input type="text" name="id" placeholder="아이디를 입력해주세요" onChange={handleIdChange}
                      />
                <Btn text="중복확인" type="" onClick={() => {
                    alert(checkDuplicate(id).massage);
                }}/>
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
                <select name="emailAddr" id="emailAddr"  >
                    <option key="1" value="">직접선택</option>
                </select>
                <p>{emailCheckMessage}</p>
            </div>

            {/*전화번호*/}
            <div className="Info tel">
                <label>전화번호 </label>
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
                    <p> 카카오톡 API 주소 이용하는 법 </p>
                    <label>주소 </label>

                    <input type="text" name="zipCode" placeholder="우편번호입력"

                    />
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