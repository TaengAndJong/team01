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
        const userId = "user01";
        const fetchData = async () =>{
            try{
                const response = await fetch(`/api/test/qnaList?userId=${userId}`);
                const result =response.json();
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
                    <span>데이터 : {data}</span> // Display a specific field from the data
                ) : (
                    <span>Loading...</span>
                )}
                <QnAList/>
            </div>
        </>
    )
}

export default qnaComponent;