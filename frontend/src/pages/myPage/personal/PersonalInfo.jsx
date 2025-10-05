
import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import IdAndpw from "./components/idAndpw.jsx";
import Birth from "./components/birth.jsx";
import Tel from "./components/tel.jsx";
import Email from "./components/email.jsx";
import Address from "./components/address.jsx";

const PersonalInfo = () => {
    const [formData, setFormData] = useState({});

    //개인정보조회 fetch
    const userInfoFetch = async () => {
        const response = await fetch("/api/mypage/userInfo",);
        const userData = await response.json();
        console.log("개인정보조회 , ",userData);
        //formData에 유저 데이터 설정해주기
        setFormData(userData);
    }

    useEffect(() => {
        //로그인한 유저의 데이터 조회하는 fetch 요청 보내기
        userInfoFetch();
    },[]) // formData가 변경되면 새로 요청


    //각 컴포넌트로 해당 데이터 props로 넘겨주기
    const address = {
        addr:formData.addr,
        detailAddr:formData.detailAddr,
        zoneCode:formData.zoneCode,
    }


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

    //modal
    const [errorData, setErrorData] = useState("");


    return (
        <>

            <form className="userInfoForm">
                <fieldset>
                    <legend className="d-block title-border mb-5">개인정보 목록</legend>
                    <IdAndpw clientId={formData?.clientId}
                             password={formData?.password}
                             clientName={formData?.clientName}
                             setFormData={setFormData}
                    />
                    <Birth birth={formData?.birth}/>
                    <Tel telNum={formData?.tel} setFormData={setFormData}/>
                    <Email email={formData?.email} setFormData={setFormData}/>
                    <Address address={address} setFormData={setFormData} />
                </fieldset>
            </form>

        </>
    )
}

export default PersonalInfo;