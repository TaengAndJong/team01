import {useParams} from "react-router-dom";
import React, { useEffect, useState} from "react";
import Btn from "../../../util/reuseBtn.jsx";
import pathsData from "../../../assets/pathsData.jsx";
import "@assets/css/book/adminbookDetail.css";
import BookSlide from "../../common/bookSlide.jsx";



const AdminBookDetail = () => {
    const { bookId } = useParams(); // URL 파라미터에서 bookId 가져오기
    const [bookDetail, setBookDetail] = useState([]);
    

    // bookId가 없으면 API 요청을 보내지 않도록 처리
    if (!bookId) {
        console.error("bookId is missing. API request not sent.");
        return; // 요청을 보내지 않음
    }
    //서버의 컨트롤러에 비동기 데이터 요청
    const getbookData = async () => {

    try{
        //await 을 사용하지 않으면 서버로부터 받는 response(응답)객체의 응답상태 확인과 응답객체에 대한 json 변환이 안될 수 있음
        const response = await fetch(`/api/admin/book/bookDetail/${bookId}`,{
           method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if(!response.ok){
            console.log(response.status);
            throw new Error("서버응답에러");
        }
        //응답 성공시
        const bookData = await response.json(); 
        // 제이슨 문자 데이터로 변환 ==> 담겨야할 데이터 bookId에 해당하는 정보 서버에서 반환받기
        console.log("bookData----------상세페이지",bookData);
        setBookDetail(bookData.bookVO);

    }catch(err){
        console.log("catch-Error", err); // 오류 처리
    }
}
    // 리액트 마운트 시 get요청으로 데이터 얻어오기
    useEffect(() => {
        getbookData();
    },[])

    return(
        <>
            <div className="bookDetail">

                <div className="box slide">
                    <div className="card horizontal">
                        <div className="card-header">
                            <BookSlide slideData={bookDetail}/>
                        </div>
                        <div className="bookInfo card-body">
                            <h3 className="book-title title-dotted">{bookDetail.bookName}</h3>
                            <ul className="ul bullet">
                                <li className="li"><span className="tit">저자</span>{bookDetail.author}</li>
                                <li className="li"><span className="tit">발행일</span>{bookDetail.publishDate}</li>
                                <li className="li"><span className="tit">가격</span>{bookDetail.bookPrice}<span>원</span>
                                </li>
                                {/*할인적용할건지 */}
                                <li className="li"><span className="tit">할인가</span><span>원</span>
                                </li>
                            </ul>
                            <div className="btn d-flex">
                                <button className="cart btn custom-btn00 me-2">장바구니</button>
                                <button className="buy btn custom-btn02">구매하기</button>
                            </div>
                            {/*bookDesc end */}
                        </div>
                    </div>

                </div>


                <div className="box">
                <h4 className="h4 title-dotted">도서설명</h4>
                    {bookDetail.bookDesc}
                </div>
                {/*bookDetail end */}

                <div className="d-grid gap-2 d-md-flex justify-content-md-between mt-4">
                    <Btn className={"list btn-secondary"} id={"listBtn"} type={"button"} path={pathsData.page.adminBookList}
                         text="목록"/>
                    <Btn className={"modify btn-primary"} id={"modifyBtn"} type={"button"} path={`${pathsData.page.adminBookModify}/${bookId}`}
                         text="수정"/>
                </div>

            </div>
        </>
    )
}

export default AdminBookDetail;