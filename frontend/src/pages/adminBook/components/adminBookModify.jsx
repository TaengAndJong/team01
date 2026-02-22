import {useNavigate, useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import Btn from "../../../util/form/reuseBtn.jsx";
import pathsData from "../../../assets/pathsData.jsx";
import Category from "./category.jsx";
import FormTag from "../../../util/form/formTag.jsx";
import PublishDate from "./publishDate.jsx";
import PriceStock from "./priceStock.jsx";
import FileUpload from "./fileUpload.jsx";
import {useAuth} from "../../common/AuthContext.jsx";
import {formatToDate} from "@util/date/dateUtils.jsx";
import "@assets/css/book/adminbookModify.css";
import SalesStatus from "./salesStatus.jsx";
import RecomType from "./RecomType.jsx";

import {useAdminBook} from "../adminBookProvider.jsx";
import {bookPriceValidation, bookStockValidation} from "../../../util/validation/validationCommon.js";

const AdminBookModify = () => {

    /*
    * 0. URL을 통해서 해당 데이터의 ID값을 가져오기,
    * 1. 렌더링 될 때, useEffect fetch  요청을  통해 해당 ID의 기존 정보 조회해서 가져오기
    *  ==> 상태관리의 초기값이 됨
    * 2. 수정 가능한 부분과 불가능한 부분 나누기
    * 3. 다시 서버로 제출 (post 요청) 및 클라이언트 상태업데이트(onUpdate) 해주기
    * */
    const {bookId} = useParams(); // URL에서 bookId 값 받아오기
    const {userData} = useAuth();// 로그인한 사용자 데이터



    const {currentBook,setCurrentBook
        ,bookImg, setBookImg
        ,fetchModify,modifyBook
        ,navigate,openModal,closeModal
        ,categoryList} = useAdminBook();


    useEffect(() => {
        // user
        if (bookId && userData) {
            console.log("userData---", userData);
            fetchModify(bookId, userData);
        }
    }, [bookId]);

    useEffect(() => {
        console.log("currentBook-----", currentBook);
        // 1. 책 ID가 있고, 2. 아직 이미지를 세팅하기 전(existing이 비어있을 때)만 실행
        if (currentBook.bookId && bookImg.existing.length === 0 && bookImg.removed.length === 0) {
            //서버에서 받아온 도서이미지
            const raw = currentBook.bookImgPath;
            console.log("raw bookImg -- bookModify", raw);

            // 데이터가 없거나 'noimg'가 포함된 경우 빈 배열 처리
            if (!raw || raw.toLowerCase().includes("noimg")) {
                setBookImg({ existing: [], new: [], removed: [] });
                return;
            }

            //imgPaths 타입이 문자열이면, ","를 기준으로 나누어 양 끝 공백제거 후 true 인것만 반환 아니면 빈배열
            // filter(Boolean)을 사용하여 ""(빈 문자열)이면 false 판정으로 제외하여 문자열이 존재(true)만 반환
            //Boolean은 리액트/자바스크립트에서 "", null, undefined, 0, false는 모두 Boolean() 함수에 넣었을 때 false 판정으로
            // 진짜 값이 있는 경우만 필터링할 경우 사용
            const imgPaths = typeof raw === "string"
                ? raw.split(",").map(item => item.trim()).filter(Boolean)
                : [];

            setBookImg({
                existing: imgPaths.map(name => ({ name })), // FileUpload가 읽을 수 있는 형태
                new: [],
                removed: []
            });
        }
    }, [currentBook.bookId]); // 데이터가 로드될 때 딱 한 번만 작동

    //핸들러 값 변경 시 실행되는 함수
    const handleChange = (e) => {
        //name이 이벤트 객체로부터 구조분해할당하여 값을 분배
        const { name, value } = e.target;

        console.log("modify onChange " , name, value);
        //stock 값 숫자인지 검증 , 값이 빈 문자열이 아니고 name이 stock, bookPrice일 경우
        if ((name === "stock" || name === "bookPrice") && value.trim() !== "") {

            const result = name === "bookPrice" ? bookPriceValidation(value,name) : bookStockValidation(value,name);

            if(!result.valid){
                // 숫자 검증 false 일 경우, 모달 알림 뜸
                openModal({
                    modalType:"error",
                    content: <>
                        <p>{result.message}</p>
                    </>,
                    onConfirm:()=>{closeModal()}
                })
            }
        }
        setCurrentBook({
            ...currentBook,//기존에 있는 데이터들 스프레드 연산자로 합쳐주기
            [name] : value,
            // 재고수량에 따른 재고상태값 변화 조건 , 스프레드 연산자로  객체 항목 추가
            ...(name === 'stock' && {
                stockStatus: value !== '0' && value !== '' ? '재고있음' : '재고없음', // stock 값에 따라 stockStatus 변경
            }),
        })
    }


    //전송
    const onSubmit = async (e) => {
        e.preventDefault(); // 기본 폼 제출 동작을 막기 위해서 추가

        const isModified = await modifyBook(currentBook, bookImg);
        // 목록 페이지로 이동
        if(isModified){
            console.log("isModified",isModified);
            navigate("/admin/book/bookList");
        }else{
            console.log("isModified false");
        }

    }

    return(
        <>
            {/* 도서 등록 구조 작성 */}

            <div className=" modifybook">
                {/*onSubmit={handleInputChange}*/}
                <form className="bookModifyForm" onSubmit={onSubmit}>
                    {/*카테고리*/}
                    <Category mode="modify" setDefaultData={setCurrentBook} defaultData={currentBook}
                              categoryList={categoryList}/>

                    <div className="row col-12 align-items-center mb-1 ">
                        {/*등록타입*/}
                        <RecomType setDefaultData={setCurrentBook} defaultData={currentBook}/>
                        {/* 판매상태관리 */}
                        <SalesStatus setDefaultData={setCurrentBook} defaultData={currentBook}/>
                    </div>

                    {/*도서명*/}
                    <div className="row col-12 align-items-center mb-1">
                        <FormTag id="bookName" label="도서명" labelClass="form-title col-3" className="form-control flex-fill"
                                 name="bookName" type="text"
                                 placeholder="도서명 입력" value={currentBook.bookName} onChange={handleChange}/>
                    </div>


                    <div className="row col-12 align-items-center mb-1 stock-price">
                        {/*재고 & 가격 : ??(null병합 연산자로 값이 있을경우와 없을 경우 분기     */}
                        <PriceStock bookPrice={String(currentBook?.bookPrice ?? "")}
                                    stock={String(currentBook?.stock ?? "")}
                                    stockStatus={currentBook?.stockStatus || '재고없음'} handleChange={handleChange}/>
                        {/*발행일*/}
                        <PublishDate publishDate={currentBook.publishDate} handleChange={handleChange}/>
                    </div>

                    <div className="row col-12 align-items-center mb-1 author-writer">
                        {/*저자명 */}
                        <FormTag id="author" label="저자" labelClass="form-title col-2" className="form-control" name="author"
                                 type="text"
                                 placeholder="저자입력" value={currentBook.author} onChange={handleChange}/>

                        {/*get 요청시 로그인한 유저의 이름을 value 로 업데이팅*/}
                        <FormTag id="writer" label="작성자" labelClass="form-title col-2" className="form-control me-5" name="writer"
                                 type="text"
                                 placeholder="작성자" value={userData?.clientName} readOnly={true}/>

                        <FormTag id="createDate" label="등록일" labelClass="form-title col-2" className="form-control"
                                 name="createDate"
                                 type="text"
                                 placeholder="등록일" value={formatToDate(new Date(currentBook.createDate))}
                                 readOnly={true}/>

                    </div>
                    {/*도서설명*/}
                    <div className="d-flex align-items-center mb-1">
                        <label htmlFor="bookDesc" className="form-title col-3">도서설명</label>
                        <textarea id="bookDesc" className="form-control flex-fill" name="bookDesc" type="text"
                                  placeholder="도서설명을 입력해주세요" value={currentBook.bookDesc}
                                  aria-describedby="bookDescHelp" required onChange={handleChange}/>
                        {/*255글자 넘어가면 에러메시지 출력 */}
                    </div>

                    <div className="align-items-center flex-wrap">
                        {/*갱신값과 초기값을 전달하기 위해서 둘 다
                            부모가 상태관리를 해야 전체적인 데이터 흐름을 제어할 수 있음
                        */}
                        {currentBook.bookId && (
                            <FileUpload
                                bookImg={bookImg}
                                setBookImg={setBookImg}
                                defaultData={currentBook}
                                setDefaultData={setCurrentBook}
                            />
                        )}
                    </div>
                </form>
                <div className="d-grid gap-2 d-md-flex justify-content-md-between mt-4">
                    <Btn className={"modify btn custom-btn00"} type={"button"}
                         path={`${pathsData.page.adminBookDetail}/${bookId}`}
                         text="뒤로"/>
                    <Btn className={"modify btn btn-dark"} type="submit" onClick={onSubmit}
                         text="수정"/>
                </div>
            </div>
            {/* 알림 모달 추가하기 */}

        </>

    )
}

export default AdminBookModify;