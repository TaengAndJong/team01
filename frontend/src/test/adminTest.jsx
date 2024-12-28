import {useEffect} from "react";

function AdminTest({data,setUrl}){
     console.log(data,setUrl);
    useEffect(() => {
        setUrl('/admin/test'); // Login 컴포넌트 진입 시 URL 변경
    }, [setUrl]);



    return(
        <div>
            <p>AdminTestssss</p>
            {data}
        </div>

    );
}

export default AdminTest;