import {useEffect} from "react";
import Btn from "../util/reuseBtn.jsx"

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