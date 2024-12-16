import {useEffect} from "react";

function Admin({data,setUrl}){

    useEffect(() => {
        setUrl('/api/admin'); // Login 컴포넌트 진입 시 URL 변경
    }, [setUrl]);

    return(
    <div>
        <p>관리자</p>
        {data}
    </div>
        
    );
}

export default Admin;