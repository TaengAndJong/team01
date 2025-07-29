import {useEffect, useState} from "react";
import axios from "axios";
import PaymentItems from "./PaymentItems.jsx";
import {data} from "react-router-dom";

const PaymentHistory=()=>{

    const [paymentInfo, setPaymetInfo] = useState({});
    //결제항목선택 상태관리 변수
    const [selected,setSelected]=useState({});

    console.log("paymentInfo PayHistory",paymentInfo);
    
    //getfetch
    const getfetch = async()=>{

        try{
            const response = await axios.get("/api/mypage/payHistory")
            const data= response.data;
            //각 객체에 상태갱신해주기
            setPaymetInfo(data);
        }catch(e){
            console.error(e);
            //에러 부분 사용자에게 꼭 알려주는 UI 구현하기

        }
    }



    //useEffect로 get요청 결제완료 목록 가져오기
    useEffect(()=>{
        console.log("paymentHistory useEffect");
        getfetch();

    },[])

    console.log("selected---------- 최상위 컴포넌트",selected);


    console.log("paymentInfo start",paymentInfo);
    // prop들 하나의 객체로 묶기
    const paymentProps = {
        paymentInfo,
        setPaymetInfo,
        // selected,
        // setSelected,

    };

    console.log("paymentInfo end",paymentInfo);


    return(
        <>
            {/*마이페이지 결제된 목록 조회*/}
            {/*결제 취소 기능,*/}
            {/*결제 상태여부 확인 필요,*/}
            {/*결제시간*/}
            {/*결제상세목록도 클릭시 등장하게*/}

            <PaymentItems paymentProps={paymentProps} />

        </>
    )
}

export default PaymentHistory;