
import React, { useEffect, useState} from "react";
import FormTag from "@util/form/formTag.jsx";
import Btn from "@util/form/reuseBtn.jsx";
import PathsData from "../../../assets/pathsData.jsx";
import {useAuth} from "../../common/AuthContext.jsx";
import FileUpload from "./fileUpload.jsx";
import Category from "./category.jsx";
import PriceStock from "./priceStock.jsx";
import PublishDate from "./publishDate.jsx";
import RecomType from "./RecomType.jsx";
import SalesStatus from "./salesStatus.jsx";
import "@assets/css/book/adminbookCreate.css";

import {bookPriceValidation, bookStockValidation} from "@util/validation/validationCommon.js";


const AdminBookCreate = () => {
    
    // 로그인여부, 역할 훅
    const {userData} = useAuth();


    // userData가 변경될 때 roleId와 writer를 업데이트
    useEffect(() => {

        if (userData?.roleId) {
            setCurrentBook(prev => ({
                ...prev,
                roleId: userData.roleId,     // roles[0] 대신 직접 접근
                writer: userData.clientName,
            }));
        }

    }, [userData]);  // userData가 변경될 때 실행



    //핸들러 값 변경 시 실행되는 함수
    const handleChange = (e) => {

        //name이 이벤트 객체로부터 구조분해할당하여 값을 분배
        let { name, value } = e.target;
        //stock 값 숫자인지 검증 , 값이 빈 문자열이 아니고 name이 stock, bookPrice일 경우
        if ((name === "stock" || name === "bookPrice") && value.trim() !== "") {
            const result = name === "bookPrice" ? bookPriceValidation(value,name) : bookStockValidation(value,name);

            if(!result.valid){
                // 숫자 검증 false 일 경우, 모달 알림 뜸
                openModal({
                    modalType:"error",
                    content:<>
                        <p>{result.message}</p>
                    </>,
                    onConfirm:()=>{closeModal()}
                })
                // 여기에 value 값 '' 으로 변경
                value = "";
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

       const isRegistered =   await registerBook(currentBook, bookImg); // 도서등록 훅에 담아줄 객체들 담아서 서버 등록 처리
        //서버 등록 처리 완료 여부
        console.log("isRegistered",isRegistered);
        if(isRegistered){
            console.log("isRegistered success"); // 목록페이지로 이동

        }else{
            console.log("isRegistered false"); // 기존 페이지에 머무르기 ? 아니면 재등록 ?
        }

    }

//return start
    return(
        <>
            {/* 도서 등록 구조 작성 */}

            <div className="bookcreate">
                {/*onSubmit={handleInputChange}*/}

                <form className="bookCreateForm" onSubmit={onSubmit}>

                    {/*카테고리*/}
                    <Category mode="create" setDefaultData={setCurrentBook} defaultData={currentBook}
                              categoryList={categoryList}/>

                    <div className="row col-12 align-items-center mb-1 ">
                        {/*등록타입*/}
                        <RecomType setDefaultData={setCurrentBook} defaultData={currentBook}/>
                        {/* 판매상태관리 */}
                        <SalesStatus setDefaultData={setCurrentBook} defaultData={currentBook}/>
                    </div>
                    {/*도서명*/}
                    <div className="row col-12 align-items-center mb-1">
                        <FormTag id="bookName" label="도서명" labelClass="form-title col-3"
                                 className="form-control flex-fill"
                                 name="bookName" type="text"
                                 placeholder="도서명 입력" value={currentBook.bookName} onChange={handleChange}/>

                    </div>

                    <div className="row col-12 align-items-center mb-1 stock-price">
                        {/*재고 & 가격*/}
                        <PriceStock bookPrice={currentBook.bookPrice} stock={currentBook.stock}
                                    stockStatus={currentBook.stockStatus} handleChange={handleChange}/>
                        {/*발행일*/}
                        <PublishDate publishDate={currentBook.publishDate} handleChange={handleChange}/>
                    </div>
                    <div className="row col-12 align-items-center mb-1 author-writer">
                        {/*저자명 */}
                        <FormTag id="author" label="저자" labelClass="form-title col-2" className="form-control"
                                 name="author"
                                 type="text"
                                 placeholder="저자입력" value={currentBook.author} onChange={handleChange}/>

                        {/*get 요청시 로그인한 유저의 이름을 value 로 업데이팅*/}
                        <FormTag id="writer" label="작성자" labelClass="form-title col-2"
                                 className="form-control me-5"
                                 name="writer"
                                 type="text"
                                 placeholder="작성자" value={userData?.clientName} readOnly={true}/>

                        <FormTag id="createDate" label="등록일" labelClass="form-title col-2"
                                 className="form-control"
                                 name="createDate"
                                 type="text"
                                 placeholder="등록일" value={currentBook.createDate} readOnly={true}/>

                    </div>

                    {/*도서설명*/}
                    <div className="d-flex align-items-center mb-1">
                        <label htmlFor="bookDesc" className="form-title col-3">도서설명</label>
                        <textarea id="bookDesc" className="form-control flex-fill" name="bookDesc" type="text"
                                  placeholder="도서설명을 입력해주세요" value={currentBook.bookDesc}
                                  aria-describedby="bookDescHelp" required onChange={handleChange}/>
                    </div>

                     {/*도서이미지 이미지 파일 업로드 안하면 그냥 기본 이미지로 등록, 필요      */}
                    <div className="d-flex align-items-center flex-wrap">

                        <FileUpload bookImg={bookImg} setBookImg={setBookImg} defaultData={currentBook}
                                    setDefaultData={setCurrentBook}/>
                    </div>
                </form>
                <div className="d-flex align-items-center justify-content-center mt-4">
                    <Btn path={PathsData.page.adminBook} className={"login btn btn-danger mx-1"} text={"취소"}/>
                    <Btn className={"signup btn custom-btn02 mx-1"} text={"등록"} type="submit" onClick={onSubmit}/>
                </div>
            </div>

        </>
    )
}

export default AdminBookCreate;
