import {useEffect, useState} from "react";
import axios from "axios";
import PaymentItems from "./PaymentItems.jsx";


const PaymentHistory=()=>{

    const [paymentInfo, setPaymetInfo] = useState({});

    
    //getfetch
    const getfetch = async()=>{

        try{
            const response = await axios.get("/api/mypage/payHistory")
            const data= response.data;
            //각 객체에 상태갱신해주기
            setPaymetInfo(data);
        }catch(e){
            //에러처리
            console.error(e);
        }
    }



    //useEffect로 get요청 결제완료 목록 가져오기
    useEffect(()=>{

        getfetch();

    },[])


    // prop들 하나의 객체로 묶기
    const paymentProps = {
        paymentInfo,
        setPaymetInfo,
    };


    return(
        <>
            {/*마이페이지 결제된 목록 조회*/}
            {paymentInfo && paymentInfo.length > 0 ?
                (
                    <PaymentItems paymentProps={paymentProps}  />
                ) :(
                    <>
                        <p className="custom-border dotted rounded-2 text-center">결제 내역이 없습니다.</p>

                    </>
                        )
                        }
                    </>
                )
            }

            export default PaymentHistory;