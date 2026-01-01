
import React, {useContext, useEffect, useState} from "react";
import FormTag from "../../../util/formTag.jsx";
import Btn from "../../../util/reuseBtn.jsx";
import PathsData from "../../../assets/pathsData.jsx";
import {BookDispatchContext, PaginationContext} from "../adminBookComponent.jsx";
import {useAuth} from "../../common/AuthContext.jsx";
import FileUpload from "./fileUpload.jsx";
import Category from "./category.jsx";
import {useNavigate} from "react-router-dom";
import {formatToDate, getToday} from "../../../util/dateUtils.jsx";
import PriceStock from "./priceStock.jsx";
import {validNumber} from "../../../util/validation.jsx";
import PublishDate from "./publishDate.jsx";
import RecomeType from "./recomeType.jsx";
import SalesStatus from "./salesStatus.jsx";
import {useModal} from "../../common/modal/ModalContext.jsx";
import axios from "axios";

//전체선택, 개별선택 삭제, 장바구니버튼, 바로구매버튼, 찜목록 버튼 , 리뷰

const AdminBookCreate = () => {

    const {userData} = useAuth();
    const {setPaginationInfo,setSearchCondition,fetchBookList } = useContext(PaginationContext);
    const navigate = useNavigate();
    const {openModal,closeModal} = useModal();

    //리액트는 초기값이 렌더링 되면 상태관리 방식으로인해 값이 고정되어
    // 렌더링될 때마다 렌더링 타이밍과 초기화 방식을 고려해 데이터를 갱신해줘야 함
    const [createBook, setCreateBook] = useState({
        bookName: '',
        bookCateNm:[],
        bookCateDepth:[],
        bookDesc: '',
        author:'',
        bookPrice: '0',
        stock: '0',
        stockStatus:'재고없음',
        publishDate:'', //발행일
        roleId:'',
        cateId:[],
        bookImg: [], // 다중 파일 업로드라면 배열로 설정
        writer: '',
        createDate:formatToDate(new Date()), // 클라이언트에게 보여줄 날짜 ==> 데이터베이스는 자동으로 데이터 넣기
        recomType:'NORMAL',
        saleStatus:'판매중'
    })
    //카테고리
    const [categoryList, setCategoryList] = useState([]); // 도서 카테고리 상태관리
    //파일
    const [bookImg, setBookImg] = useState({
        existing: [], // 서버에서 불러온 기존 파일
        new: [],      // 새로 업로드한 파일
        removed: []   // 삭제한 기존 파일
    });
    // 업로드 파일 상태관리


    //get 요청서 categoryList 받아오기
    const getCategories = async () => {
        try{
            const response = await  fetch("/api/admin/book/bookCreate",{
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if(!response.ok){

                throw  Error(response.statusText);
            }
            // 요청 성공 시 ,응답 제이슨으로 받아오기
            const data = await response.json();
            setCategoryList(data);

        }catch(err){
            console.error("getCategories 실패:", err);
        }
    }

    // userData가 변경될 때 roleId와 writer를 업데이트
    useEffect(() => {
        if (userData && userData.roles?.length > 0) {
            setCreateBook(prev => ({
                ...prev,
                roleId: userData.roles[0],
                writer: userData.clientName,
            }));
        }
        getCategories();
    }, [userData]);  // userData가 변경될 때 실행

    useEffect(() => {
        setCreateBook(prev => ({
            ...prev,
            bookImg: bookImg.new,
        }));
    }, [bookImg])




    //핸들러 값 변경 시 실행되는 함수
    const handleChange = (e) => {

        //name이 이벤트 객체로부터 구조분해할당하여 값을 분배
        let { name, value } = e.target;
        //stock 값 숫자인지 검증 , 값이 빈 문자열이 아니고 name이 stock, bookPrice일 경우
        if ((name === "stock" || name === "bookPrice") && value.trim() !== "") {
            const result = name === "bookPrice" ? validNumber(value,name,"도서가격") : validNumber(value,name,"재고");
            if(!result.valid){
                // 숫자 검증 false 일 경우, 모달 알림 뜸
                openModal({
                    modalType:"error",
                    content:<>
                        <p>{`${result.message}`}</p>
                    </>,
                })
                // 여기에 value 값 '' 으로 변경
                value = "";
            }

        }

        setCreateBook({
            ...createBook,//기존에 있는 데이터들 스프레드 연산자로 합쳐주기
            [name] : value,
            // 재고수량에 따른 재고상태값 변화 조건 , 스프레드 연산자로  객체 항목 추가
            ...(name === 'stock' && {
                stockStatus: value !== '0' && value !== '' ? '재고있음' : '재고없음', // stock 값에 따라 stockStatus 변경
            }),
        })
    }

    //formData에 데이터 담아주기
    const buildFormData = (createBook, bookImg) => {
        const formData = new FormData();

        Object.entries(createBook).forEach(([key, value]) => {
            // console.log("createBook key ",key);

            if (key === "bookImg") {
                // 이미지 파일 처리
                (bookImg.new || []).forEach(img => formData.append("bookImg", img));
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
                // 등록일 생성
                const today = getToday();
                formData.append("createDate", today);
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

        for (const [key, value] of entries) {

            //bookImgPath는 비어 있어도 통과
            if (key === "bookImgPath") continue;

            if (typeof value === "string" && value.trim() === "") {
                return key; // 비어있는 문자열 키 반환
            }
            if (!value) {
                return key; // null, undefined 등 비어있는 값
            }
        }

        return null; // 문제 없음
    };

    // 서버로 전송
    const handleSubmit = async () => {
        const formData = buildFormData(createBook, bookImg);

        const emptyKey = validateFormData(formData);
        if (emptyKey) {

            openModal({
                modalType: "error",
                content:<>
                    <p>{`${emptyKey} 값을 채워주세요.`}</p>
                </>,
            });
            return;
        }

        try {
            const response = await axios.post("/api/admin/book/bookCreate",
                formData, {
                    headers: {
                        // FormData는 브라우저가 boundary를 자동 생성
                        // Content-Type 명시하지 않기
                        // "Content-Type": "multipart/form-data"
                    },
                });

                console.log("create response", response);

                setSearchCondition(null); // 검색어 상태를 초기화 해줘야 등록완료후 처음으로돌아감
                // 1. 페이지 1로 이동 ( 이미 1페이지면 state 변경이 안됨)
                setPaginationInfo(prev => ({ ...prev, currentPage: 1 }));
                // 2. 다시 서버로 재요청 (명시적으로 fetch 호출이 안전)
                await fetchBookList();
                // 3. 목록 페이지로 이동
                navigate("/admin/book/bookList");


        } catch (err) {
            console.log("에러 ",err)
            console.log("에러 ",err.response?.data);
            openModal({
                modalType: "error",
                content:<>
                    <p>서버 요청 중 오류가 발생했습니다. 다시 시도해주세요.</p>
                    <p>error :{err.response?.data}</p>
                </>,
            });
        }
    };

//전송
    const onSubmit = (e) => {
        e.preventDefault(); // 기본 폼 제출 동작을 막기 위해서 추가
        handleSubmit();
    }

//return start
    return(
        <>
            {/* 도서 등록 구조 작성 */}

            <div className="bookcreate">
                {/*onSubmit={handleInputChange}*/}

                <form className="bookCreateForm" onSubmit={onSubmit}>
                    <div className="d-flex align-items-center mb-1">
                        {/*카테고리*/}
                        <Category mode="create" setDefaultData={setCreateBook} defaultData={createBook} categoryList={categoryList}/>
                    </div>
                    <div className="d-flex align-items-center mb-1">
                        {/*등록타입*/}
                        <RecomeType setDefaultData={setCreateBook}/>
                        {/* 판매상태관리 */}
                        <SalesStatus setDefaultData={setCreateBook}/>
                    </div>
                    {/*도서명*/}
                    <div className="d-flex align-items-center mb-1">
                        <FormTag id="bookName" label="도서명" labelClass="form-title"
                                 className="form-control flex-fill me-3"
                                 name="bookName" type="text"
                                 placeholder="도서명 입력" value={createBook.bookName} onChange={handleChange}/>

                    </div>
                    <div className="d-flex align-items-center mb-1">
                        {/*저자명 */}
                        <FormTag id="author" label="저자" labelClass="form-title" className="form-control w-auto"
                                 name="author"
                                 type="text"
                                 placeholder="저자입력" value={createBook.author} onChange={handleChange}/>
                        {/*발행일*/}
                        <PublishDate publishDate={createBook.publishDate} handleChange={handleChange}/>
                    </div>

                    <div className="d-flex align-items-center mb-1 ">
                        {/*재고 & 가격*/}
                        <PriceStock bookPrice={createBook.bookPrice} stock={createBook.stock}
                                    stockStatus={createBook.stockStatus} handleChange={handleChange}/>
                    </div>
                    <div className="d-flex align-items-center mb-1">
                        {/*get 요청시 로그인한 유저의 이름을 value 로 업데이팅*/}
                        <FormTag id="writer" label="작성자" labelClass="form-title"
                                 className="form-control flex-fill me-5"
                                 name="writer"
                                 type="text"
                                 placeholder="작성자" value={userData?.clientName} readOnly={true}/>

                        <FormTag id="createDate" label="등록일" labelClass="form-title"
                                 className="form-control flex-fill "
                                 name="createDate"
                                 type="text"
                                 placeholder="등록일" value={createBook.createDate} readOnly={true}/>

                    </div>
                    {/*작성자*/}
                    <div className="d-flex align-items-center mb-1">

                    </div>
                    {/*도서설명*/}
                    <div className="d-flex align-items-center mb-1">
                        <label htmlFor="bookDesc" className="form-title">도서설명</label>
                        <textarea id="bookDesc" className="form-control" name="bookDesc" type="text"
                                  placeholder="도서설명을 입력해주세요" value={createBook.bookDesc}
                                  aria-describedby="bookDescHelp" required onChange={handleChange}/>
                    </div>

                    {/*도서이미지
                        이미지 파일 업로드 안하면 그냥 기본 이미지로 등록, 필요
                    */}
                    <div className="d-flex align-items-center flex-wrap">

                        {/*갱신값과 초기값을 전달하기 위해서 둘 다
                            부모가 상태관리를 해야 전체적인 데이터 흐름을 제어할 수 있음
                        */}
                        <FileUpload bookImg={bookImg} setBookImg={setBookImg} defaultData={createBook} setDefaultData={setCreateBook}/>
                    </div>


                </form>
                <div className="d-flex align-items-center justify-content-center mt-4">
                    <Btn path={PathsData.page.adminBook} className={"login btn btn-danger mx-1"} text={"취소"}/>
                    <Btn className={"signup btn custom-btn02 mx-1"} text={"완료"} type="submit" onClick={onSubmit}/>
                </div>
            </div>

        </>
    )
}

export default AdminBookCreate;