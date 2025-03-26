import {useParams} from "react-router-dom";
import React, { useEffect, useState} from "react";
import Btn from "../../../util/reuseBtn.jsx";
import pathsData from "../../../assets/pathsData.jsx";
import AdminBookSlide from "../../common/adminBookSlide.jsx";
import "../../../../dist/assets/css/book/bookDetail.css";



const AdminBookDetail = () => {
    const { bookId } = useParams(); // URL 파라미터에서 bookId 가져오기
    const [bookDetail, setBookDetail] = useState([]);
    
    console.log("bookId0------------------",bookId);
    console.log("bookDetail0------------------detail",bookDetail);
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
        setBookDetail(bookData.bookInfo);

    }catch(err){
        console.log("catch-Error", err); // 오류 처리
    }
}
    // 리액트 마운트 시 get요청으로 데이터 얻어오기
    useEffect(() => {
        console.log("bookDetail1-------------",bookDetail);
        getbookData();
        console.log("bookDetail2-------------",bookDetail);
    },[])

    console.log("최종 ----------bookDetail",bookDetail);
    return(
        <>

            <div className="bookDetail">

                <div className="box">

                    <div className="card horizontal">
                        <div className="card-header">
                            <AdminBookSlide bookDetail={bookDetail}/>
                        </div>
                        <div className="bookInfo card-body">
                            <ul class="ul cicleBullets">
                                <li className="li">
                                    <span className="tit">도서명</span>{bookDetail.bookName}
                                </li>
                                <li className="li"><span className="tit">저자</span>{bookDetail.author}</li>
                                <li className="li"><span className="tit">발행일</span>{bookDetail.publishDate}</li>
                                <li className="li"><span className="tit">가격</span>{bookDetail.bookPrice}<span>원</span></li>
                            </ul>
                            {/*bookDesc end */}
                        </div>
                    </div>

                </div>


                <div className="box">
                    <h4 className="h4">도서설명</h4>
                    {bookDetail.bookDesc}
                </div>
                {/*bookDetail end */}

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Btn className={"modify btn btn-primary"} type={"button"} path={pathsData.page.adminBookModify}
                         text="수정"/>
                </div>

            </div>
        </>
    )
}

export default AdminBookDetail;