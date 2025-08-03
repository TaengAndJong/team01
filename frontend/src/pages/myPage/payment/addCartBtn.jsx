import React from "react";

const AddCartBtn = ({bookId,quantity}) =>{

    console.log(`addBTn bookId: ${bookId}, quantity:${quantity}`);

    //장밥구니 컨트롤러로 전송할 fetch 함수
    const sendCartFetch= async(bookId,quantity)=>{
        console.log("addCartBtn-------data",data);
        console.log("bookId---------sendCartFetch",bookId);
        console.log("quantity-----------sendCartFetch",quantity);
        try{
            const response = await fetch("/api/cart",{
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',

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


    return(
        <>
            <button type="button" aria-label="장바구니"
                    className="submit btn btn-primary me-2" onClick={() => sendCartFetch(bookId, quantity)}>
                장바구니
            </button>

        </>
    )
}

export default AddCartBtn;