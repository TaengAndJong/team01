import IdAndpw from "./idAndpw.jsx";
import Birth from "./birth.jsx";
import Tel from "./tel.jsx";
import Email from "./email.jsx";
import Address from "./address.jsx";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useModal} from "../../../common/modal/ModalContext.jsx";
import {useNavigate} from "react-router-dom";


const EditInfo = ({userInfo,setUserInfo,msg,setMsg,onEdit})=>{

    //모달 안내창
    const {openModal,closeModal} = useModal();

    // 이전사용자정보값 보존할 인스턴스
    const [prevUserInfo , setPrevUserInfo] = useState({});
    //비밀번호 변경 상태관리  플래그 변수
    const [passwordChanged, setPasswordChanged] = useState(false);

    //signUp post로 비동기 요청보내기
    const handleSubmit = async (e) => {

        e.preventDefault();

        // 변경된 데이터가 있는지 검증==> 기존 데이터를 조회해와야함
        //비밀번호를 제외한 값들 검증
        const hasUserInfoChanges  = Object.keys(userInfo).some(
            key => userInfo[key] !== prevUserInfo[key] // 각 객체의 key  값에 해당하는 값이 같지 않은지 검증 ==> true 반환
        ); 

        //비밀번호와 그외 값들
        const hasChanges = hasUserInfoChanges || passwordChanged;

        //없다면 변경된 데이터가 없다고 모달 확인창 띄우기 ==> 기존데이터 조회해서 변경된 userInfo 와 비교
        if (!hasChanges) { // !true == false 이면 변경된 정보 없음 모달 띄우기
            openModal({
                modalType: "default",
                content:<><p>변경된 정보가 없습니다.</p></>,
                onConfirm: () => {
                    closeModal();   // <- 모달 닫기
                }
            });
            return; // try문 실행 안 함
        }

        // 비밀번호만 변경했을 경우, 변경된 내용 없음 검증 통과후 
        
        // password 제거한 데이터들만 전송 ( pw는 이미 변경할때 단독으로 처리해서 이미 갱신된 상태)
        const { password, ...payload } = userInfo;

        //데이터가 변경되었다면 실행
        try {
            const response = await axios.put("/api/mypage/updateAllInfo",
                payload); // 이미 userInfo 는 객체라서 {} 넣으면 안됨
            

            //{  "msg": "개인정보 수정완료", "success": true }

            if (response.data.success) { //
                openModal({
                    modalType:"default",
                    content:<><p>{response.data.msg}</p></>,
                    onConfirm: () => {
                        closeModal(); // 모달 닫고
                        onEdit();     // 수정모드 종료 (RetrieveInfo 보여주기)
                        // navigate("/mypage/personal"); // 필요 시 직접 경로 이동
                    },
                });

            } else {
                // success : false
                openModal({
                    modalType:"default",
                    content:<><p>{response.data.msg }</p></>,
                    onConfirm: () => {
                        closeModal();   // <- 모달 닫기
                    }
                })
            }

        } catch (err) {

            console.error("개인정보 변경에러:", typeof err);
            console.error("status:", err.response?.status);
            console.error("data:", err.response?.data);
            console.error("full error:", err);
            openModal({
                modalType:"error",
                content: <>
                            <p>개인정보 변경 중 오류가 발생했습니다.</p>
                            <p>{String(err.response?.data?.msg || err.message)}</p>
                        </>,
            });
        }
    };


    //기본정보 (아이디, 이름 , 비번)
    const defaultInfo ={
        clientId:userInfo.clientId,
        // password:userInfo.password, // 비밀번호는 표기할 필요 없으니까 초기값 필요없음
        clientName:userInfo.clientName,
    }


    useEffect(() => {
        //수정페이지가 렌더 될 때, 기존 조회데이터를 새로운 객체에 담아서 이전값 보존하기
        if(userInfo){
            setPrevUserInfo(userInfo);
        }
    }, []);



    return(
        <>
        <form className="userInfoForm" aria-labelledby="userInfoTitle" onSubmit={handleSubmit}>
            <fieldset>
                <IdAndpw defaultInfo={defaultInfo}  onPasswordChanged={() => setPasswordChanged(true)}/>
                <Birth birth={userInfo?.birth}/>
                <Tel telNum={userInfo?.tel} setUserInfo={setUserInfo} msg={msg} setMsg={setMsg}/>
                <Email email={userInfo?.email} setUserInfo={setUserInfo} msg={msg} setMsg={setMsg}/>
                <Address userInfo={userInfo} setUserInfo={setUserInfo} msg={msg} setMsg={setMsg}/>
            </fieldset>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-5  border-top pt-5">
                <button type="submit"  id="completeBtn" className="btn btn-dark me-2">수정</button>
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