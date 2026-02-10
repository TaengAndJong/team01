
import React from "react";
import FormTag from "../../../../util/form/formTag.jsx";
import Select from "react-select";


/*
* value가 있을 경우 onChange이벤트 핸들러가 정의가 되어있지 않으면, readOnly 속성을 명시해줘야 함
*  aria-reaonly = true 는 스크린리더의 접근 기준
* */

const RetrieveInfo=({userInfo,onEdit})=>{



    return(
        <>
            {/*id*/}
            <div className="retrieveForm" aria-labelledby="userInfoTitle">
                <div className="d-flex align-items-center mb-2 justify-content-start">
                    <FormTag label="아이디" labelClass="form-title" id="clientId" className="form-control w-auto" name="clientId"
                             type="text"
                             value={userInfo?.clientId}
                             readOnly={true}
                             aria-readonly="true"/>
                </div>
                <div className="d-flex align-items-center mb-2 justify-content-start">
                    <FormTag label="비밀번호" labelClass="form-title" id="password" className="form-control w-auto" name="password"
                             type="password"
                             value={"********"} // 실제 비밀번호를 내려주지 않음
                             readOnly={true}    // 수정 방지 ==> 사용자가 입력할 수 없지만 포커스는 가능
                             // disabled={true}  // 클릭/입력 방지 ==> 아예 상호작용 불가, 스타일도 비활성화됨
                             aria-readonly="true"  // 스크린리더용
                             onFocus={(e)=> e.target.blur()}// 포커스 못가게 추가
                    />
                </div>
                {/*생년월일*/}
                <div className="Info birth d-flex align-items-center mb-1 w-100">
                    <FormTag id="birth" label="생년월일" labelClass="form-title"
                             className="form-control w-auto"
                             name="birth"
                             type="text"
                             value={userInfo?.birth}
                             placeholder="생년월일"
                             readOnly={true}
                             aria-readonly="true"/>
                </div>

                {/*전화번호*/}
                <div className="d-flex align-items-center mb-2">
                    <FormTag id="tel" label="전화번호" labelClass="form-title"
                             className="form-control w-auto"
                             name="tel"
                             type="text"
                             value={userInfo?.tel}
                             placeholder="전화번호"
                             readOnly={true}
                             aria-readonly="true"/>
                </div>
                {/*이메일*/}
                <div className="d-flex align-items-center mb-2">
                    <FormTag id="email" label="이메일" labelClass="form-title"
                             className="form-control w-100"
                             name="email"
                             type="text"
                             value={userInfo?.email}
                             placeholder="이메일"
                             readOnly={true}
                             aria-readonly="true"/>
                </div>
                {/* 주소 */}
                <div className="d-flex flex-column mb-3">

                    <div className="d-flex align-items-center w-100 mb-2">
                        <FormTag
                            label="주소"
                            labelClass="form-title" className="form-control w-100"
                            id="addr"
                            name="addr"
                            value={userInfo?.addr}
                            placeholder="주소"
                            readOnly={true}
                            aria-readonly="true"
                        />
                    </div>
                    <div className="d-flex align-items-center w-100 mb-2">
                        <FormTag
                            label="상세주소"
                            labelClass="form-title" className="form-control w-100"
                            id="detailAddr"
                            name="detailAddr"
                            value={userInfo?.detailAddr}
                            placeholder="상세주소 "
                            readOnly={true}
                            aria-readonly="true"
                        />
                        <FormTag
                            label="우편번호"
                            labelClass="form-title ms-4" className="form-control w-auto"
                            id="zoneCode"
                            name="zoneCode"
                            value={userInfo?.zoneCode}
                            placeholder="우편번호"
                            readOnly={true}
                            aria-readonly="true"
                        />
                    </div>

                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-5  border-top pt-5">
                    <button id="modifyBtn" className="btn custom-btn00 me-md-2" type="button" onClick={()=> onEdit()}>개인정보변경</button>
                </div>
            </div>

        </>
    )

}

export default RetrieveInfo;