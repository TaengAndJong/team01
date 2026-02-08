import React, {useState} from "react";
import FormTag from "@util/form/formTag.jsx";
import Btn from "@util/form/reuseBtn.jsx";
import axios from "axios";
import {catchError} from "../../../util/error/error.jsx";
import {useModal} from "../../common/modal/ModalContext.jsx";


const StaffConfirm =({formData,setFormData}) =>{

    //공통모달
    const {openModal,closeModal} = useModal();
    //사용자에게 보여줄 메시지 관리
    const [msg, setMsg] = useState({});

    // 라디오 버튼 변경 핸들러
    const staffChangHandler = (e) => {
        setFormData((prevState) => ({...prevState, isStaff: e.target.value}));
    };

    //input onChange 핸들러
    const inputChangeHandler = (e) => {
        const { name, value } = e.target; // 입력 필드의 name과 value 가져오기
        setFormData({ ...formData, [name]: value });
    };

    //사원검증 onClick 핸들러
    const staffConfirmHandler = async (e) => {
        console.log("e", e.target.value,e.target.name);
        //사원번호 값에 대한 1차검증
        if(!formData?.staffId){
            setMsg({
                valid: false,
                message : "사원번호입력 필요"
            });
            return; // 여기서 코드 종료
        }

        try {
            //사원번호가 있다면 서버로 검증 요청 (데이터 전송할 때는 post 요청, 보안 )
            const response = await axios.post("/api/signup/staffConfirm",
                {
                    staffId:formData?.staffId,
                    isStaff:formData?.isStaff,
                    staffName:formData?.clientName,
                    staffEmail:formData?.email,
                    staffTelNum:formData?.tel,
                });

            //응답 성공
            console.log("response 사원검증에 대한 서버의 응답",response);
            // 성공했을 경우 모달
            openModal({
                modalType: "default",
                content:<p>사원번호 확인완료</p>,
                onConfirm: () => {closeModal()},
            });

            //안내할 검증이 없다면
            setMsg ({
                valid: true,
                message:""
            });
        } catch (err) {  //실패 : 서버가 보내 온 예외
             console.log("사원검증 에러 ",err);
            //에러처리
            catchError(err, { openModal, closeModal});
        }

    }

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
                            checked={formData?.isStaff ==="yes"} // 선택 상태 확인 checked 속성값은  true/false
                            onChange={staffChangHandler}
                        />
                        <FormTag
                            label="아니오"
                            labelClass="me-2 w-auto"
                            className="me-5  w-auto"
                            id="radio-no"
                            name="radio"
                            value="no"
                            type="radio"
                            checked={formData?.isStaff ==="no"} // 선택 상태 확인 checked 속성값은  true/false
                            onChange={staffChangHandler}

                        />
                    </div>

                    {formData?.isStaff === "yes" && (
                    <div className="d-flex align-items-center px-0">
                        <FormTag
                            label="사원번호"
                            labelClass="form-title sr-only"
                            className="form-control w-50"
                            id="staffId"
                            name="staffId"
                            value={formData?.staffId}
                            type="text"
                            onChange={inputChangeHandler}
                            placeholder="사원번호 입력"
                        />
                        <Btn
                            text="사원번호확인"
                            type="button"
                            className="btn custom-btn01 form-control ms-1 py-2 "
                            onClick={staffConfirmHandler}
                        />
                    </div>
                    )}
                    {msg.message && (
                        <div className="d-flex align-items-center my-2" role="alert">
                            <i className="icon info me-2"></i>{msg.message}
                        </div>
                    )}
                </fieldset>
            </div>
        </>
    )
}

export default StaffConfirm;