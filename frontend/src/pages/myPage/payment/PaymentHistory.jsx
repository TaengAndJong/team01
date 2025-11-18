import {useEffect, useState} from "react";
import axios from "axios";
import PaymentItems from "./PaymentItems.jsx";


const PaymentHistory=()=>{

    const [paymentInfo, setPaymetInfo] = useState({});
    //결제항목선택 상태관리 변수
   // const [selected,setSelected]=useState({});

    console.log("paymentInfo PayHistory",paymentInfo);
    
    //getfetch
    const getfetch = async()=>{

        try{
            const response = await axios.get("/api/mypage/payHistory")
            const data= response.data;
            console.log("마이페이지 결제 내역 ",data);
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


    console.log("paymentInfo start",paymentInfo);
    // prop들 하나의 객체로 묶기
    const paymentProps = {
        paymentInfo,
        setPaymetInfo,
    };

    console.log("paymentInfo end",paymentInfo);


    return(
        <>
            {/*마이페이지 결제된 목록 조회*/}
            {paymentInfo && paymentInfo.length > 0 ?
                (
                    <PaymentItems paymentProps={paymentProps}  />
                ) :(
                   <>
                       <p>결제 내역이 없습니다.</p>
                   </>
                )
            }
        </>
    )
}

export default PaymentHistory;