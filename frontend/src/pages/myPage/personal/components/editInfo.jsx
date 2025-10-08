import IdAndpw from "./idAndpw.jsx";
import Birth from "./birth.jsx";
import Tel from "./tel.jsx";
import Email from "./email.jsx";
import Address from "./address.jsx";
import React from "react";

const EditInfo = ({userInfo,setUserInfo})=>{

    console.log("개인정보수정 :============",userInfo);
    /*
    * 아이디, 생년월일 변경불가
    * 비밀번호 변경 따로 ? ,
    * 우편번호 변경버튼
    * 주소, 전화번호, 이메일 변경 가능
    * 
    * 필요 함수 => 텍스트 입력시 바로 변경할 수 있는 이벤트 함수 onChange
    * 변경 시 바로 userInfo에 담아서 변경데이터 반영해줘야 함
    * */
    return(
        <>
            <form className="userInfoForm" aria-labelledby="userInfoTitle">
                <fieldset>
                    {/*<IdAndpw clientId={userInfo?.clientId}*/}
                    {/*         password={userInfo?.password}*/}
                    {/*         clientName={userInfo?.clientName}*/}
                    {/*         setUserInfo={setUserInfo}*/}
                    {/*/>*/}
                    {/*<Birth birth={userInfo?.birth}/>*/}
                    {/*<Tel telNum={userInfo?.tel} setUserInfo={setUserInfo}/>*/}
                    {/*<Email email={userInfo?.email} setUserInfo={setUserInfo}/>*/}
                    {/*<Address address={address} setUserInfo={setUserInfo}/>*/}
                </fieldset>
            </form>

        </>
    );
}

export default EditInfo;