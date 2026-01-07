import {useNavigate, useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import Btn from "../../../util/reuseBtn.jsx";
import pathsData from "../../../assets/pathsData.jsx";
import Category from "./category.jsx";
import FormTag from "../../../util/formTag.jsx";
import PublishDate from "./publishDate.jsx";
import PriceStock from "./priceStock.jsx";
import FileUpload from "./fileUpload.jsx";
import {useAuth} from "../../common/AuthContext.jsx";
import {validNumber} from "../../../util/validation.jsx";
import {formatToDate, getToday} from "../../../util/dateUtils.jsx";
import {BookDispatchContext} from "../adminBookComponent.jsx";
import "@assets/css/book/adminbookModify.css";
import SalesStatus from "./salesStatus.jsx";
import RecomType from "./RecomType.jsx";
import {useModal} from "../../common/modal/ModalContext.jsx";
import axios from "axios";

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
    const {onUpdate} = useContext(BookDispatchContext);
    const {openModal,closeModal} = useModal();
    const navigate = useNavigate();

    //도서 정보데이터
    const [modifyBookData, setModifyBookData] = useState({
        bookId: bookId,
        bookPrice: 0, // 초기값을 0으로 지정
        stock: 0,
        stockStatus: '재고없음'
    });
    const [categoryList, setCategoryList] = useState([]);
    //파일
    const [bookImg, setBookImg] = useState({
        existing: modifyBookData.bookImgPath || [],
        new: [],
        removed: [],   // 삭제한 기존 파일
    });



    //발행일
    //수정 조회 fetch 함수
    const fetchModify = async () => {

        try{
            const response =
                await axios.get(`/api/admin/book/bookModify/${bookId}`);
            const bookData = response.data;
            const {book,cateData} = bookData; // 객체형으로 구조분해할당하기
            setModifyBookData(book);
            setCategoryList(cateData);

        }catch(err){
            //error
            openModal({
                modalType:"error",
                content:<><p>`${err.response?.data?.message}`</p></>,
                onConfirm:()=>{closeModal()}
            });
        }
    }


    // userData가 변경될 때 roleId와 writer를 업데이트
    useEffect(() => {

        fetchModify();
        if (userData && userData.roles?.length > 0) {
            setModifyBookData(prev => ({
                ...prev,
                roleId: userData.roles[0],
                writer: userData.clientName,
            }));
        }

    }, [bookId,userData]);  // userData가 변경될 때 실행

    //formData에 데이터 담아주기
    const buildFormData = (modifyBookData, bookImg) => {
        const formData = new FormData();

        Object.entries(modifyBookData).forEach(([key, value]) => {


            if (key === "bookImg") {
                const { new: newFiles, existing, removed } = bookImg;
                //새로 업로드한 파일이   있다면
                if (Array.isArray(newFiles) && newFiles.length > 0) {
                    newFiles.forEach((file) => {
                        formData.append("bookImg", file);
                    });
                }
                // 2. 삭제할 기존 파일이 있다면 추가
                if (Array.isArray(removed) && removed.length > 0) {
                    removed.forEach((file) => {
                        formData.append("removedBookImg", file.name); // 또는 file이 string이면 그대로
                    });
                }
            }
            else if (["bookCateDepth", "bookCateNm", "cateId"].includes(key) && Array.isArray(value)) {
                // 배열 처리 (카테고리 계층)
                if (value.length > 0) {
                    value.forEach(v => formData.append(key, v));
                } else {
                    console.log("빈배열 일 경우 key",key);
                    // 빈 배열일 경우도 append
                    formData.append(key, "");
                }
            }
            else if (key === "createDate") {
                //수정완료시 데이터를 서버로 전송하면 오늘날짜로 변경해서 데이터베이스에 넣어주기
                modifyBookData["createDate"]= getToday(); //서버로 전송할 데이터객체형태로 변경
                formData.append("createDate",  modifyBookData["createDate"]);
            }
            else {
                // 일반 문자열 처리
                formData.append(key, value ?? ""); //value가 null 이면 "" 처리
            }
        });

        return formData;
    };

    // formData에 검증
    const validateFormData = (formData) => {
        const entries = Array.from(formData.entries());

        const optionalKeys = ["bookImgPath","viewCnt","wishID"];

        for (const [key, value] of entries) {
            // console.log("createBook valid key ",key);
            // bookImgPath는 비어 있어도 통과
            if (optionalKeys.includes(key)) continue;

            if (typeof value === "string" && value.trim() === "") {
                return key; // 비어있는 문자열 키 반환
            }
            if (!value) {
                return key; // null, undefined 등 비어있는 값
            }
        }

        return null; // 문제 없음
    };

    //핸들러 값 변경 시 실행되는 함수
    const handleChange = (e) => {
        //name이 이벤트 객체로부터 구조분해할당하여 값을 분배
        const { name, value } = e.target;

        //stock 값 숫자인지 검증 , 값이 빈 문자열이 아니고 name이 stock, bookPrice일 경우
        if ((name === "stock" || name === "bookPrice") && value.trim() !== "") {

            const result = name === "bookPrice" ? validNumber(value,name,"도서가격") : validNumber(value,name,"재고");

            if(!result.valid){
                // 숫자 검증 false 일 경우, 모달 알림 뜸
                openModal({
                    modalType:"error",
                    content: <>
                        <p>`${result.message}`</p>
                    </>,
                    onConfirm:()=>{closeModal()}
                })
            }
        }
        setModifyBookData({
            ...modifyBookData,//기존에 있는 데이터들 스프레드 연산자로 합쳐주기
            [name] : value,
            // 재고수량에 따른 재고상태값 변화 조건 , 스프레드 연산자로  객체 항목 추가
            ...(name === 'stock' && {
                stockStatus: value !== '0' && value !== '' ? '재고있음' : '재고없음', // stock 값에 따라 stockStatus 변경
            }),
        })
    }
    // 서버로 전송
    const handleSubmit = async () => {
        const formData = buildFormData(modifyBookData, bookImg);
        //빈값 검증
        const emptyKey = validateFormData(formData);
        if (emptyKey) {
            openModal({
                modalType: "error",
                content:<>
                    <p>`${emptyKey} 값을 채워주세요.`</p>
                </>,
                onConfirm:()=>{closeModal()}
            });
            return;
        }

        try{
            const response = await axios.post(`/api/admin/book/bookModify/${bookId}`,
                formData, {});
            //서버응답
            const newUpdatingData=response.data;
            // onUpdate를 통해 데이터 클라이언트 데이터 갱신?
            onUpdate(newUpdatingData);
            // 목록 페이지로 이동
            navigate("/admin/book/bookList");
        }catch(err){
            openModal({
                modalType: "error",
                content:<>
                    <p>서버 요청 중 오류가 발생했습니다. 다시 시도해주세요.</p>
                    <p>`에러 : ${err}`</p>
                </>,
                onConfirm:()=>{closeModal()}
            });
        }

    }

    //전송
    const onSubmit = (e) => {
        e.preventDefault(); // 기본 폼 제출 동작을 막기 위해서 추가
        handleSubmit();
    }


    return(
        <>
            {/* 도서 등록 구조 작성 */}

            <div className=" modifybook">
                {/*onSubmit={handleInputChange}*/}
                <form className="bookModifyForm" onSubmit={onSubmit}>
                    {/*카테고리*/}
                    <div className="d-flex align-items-center mb-1 sperate">
                        {/*카테고리*/}
                        <Category mode="modify" setDefaultData={setModifyBookData} defaultData={modifyBookData} categoryList={categoryList}/>
                    </div>
                    <div className="d-flex align-items-center mb-1 sperate">
                        {/*등록타입*/}
                        <RecomType setDefaultData={setModifyBookData} defaultData={modifyBookData} />
                        {/* 판매상태관리 */}
                        <SalesStatus setDefaultData={setModifyBookData} defaultData={modifyBookData} />
                    </div>

                    {/*도서명*/}
                    <div className="d-flex align-items-center mb-1">
                        <FormTag id="bookName" label="도서명" labelClass="form-title" className="form-control"
                                 name="bookName" type="text"
                                 placeholder="도서명 입력" value={modifyBookData.bookName} onChange={handleChange}/>
                    </div>
                    {/*저자명 */}
                    <div className="d-flex align-items-center mb-1">
                        <FormTag id="author" label="저자" labelClass="form-title" className="form-control  w-50" name="author"
                                 type="text"
                                 placeholder="저자입력" value={modifyBookData.author} onChange={handleChange}/>

                    {/*발행일*/}
                        <PublishDate publishDate={modifyBookData.publishDate} handleChange={handleChange}/>
                    </div>
                    <div className="d-flex align-items-center mb-1 sperate">
                        {/*재고 & 가격 : ??(null병합 연산자로 값이 있을경우와 없을 경우 분기     */}
                        <PriceStock bookPrice={String(modifyBookData?.bookPrice ?? "")}
                                    stock={String(modifyBookData?.stock ?? "")}
                                    stockStatus={modifyBookData?.stockStatus || '재고없음'} handleChange={handleChange}/>
                    </div>

                    {/*작성자*/}
                    <div className="d-flex align-items-center mb-1 sperate">
                        {/*get 요청시 로그인한 유저의 이름을 value 로 업데이팅*/}
                        <FormTag id="writer" label="작성자" labelClass="form-title" className="form-control w-50" name="writer"
                                 type="text"
                                 placeholder="작성자" value={userData?.clientName} readOnly={true}/>

                        <FormTag id="createDate" label="등록일" labelClass="form-title" className="form-control w-50"
                                 name="createDate"
                                 type="text"
                                 placeholder="등록일" value={formatToDate(new Date(modifyBookData.createDate))}
                                 readOnly={true}/>

                    </div>
                    {/*도서설명*/}
                    <div className="d-flex align-items-center mb-1">
                        <label htmlFor="bookDesc" className="form-title">도서설명</label>
                        <textarea id="bookDesc" className="form-control" name="bookDesc" type="text"
                                  placeholder="도서설명을 입력해주세요" value={modifyBookData.bookDesc}
                                  aria-describedby="bookDescHelp" required onChange={handleChange}/>
                        {/*255글자 넘어가면 에러메시지 출력 */}
                    </div>

                    {/*도서이미지
                        이미지 파일 업로드 안하면 그냥 기본 이미지로 등록, 필요
                    */}
                    <div className="align-items-center input-group flex-wrap">
                        {/*갱신값과 초기값을 전달하기 위해서 둘 다
                            부모가 상태관리를 해야 전체적인 데이터 흐름을 제어할 수 있음
                        */}
                        {modifyBookData.bookId && (
                            <FileUpload
                                bookImg={bookImg}
                                setBookImg={setBookImg}
                                defaultData={modifyBookData}
                                setDefaultData={setModifyBookData}
                            />
                        )}
                    </div>
                </form>
                <div className="d-grid gap-2 d-md-flex justify-content-md-between mt-4">
                    <Btn className={"modify btn custom-btn00"} type={"button"}
                         path={`${pathsData.page.adminBookDetail}/${bookId}`}
                         text="뒤로"/>
                    <Btn className={"modify btn btn-dark"} type="submit" onClick={onSubmit}
                         text="확인"/>
                </div>
            </div>
            {/* 알림 모달 추가하기 */}

        </>

    )
}

export default AdminBookModify;