import React, {useState} from "react";
import FormTag from "@util/form/formTag.jsx";
import Btn from "@util/form/reuseBtn.jsx";


const StaffConfirm =({formData,setFormData}) =>{
    // 사원여부
    const [isStaff, setIsStaff] = useState("no"); // 기본값을 "no"(아니오)로 설정

    // 라디오 버튼 변경 핸들러
    const handleStaffChange = (e) => {

        setIsStaff(e.target.value);

    };


    //input onChange 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target; // 입력 필드의 name과 value 가져오기
        setFormData({ ...formData, [name]: value });

    };


    return(
        <>
            {/*member : 라디오버튼은 같은 그룹이면 name 이 동일해야 함 */}
            <div className="staff-comfirm">
                <fieldset className="row col-12 mb-2">
                    <legend className="form-title col-2">사원여부</legend>
                    <div className="d-flex align-items-center mb-2 radio-group">
                        <FormTag
                            label="예"
                            labelClass="me-2 w-auto"
                            className="me-5  w-auto"
                            id="radio-yes"
                            name="radio"
                            value="yes"
                            type="radio"
                            checked={isStaff ==="yes"} // 선택 상태 확인 checked 속성값은  true/false
                            onChange={(e)=>handleStaffChange(e)}
                        />
                        <FormTag
                            label="아니오"
                            labelClass="me-2 w-auto"
                            className="me-5  w-auto"
                            id="radio-no"
                            name="radio"
                            value="no"
                            type="radio"
                            checked={isStaff ==="no"} // 선택 상태 확인 checked 속성값은  true/false
                            onChange={(e)=>handleStaffChange(e)}

                        />
                    </div>

                    {isStaff === "yes" && (
                    <div className="d-flex align-items-center px-0">
                        <FormTag
                            label="사원번호"
                            labelClass="form-title sr-only"
                            className="form-control w-50"
                            id="staffId"
                            name="staffId"
                            value={formData.staffId}
                            type="text"
                            onChange={handleInputChange}
                            placeholder="사원번호 입력"
                        />
                        <Btn
                            text="사원번호확인"
                            type="button"
                            className="btn custom-btn01 form-control ms-1 py-2 "
                            onClick={() => {
                                handleConfirm("staffId", formData.staffId,{
                                    clientName: formData.clientName,
                                    tel: formData.tel
                                });
                            }}
                        />
                    </div>
                    )}
                </fieldset>

            </div>
        </>
    )
}

export default StaffConfirm;