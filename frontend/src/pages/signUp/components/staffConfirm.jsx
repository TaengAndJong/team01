import React, {useState} from "react";
import FormTag from "../../../util/formTag.jsx";
import Btn from "../../../util/reuseBtn.jsx";

const StaffConfirm =({formData,setFormData,msg,setMsg}) =>{
    //이거 공통으로 뺴야하나 ?
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

    // 사원여부
    const [isStaff, setIsStaff] = useState("no"); // 기본값을 "no"(아니오)로 설정
    // 라디오 버튼 변경 핸들러
    const handleStaffChange = (e) => {
        setIsStaff(e.target.value);
    };


    return(
        <>
            {/*member*/}
            <div className="d-flex align-items-center mb-1">
                <strong className="form-title">사원검증</strong>
                <FormTag
                    label="예"
                    labelClass="me-2"
                    className="me-5"
                    name="isStaff"
                    value="yes"
                    type="radio"
                    checked={isStaff === "yes"} // 선택 상태 확인
                    onChange={handleStaffChange}
                    htmlFor="yes"
                />
                <FormTag
                    label="아니오"
                    labelClass="me-2"
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

        </>
    )
}

export default StaffConfirm;