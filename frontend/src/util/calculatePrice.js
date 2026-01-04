// js 파일을 작성하는 기준 : 계산,로직, 유틸함수 ( 화면 렌더링이 없을때 )

//장바구니용 도서 전체가격 계산
export const getTotalPrice = (cartList = [], cartIds = []) => {
    if (!Array.isArray(cartList) || !Array.isArray(cartIds)) return 0;

    return cartList
        .filter(item => cartIds.includes(item.cartId))
        .reduce((sum, item) => {
            return sum + item.book.bookPrice * item.book.quantity;
        }, 0);
};

//도서 전체가격을 기반으로한 배송비 결정
export const getDeliveryPrice=(totalPrice  = 0)=>{ // totalPrice 값 없을 경우 0으로 초기값 설정
    // 문자열로 들어오는 숫자로 변환 NaN방지
    const price = Number(totalPrice);
    if (price === 0 || price >= 10000) return 0; // 가격이 0 이거나 1만원 이상일경우 배송비 0
    return 2000; //아니면 2000원
}


// 결제페이지용 총 가격
export const getAllPrice=(books=[]) => {//초기값 설정
    return books.reduce((sum, item) => { //sum의 초기값은 0 , reduce 누적함수
        const eachPrice = item?.book?.bookPrice ?? 0; // 개별 가격
        const quantity = item?.book?.quantity ?? 0// 개별 수량
        return sum + eachPrice * quantity;
    },0) // sum의 초기값 지정은 여기서
}


//결제내역페이지용 총 가격 ( 배송비 포함) : 결제가 완료되었을 경우 조건 추가 필수
export const getCompletedPayPrice = (books=[],deliveryPrice = 0)=>{
    console.log("books -- complete",books);
    console.log("deliveryPrice -- complete",deliveryPrice);

        return  books?.reduce((sum,book) => {
             // 부분 취소,전체취소 적용시 검증 조건은 book.partStatus: total 초기값은 0
            return  book.partPayStatus === 'COMPLETED'?  sum + (book.quantity * book.bookPrice) + deliveryPrice : sum;
       }, 0);

    }

