

import React, { useEffect, useState} from "react";
import RetrieveInfo from "./components/retrieveInfo.jsx";
import EditInfo from "./components/editInfo.jsx";


const PersonalInfo = () => {
    const [userInfo, setUserInfo] = useState({}); // 조회모드
    const [isEditMode, setIsEditMode] = useState(false); // 수정모드
    const [errorData, setErrorData] = useState("");
    //에러 상태 초기화 관리
    const [msg, setMsg] = useState({
        errorId:"",
        errorpwd:"",
        errorpwdConfirm:"",
        errorEmail:"",
        errorAddr:"",
        errorTel:"",
        errorMemNum:"",
        errorBirth:"",
        memberMsg:""
    });




    //개인정보조회 fetch
    const userInfoFetch = async () => {
        const response = await fetch("/api/mypage/userInfo",);
        const userData = await response.json();
        console.log("개인정보조회 , ",userData);
        //userinfo에 유저 데이터 설정해주기
        setUserInfo(userData);
    }

    useEffect(() => {
        //로그인한 유저의 데이터 조회하는 fetch 요청 보내기
        userInfoFetch();
    },[]) // userinfo가 변경되면 새로 요청

    const onEdit = () => {
        setIsEditMode((prevState) => (!prevState));// 이전 상태값이 true이면 false, false이면 true 변경
    }

    console.log("userInfo--------- 최상위 컴포넌트",userInfo)
    return (
        <>
            {isEditMode ? (
                <>
                    <strong className="title-border title d-block">개인정보 수정</strong>
                    <EditInfo userInfo={userInfo} setUserInfo={setUserInfo} msg={msg} setMsg={setMsg} onEdit={onEdit}/>
                </>

            ) : (
                <>
                    <strong className="title-border title d-block">{userInfo?.clientName}님 개인정보 조회</strong>
                    <RetrieveInfo userInfo={userInfo} setUserInfo={setUserInfo} onEdit={onEdit}/>
                </>
            )}


        </>
    )
}

export default PersonalInfo;