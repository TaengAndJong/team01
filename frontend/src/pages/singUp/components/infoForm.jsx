import {useState} from "react";
import DaumPostcode from "../../../util/daumPostcode.jsx";

const infoForm = ({formData,onInputChange}) =>{
    const [name, setName] = useState('');

    const emailChangeHandle = (e) => {
        const newEmail = e.target.value;
        onInputChange("email", newEmail);
    }

    const handleAddressSelect = (address) => {
        onInputChange('adr', address); // adr 필드 업데이트
    };

    const adrHandle = (e) => {
        const newAdr = e.target.value;
        onInputChange('adr', newAdr)
    }

    const dtailAdrHandle = (e) => {
        const newDtailAdr = e.target.value;
        onInputChange('dtailAdr',newDtailAdr);
    }
    return (
        <>
            <div>사용자 정보 폼</div>
            <div>
                <label>이름 </label>
                <input type="text" name="name" placeholder="이름을 입력해주세요"
                       value={formData.name}
                       maxLength={20}/>
            </div>
            <div>
                <label>전화번호 </label>
                <input type="text" name="phone" placeholder={`"-" 생략해 주세요`}
                       value={formData.phone}
                       maxLength={20}/>
            </div>
            <div>
                <label>주민번호 </label>
                <input type="text" name="f_IdentiNum" placeholder="앞자리 번호를 입력해주세요"
                       value={formData.f_IdentiNum}
                       maxLength={20}/>
                <span>-</span>
                <input type="text" name="s_IdentiNum" placeholder="뒷자리 번호를 입력해주세요"
                       value={formData.s_IdentiNum}
                       maxLength={20}/>
            </div>
            <div>
                <label>주소 </label>

                <input type="text" name="adr" placeholder="주소를 입력해주세요"
                       value={formData.adr}
                       maxLength={20}
                       onChange={adrHandle}
                />
                <DaumPostcode onAddressSelect={handleAddressSelect}/>
            </div>
            <div>
                <label>상세주소 </label>
                <input type="text" name="dtailAdr" placeholder="상세주소를 입력해주세요"
                       value={formData.dtailAdr}
                       maxLength={20}
                       onChange={dtailAdrHandle}
                />

            </div>
            <div>
                <label>이메일 </label>
                <input type="text" name="email" placeholder="ex) text@exemple.com"
                       value={formData.email}
                       maxLength={20}
                       onChange={emailChangeHandle}
                    />
            </div>

        </>
    )
}

export default infoForm;