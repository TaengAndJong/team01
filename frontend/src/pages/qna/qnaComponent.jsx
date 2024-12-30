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
        fetch(`/api/test/qna${qnaId}`)
            // /admin/qna 로 요청
            .then((response) => {
                // 응답 상태가 정상인지 확인
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                console.log("리스폰 데이터: ",response);
                return response.text(); // JSON 데이터 파싱
            })
            .then((data) => {
                // 데이터를 state에 저장
                setData(data);
                console.log("Response data:", data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

    }, []);

    return (
        <>
            <div>
                <span>데이터 : {data}</span>
                <QnAList/>
            </div>
        </>
    )
}

export default qnaComponent;