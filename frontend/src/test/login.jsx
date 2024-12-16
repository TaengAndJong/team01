import {useEffect} from "react";

function Login({data,setUrl}){

    useEffect(() => {
        setUrl('/api/login'); // Login 컴포넌트 진입 시 URL 변경
    }, [setUrl]);

    return(
    <div>
        <p>로그인</p>
        {data}
    </div>
        
    );
}

export default Login;