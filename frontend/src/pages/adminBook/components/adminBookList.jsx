//전체선택, 개별선택 삭제, 장바구니버튼, 바로구매버튼, 찜목록 버튼 , 리뷰

import React, {useContext, useEffect, useState} from "react";
import Btn from "../../../util/reuseBtn.jsx";
import pathsData from "../../../assets/pathsData.jsx";
import {BookDispatchContext, BookStateContext} from "../adminBookComponent.jsx";
import {Link, useLocation, useNavigate} from "react-router-dom";
import StaticModal from "./modal.jsx";

const AdminBookList = () => {
    const bookdata = useContext(BookStateContext);
    const {onDelete} = useContext(BookDispatchContext); // 사용할 함수 가져올때 전역설정이면 context 훅 불러와야함


    const [bookList, setBookList] = useState([]);




    //데이터를 부모컴포넌트로부터 받아 온다.
    // bookdata가 존재할 때만 bookList 업데이트
    useEffect(() => {
        //1.부모에서 받아온 데이터를 상태관리 함수에 갱신해줌
        if(bookdata){
            setBookList(bookdata);
            console.log("bookdata----useEffect",bookdata);
        }
    }, [bookdata]);
    //전체선택
    const [selectAll, setSelectAll] = useState(false); // 전체 선택 여부
    //체크박스 상태관리(단일선택, 다중선택 초기값은 배열로)
    const [checkedInput, setCheckedInput] = useState([]);



    const handleSelectAll = (isChecked) => {
        setSelectAll(isChecked);
        if (isChecked) {
            console.log("selectAll",isChecked);
            // 모든 bookId를 배열에 추가
            const allIds = bookList.map((item) => item.bookId);
            setCheckedInput(allIds);
        } else {
            // 전부 해제
            setCheckedInput([]);
        }
    };

    const onChangeCheck = (bookId, isChecked)  => {

        if (isChecked) {
            setCheckedInput((prev) => [...prev, bookId]);
        } else {
            setCheckedInput((prev) => prev.filter((id) => id !== bookId));
        }
    }

    const onDeleteHandler = async (deleteItems) =>{

        //fetch 요청 보내기
        try{
            const response = await fetch("/api/admin/book/bookDelete",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(deleteItems),
                // body에 담길 내용이 간단한 배열일 경우엔 객체나 배열을 문자열로 변환하여 서버에 요청을 보냄
                // 파일, 이미지 , blob등과 같은 바이너리 데이터가 있을경우 또는  enctype(encoding type) 이 존재할경우 에만 formData 형태로 변환해 보내야함
                // form-data랑 x-www-form-urlencoded
            })

            if(!response.ok){
                //삭제하려는 도서가 없을 경우
                console.log(response.statusText,response.status);
                const errorResponse = await response.json();
                console.log("errorResponse",errorResponse);

            }
            // 삭제성공후 데이터가 한번 갱신되어야 함 (삭제된 아이템들을 제외하고 )
            console.log("deleteItems 배열?",Array.isArray(deleteItems));
            onDelete(deleteItems); // 삭제 상태관리
            console.log("bookData 삭제성공",bookdata);

        }catch(err){
            console.error("요청 실패", err);
        }

    }

    console.log("checkedInput--------------3333",checkedInput)
    console.log("bookList--------------",bookList)
    return(
        <>
            <table className="table table-custom">
                <caption className="sr-only">
                    등록된 도서상품 테이블
                </caption>
                <thead>
                <tr>
                    <th scope="col" className="text-center">
                        <input type="checkbox" id="selectAll"
                               checked={checkedInput.length === bookList.length && bookList.length > 0}
                               onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                        <label htmlFor="selectAll">전체 선택</label>
                    </th>
                    <th scope="col" className="text-center">No.</th>
                    <th scope="col" className="text-center">이미지</th>
                    <th scope="col" className="text-center">카테고리</th>
                    <th scope="col" className="text-center">도서명</th>
                    {/*<th className="text-center">설명</th>*/}
                    <th scope="col" className="text-center">저자</th>
                    <th scope="col" className="text-center">가격</th>
                    <th scope="col" className="text-center">발행일</th>
                    <th scope="col" className="text-center">등록자</th>
                    <th scope="col" className="text-center">등록일</th>
                    <th scope="col" className="text-center">재고</th>
                </tr>
                </thead>

                <tbody className="">
                {/* undefined 와 데이터의 개수 검증*/}
                {!bookList || bookList?.length === 0 ? (
                    <tr className="">
                        <td colSpan="12" className="text-center">데이터가 없습니다.</td>
                    </tr>
                ) : (
                    bookList?.map((item, index) => (

                        <tr key={index} className="table-light border-bottom">
                            <td className="text-center">
                                <input
                                    type="checkbox"
                                    id={`item${index}`}
                                    name={`item${index}`}
                                    checked={checkedInput.includes(item.bookId)} // 상태 기반 체크 여부 결정
                                    onChange={(e) => onChangeCheck(`${item.bookId}`, e.target.checked)}
                                />
                                <label htmlFor="item1">{`항목${index+1}`}</label>
                            </td>
                            <td className="text-center " id={`bookId${index}`}>{item.bookId}</td>

                            <td className="text-center" id={`bookImg${index}`}>
                                <div className="imgbox">
                                    <img src={`${item.bookImgList[0]}`} alt={`${item.bookName}도서 이미지`}/>
                                </div>
                            </td>

                            <td className="text-left" id={`bookCateNm${index}`}>{item.bookCateNm}</td>
                            <td className="text-left" id={`bookNm${index}`}>
                                <Link to={`/admin/book/bookDetail/${item.bookId}`} title={`${item.bookName} 상세페이지로 이동`}>{item.bookName}</Link>
                            </td>
                            {/*<td className="text-left" id={`bookDesc${index}`}>{item.bookDesc}</td>*/}
                            <td className="text-center" id={`bookAuthor${index}`}>{item.author}</td>
                            <td className="text-center" id={`bookPrice${index}`}>{item.bookPrice}원</td>
                            <td className="text-center" id={`bookPublishDt${index}`}>{item.publishDate}</td>
                            <td className="text-center" id={`bookWriter${index}`}>{item.writer}</td>
                            <td className="text-center" id={`bookPublishDt${index}`}>{item.createDate}</td>
                            <td className="text-center" id={`bookStock${index}`}>{item.stock}</td>
                        </tr>
                    ))
                )}

                </tbody>

            </table>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <Btn className={"create btn btn-danger"} type={"button"}  onClick={() => onDeleteHandler(checkedInput)}  text="삭제"/>
                <Btn className={"create btn btn-primary"} type={"button"} path={pathsData.page.adminBookCreate} text="등록"/>
            </div>
            {/*checkedInput만 하면 빈 배열이라도 true로 판정해서 모달이 열리기때문에 요소의 개수로 판단*/}
            {/*{showModal && (*/}
            {/*    <StaticModal*/}
            {/*        show={showModal}*/}
            {/*        onClose={handleClose}*/}
            {/*        modalType={modalType}*/}
            {/*        errorData={errorData}*/}
            {/*        onConfirm={() => onDeleteHandler(checkedInput)}/>*/}

            {/*)}*/}


        </>
    )
}

export default AdminBookList;