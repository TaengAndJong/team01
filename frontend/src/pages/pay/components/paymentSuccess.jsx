import {useLocation} from "react-router-dom";

const PaymentSuccess = () =>{

    const location =useLocation();
    console.log("location----------- 결제성공페이지", location);

    return(
        <>
        결제성공 목록 조회페이지
        </>
    )
}

export default  PaymentSuccess;