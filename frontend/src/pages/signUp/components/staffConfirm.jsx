import React, {useState} from "react";
import FormTag from "../../../util/formTag.jsx";
import Btn from "../../../util/reuseBtn.jsx";
import {validID} from "../../../util/validation.jsx";

const StaffConfirm =({formData,setFormData,msg,setMsg,handleConfirm}) =>{
    // 사원여부
    const [isStaff, setIsStaff] = useState("no"); // 기본값을 "no"(아니오)로 설정
    console.log("isStaff : ",isStaff);

    // 라디오 버튼 변경 핸들러
    const handleStaffChange = (e) => {
        console.log("handleStaffChange e.target.value :", e.target.value);
        setIsStaff(e.target.value);

    };

    console.log("handleStaffChange isStaff:",isStaff);
    //input onChange 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target; // 입력 필드의 name과 value 가져오기
        setFormData({ ...formData, [name]: value });

    };


    return(
        <>
            {/*member : 라디오버튼은 같은 그룹이면 name 이 동일해야 함 */}
            <div className="d-flex align-items-center mb-2">
                <strong className="form-title">사원검증</strong>
                <FormTag
                    label="예"
                    htmlFor="yes"
                    labelClass="me-2"
                    className="me-5"
                    id="yes"
                    name="radio"
                    value="yes"
                    type="radio"
                    checked={isStaff ==="yes"} // 선택 상태 확인 checked 속성값은  true/false
                    onChange={(e)=>handleStaffChange(e)}
                />
                <FormTag
                    label="아니오"
                    htmlFor="no"
                    labelClass="me-2"
                    id="no"
                    name="radio"
                    value="no"
                    type="radio"
                    checked={isStaff ==="no"} // 선택 상태 확인 checked 속성값은  true/false
                    onChange={(e)=>handleStaffChange(e)}

                />
            </div>
            {isStaff === "yes" && (
                <div className="d-flex align-items-center mb-1">
                    <FormTag
                        label="사원번호"
                        labelClass="form-title"
                        className="form-control w-75"
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
                        className="btn-primary ms-1 w-25"
                        onClick={() => {
                            handleConfirm("staffId", formData.staffId,{
                                clientName: formData.clientName,
                                tel: formData.tel
                            });
                        }}
                    />
                </div>
            )}

        </>
    )
}

export default StaffConfirm;