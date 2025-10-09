import IdAndpw from "./idAndpw.jsx";
import Birth from "./birth.jsx";
import Tel from "./tel.jsx";
import Email from "./email.jsx";
import Address from "./address.jsx";
import React from "react";


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

    //signUp post로 비동기 요청보내기
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/signUp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData), // formInfoData를 JSON으로 변환하여 전송
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json(); // 서버에서 반환된 JSON 데이터 처리
            console.log("result-------backend to front",result); // 서버에서 받은 응답 확인

            //서버에서 반환하는 json 객체에 success :  true로 설정해줘야함
            if (result.success) {
                alert(`회원가입이 성공적으로 완료되었습니다! : ${result.message}` );
                // 성공 시 추가 작업 (예: 로그인 페이지로 이동)
                navigate("/");
            } else {
                // success : false
                alert(`회원가입 실패: ${result.message}`);
            }
        } catch (err) {
            console.error("회원가입 오류:", err);
            alert("회원가입 중 오류가 발생했습니다.");
        }
    };

    // 아이디, 회원번호 검증
    const handleConfirm = async (key, value,addData = {}) => {
        console.log(key, value);
        //formData에 입력된 객체의 값을 가져와서 , URLSearchparams를 이용해 쿼리스트링으로 변경해 서버로 전송해야 함
        //URLSearchparams는 문자열을 파라미터로 받아야 함 ==> 객체에 담아서 key=value 형태로 담아야 함
        const params= new URLSearchParams({[key]:value});

        // 추가 데이터가 있다면 파라미터에 append
        for (const [addKey, addValue] of Object.entries(addData)) { // 객체데이터를 배열구조로 구조분해할당하여 추가 데이터 params에 담아주기
            if (addValue !== undefined && addValue !== null && addValue !== "") {
                console.log("addKye, addValue-----------------",addKey, addValue);
                params.append(addKey, addValue);
            }
        }

        console.log("params--------",params);
        console.log("params--------",params.toString());

        try{
            // 쿼리스트링으로 서버로 검증할 파라미터 fetch로 넘겨주기
            const response = await fetch(`/api/signUp/validate?${params.toString()}`, {
                method: "get",
            })
            //통신 실패
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            //통신 성공시 받아오는 결과 데이터
            const result = await response.json(); // 서버에서 반환된 JSON 데이터 처리
            console.log("result-------backend to front",result); // 서버에서 받은 응답 확인
            //모달 띄우기  ==>  true 이면 중복인 상태, false이면 사용가능한 상태
            if(result){
                console.log("result.message",result.message);
                //객체 형태
                setErrorData({
                    message: result.message,
                })
            }
            //    console.log("errorData ",errorData);

        }catch(err){
            console.error(err);
        }
        //end
    }

    const defaultInfo ={
        clientId:userInfo.clientId,
        password:userInfo.password,
        clientName:userInfo.clientName,
    }

    const address = {
        addr : userInfo.addr,
        detailAddr: userInfo.detailAddr,
        zoneCode:userInfo.zoneCode,
    }

    return(
        <>
        <form className="userInfoForm" aria-labelledby="userInfoTitle">
            <fieldset>
                <IdAndpw defaultInfo={defaultInfo}
                         setUserInfo={setUserInfo}
                         msg={msg} setMsg={setMsg}
                         errorData={errorData}
                />
                <Birth birth={userInfo?.birth}/>
                <Tel telNum={userInfo?.tel} setUserInfo={setUserInfo} msg={msg} setMsg={setMsg}/>
                <Email email={userInfo?.email} setUserInfo={setUserInfo} msg={msg} setMsg={setMsg}/>
                <Address address={address} setUserInfo={setUserInfo} msg={msg} setMsg={setMsg}/>
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