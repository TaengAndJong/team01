import { useEffect, useState } from 'react';
import QnAList from './components/qnaList.jsx';
const qnaComponent =  ()  => {
    // const [isLogin, setIsLogin] = useState(""); // 로그인 데이터 확인

    const [data, setData] = useState(null);
        // if(!isLogin){
        //     alert("로그인 후 이용해주세요");
        //     return;
        // }else{
        //
        // }
    useEffect(() => {
        console.log("마운트 됨");
        const userId = "user01";
        const fetchData = async () =>{
            try{
                const response = await fetch(`/api/test/qnaList?userId=${userId}` ,{ method: "GET",});
                const result = await response.json();
                setData(result);
                console.log('QnaData : ', result);
            } catch (err) {
                console.error("err", err);
            }
        };

      fetchData()
    }, []);

    return (
        <>
            <div>
                {data ? (
                    <span>데이터 : {data ? JSON.stringify(data) : "No Data Available"}</span> // Display a specific field from the data
                ) : (
                    <span>Loading...</span>
                )}
                <QnAList/>
            </div>
        </>
    )
}

export default qnaComponent;