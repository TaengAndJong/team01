import {useEffect} from "react";

function Home({data,setUrl}){
    useEffect(() => {
        setUrl('/api'); // Login 컴포넌트 진입 시 URL 변경
    }, [setUrl]);

    return(
        <div>
            <p>메인{data}</p>

        </div>
        
    );
}

export default Home;