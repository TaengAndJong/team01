import Btn from "../../util/reuseBtn.jsx"
import pathsData from "../../assets/pathsData.jsx"
const mainComponent = ()=> {

    return (<>
        <Btn text="로그인" type="" path={pathsData.page.login}/>
        {/*<Btn text="관리자" type="" path="/admin"/>*/}
        <Btn text="회원가입" type="" path="/signup"/>
        {/*<Btn text="비밀번호 찾기" type="" path="/"/>*/}
    </>)
}

export default mainComponent;