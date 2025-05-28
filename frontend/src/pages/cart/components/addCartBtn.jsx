import React, {useState} from "react";

const AddCartBtn = ({ bookId, bookCount }) => {


    console.log("bookCount",bookCount);
    console.log("bookId",bookId);

    const [toCart, setToCart] = useState({});


    //장밥구니 컨트롤러로 전송할 fetch 함수
    const sendCartFetch= async()=>{

        //bookId와 bookCount만 서버로 보내기
        console.log("tocart fetch",toCart);

        try{
            const response = await fetch("/api/cart/cartList",{
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(toCart) // 서버로 전송할 데이터를 문자열로 파싱,
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
    const handleAddToCart = (bookId) => {
        console.log("handleAddToCart",bookId);
        const quantity = bookCount ?? 1;
        setToCart( {
            bookId:bookId,
            quantity: quantity
        }); // 배열로 저장
        sendCartFetch(); // cart 컨트롤러로 전송

        console.log("장바구니에 담김:", toCart);
    };

        console.log("toCart :", toCart);

    return(
        <>
            <button type="button" aria-label="장바구니"
                    className="submit btn btn-primary me-2" onClick={()=> handleAddToCart(bookId)}>장바구니
            </button>
        </>
    );
}

export default AddCartBtn;