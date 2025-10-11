import IdAndpw from "./idAndpw.jsx";
import Birth from "./birth.jsx";
import Tel from "./tel.jsx";
import Email from "./email.jsx";
import Address from "./address.jsx";
import React, {useEffect} from "react";
import axios from "axios";
import {useModal} from "../../../common/modal/ModalContext.jsx";
import {useNavigate} from "react-router-dom";


const EditInfo = ({userInfo,setUserInfo,msg,setMsg,errorData,onEdit})=>{

    console.log("개인정보수정 :============  userInfo",userInfo);
    /*
    * 아이디, 생년월일 변경불가
    * 비밀번호 변경 따로 ? ,
    * 우편번호 변경버튼
    * 주소, 전화번호, 이메일 변경 가능
    * 
    * 필요 함수 => 텍스트 입력시 바로 변경할 수 있는 이벤트 함수 onChange
    * 변경 시 바로 userInfo에 담아서 변경데이터 반영해줘야 함
    * */

    //모달 안내창
    const {openModal,closeModal} = useModal();
    //네비게이트
    const navigate = useNavigate();
    //signUp post로 비동기 요청보내기
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("userInfo------------ 변경된 정보 전송하자",userInfo);
        // 변경된 데이터가 있는지 검증
        const hasChanges = Object.keys(defaultInfo).some(
            (key) => defaultInfo[key] !== userInfo[key]
        );
        //없다면 변경된 데이터가 없다고 모달 확인창 띄우기

        if (!hasChanges) {
            openModal({
                modalType: "confirm",
                data: { message: "변경된 정보가 없습니다." },
                onConfirm:()=> closeModal(),
            });
            return;
        }
        //데이터가 변경되었다면 실행
        try {
            const response = await axios.put("/api/mypage/updateAllInfo",
               userInfo); // 이미 userInfo 는 객체라서 {} 넣으면 안됨


            console.log("비밀번호 변경 데이터 전송응답 받음 ",response.data);
            //{  "msg": "개인정보 수정완료", "success": true }

            if (response.data.success) { //
                openModal({
                    modalType:"confirm",
                    data:{ message: response.data.msg },
                    onConfirm: () => {
                        closeModal(); // 모달 닫고
                        onEdit();     // 수정모드 종료 (RetrieveInfo 보여주기)
                        // navigate("/mypage/personal"); // 필요 시 직접 경로 이동
                    },
                });

            } else {
                // success : false
                openModal({
                    modalType:"confirm",
                    data:{ message: response.data.msg },
                    onConfirm:()=> closeModal(),
                })
            }

        } catch (err) {
            console.error("개인정보 변경에러:", err);
            alert("개인정보 변경 중 오류가 발생했습니다.");
        }
    };



    const defaultInfo ={
        clientId:userInfo.clientId,
        password:userInfo.password,
        clientName:userInfo.clientName,
    }


    useEffect(() => {
        console.log("변경된 사용자정보---------------0000",userInfo);
    }, [userInfo]);

    return(
        <>
        <form className="userInfoForm" aria-labelledby="userInfoTitle">
            <fieldset>
                <IdAndpw defaultInfo={defaultInfo}/>
                <Birth birth={userInfo?.birth}/>
                <Tel telNum={userInfo?.tel} setUserInfo={setUserInfo} msg={msg} setMsg={setMsg}/>
                <Email email={userInfo?.email} setUserInfo={setUserInfo} msg={msg} setMsg={setMsg}/>
                <Address userInfo={userInfo} setUserInfo={setUserInfo} msg={msg} setMsg={setMsg}/>
            </fieldset>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-5  border-top pt-5">
                <button type="submit"  id="completeBtn" className="btn btn-dark me-2"
                        onClick={handleSubmit}>수정완료</button>
                <button  type="button" id="cancelBtn" className="btn custom-btn00 me-md-2"
                        onClick={() => onEdit()}>취소
                </button>
            </div>
        </form>

</>
)
    ;
}

export default EditInfo;