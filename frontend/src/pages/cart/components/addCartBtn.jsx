import React, {useEffect, useState} from "react";

const AddCartBtn = ({ bookId, bookCount }) => {

    // 비동기 요청에 보낼 데이터 객체
    const [toCart, setToCart] = useState({});

    //장밥구니 컨트롤러로 전송할 fetch 함수
    const sendCartFetch= async()=>{

        //bookId와 bookCount만 서버로 보내기
        console.log("tocart fetch",toCart);

        try{
            const response = await fetch("/api/cart",{
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(toCart) // 서버로 전송할 데이터를 문자열로 파싱, body로 보내면 컨트롤러에서 @RequestBody 로 받아야함
            })

            if(!response.ok){
                throw new Error("Failed to fetch cart list",response.statusText);
            }

            const data = await response.json();
            console.log("data cart List ", data);

        }catch(err){
            console.log("장바구니에 담기 실패",err);
        }
    }

    //장바구니 버튼 누르면 toCart 객체에 도서정보와 수량 담아주는 핸들러 및 장바구니 컨트롤러로 전송
    const handleAddToCart = (bookId,bookCount) => {
        console.log("handleAddToCart -bookId",bookId);
        console.log("handleAddToCart -bookCount",bookCount);
        // ToCart에 먼저 변경된 데이터 갱신하기 
        setToCart( {
            bookId:bookId,
            quantity: bookCount
        }); // 배열로 저장

    };


    //toCart 데이터 변경 감지 시 비동기요청
    useEffect(() => {

        console.log("toCart useEffect out ",toCart);
        console.log("toCart toCart.bookId",toCart.bookId);
        console.log("toCart toCart.quantity",toCart.quantity);
        // 변경된 데이터가 아래 조건과 같으면 비동기요청 실행
        if( toCart.bookId != null && toCart.quantity >  0 ){

            console.log("toCart useEffect in",toCart);
            // bookId null이 아닐 때와 quantity가 0 이아닌 경우  실행되어야 함
            sendCartFetch(); // cart 컨트롤러로 전송
        }
    }, [toCart]);


    return(
        <>
            <button type="button" aria-label="장바구니"
                    className="submit btn btn-primary me-2" onClick={()=> handleAddToCart(bookId,bookCount)}>장바구니
            </button>
        </>
    );
}

export default AddCartBtn;