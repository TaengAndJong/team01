//전체선택, 개별선택 삭제, 장바구니버튼, 바로구매버튼, 찜목록 버튼 , 리뷰

import {useContext, useState} from "react";
import {BookStateContext} from "../../adminBook/adminBookComponent.jsx";

const BookList = () => {
    const bookData = useContext(BookStateContext);
    //관리자에서 등록된 도서 데이터 관리하는 상태변수
    const [bookList, setBookList] = useState([]) // 초기값을 배열로 하는 이유는 map함수를 사용하려고
    console.log("bookList data",bookData);
    return (
        <>
            {/* 국내, 국외, 전자 도서 탭으로 나누기*/}
        </>
    )
}

export default BookList;