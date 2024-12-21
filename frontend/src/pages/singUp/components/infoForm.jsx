import {useState} from "react";

const infoForm = ({formData,onInputChange}) =>{
    return (
        <>
            <div>사용자 정보 폼</div>
            <div>
                <label>이름</label>
                <input type="text" name="name" placeholder="이름을 입력해주세요" onChange={onInputChange}
                       value={formData.name}
                       maxLength={20}/>

            </div>

        </>
    )
}

export default infoForm;