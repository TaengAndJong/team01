import FormTag from "@util/formTag.jsx";
import Btn from "@util/reuseBtn.jsx";
import {validID, validPW,checkDuplicate, validatePasswordMatch} from "@util/validation.jsx";
import {useEffect} from "react";


const IdAndPw = ({formData,setFormData,msg,setMsg})=>{
        //부모한테서 formData와 inputChangeHandlerl, Msg , Error?

        console.log("아이디 패스워드 formData",formData)

  //  비밀번호 데이터가 변경될 때마다 갱신
    useEffect(() => {
        // 비밀번호 동일 여부 확인 , 바로 데이터를 파라미터로 넘겨주기
        const pwdConfirm = validatePasswordMatch(formData.password, formData.passwordConfirm);
        setMsg((prev) => ({
            ...prev,
            errorpwdConfirm: pwdConfirm.valid ? "" : pwdConfirm.message,
        }));

        // 비밀번호 유효성 검사
        const pwValidation = validPW(formData.password);
        setMsg((prev) => ({
            ...prev,
            errorpwd: pwValidation.valid ? "" : pwValidation.message,
        }));
    }, [formData.password, formData.passwordConfirm]);

//input onChange 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target; // 입력 필드의 name과 value 가져오기
        setFormData({ ...formData, [name]: value });

        // 아이디 유효성 검사
        if (name === "clientId") {
            const idValidation = validID(value);
            setMsg((prev) => ({
                ...prev,
                errorId: idValidation.valid ? "" : idValidation.message,
            }));
        }

    };
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




    return(
       <>
           {/*id*/}
           <div className="d-flex align-items-center mb-2 justify-content-start">
               <FormTag label="아이디" labelClass="form-title" className="form-control" name="clientId" type="text"
                        value={formData.clientId}
                        onChange={handleInputChange} msg={msg.errorId}/>
               <Btn className="btn btn-primary ms-1"  type="button" text="중복확인" onClick={() => {
                   handleIdConfirm("clientId", formData.clientId)
               }}/>
           </div>

           {/*pw*/}
           <div className="d-flex align-items-center mb-2">
               <FormTag label="비밀번호" labelClass="form-title" className="form-control" name="password" type="password"
                        value={formData.password}
                        onChange={handleInputChange} msg={msg.errorpwd}/>
           </div>
           <div className="d-flex align-items-center mb-2">
               <FormTag label="비밀번호확인" labelClass="form-title" className="form-control" name="passwordConfirm" type="password"
                        value={formData.passwordConfirm}
                        onChange={handleInputChange} msg={msg.errorpwdConfirm}/>
           </div>
           <div className="d-flex align-items-center mb-2">
               <FormTag label="이름" labelClass="form-title" className="form-control" name="clientName"
                        value={formData.clientName}
                        onChange={handleInputChange}/>
           </div>
       </>
    )

}

export default IdAndPw;