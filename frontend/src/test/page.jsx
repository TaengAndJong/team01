import {useEffect} from "react";


function Page({data,setUrl}){

    useEffect(() => {
        setUrl('/api/page'); // Login 컴포넌트 진입 시 URL 변경
    }, [setUrl]);
    
    //배역일 때와 배열 아닐때 설정해줘야 에러안남
    const Listdata = Array.isArray(data) ? data : [];
    console.log("  {data}" , Listdata);
    return(
        <div>
            <p>페이지</p>
            <ul>
                {Listdata.map((item, index) => (
                    <li key={index}>
                        <span>{item.pageId}</span>
                        <span>{item.pagePath}</span>
                    </li>
                ))}
            </ul>

        </div>

    );
}

export default Page;