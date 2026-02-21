
import React, { useEffect, useState} from "react";
import FormTag from "@util/form/formTag.jsx";
import Btn from "@util/form/reuseBtn.jsx";
import PathsData from "../../../assets/pathsData.jsx";
import {useAuth} from "../../common/AuthContext.jsx";
import FileUpload from "./fileUpload.jsx";
import Category from "./category.jsx";
import {formatToDate} from "@util/date/dateUtils.jsx";
import PriceStock from "./priceStock.jsx";
import {numberValidation} from "@util/validation/validationCommon.js";
import PublishDate from "./publishDate.jsx";
import RecomType from "./RecomType.jsx";
import SalesStatus from "./salesStatus.jsx";
import "@assets/css/book/adminbookCreate.css";
import {useAdminBook} from "../adminBookProvider.jsx";
import {bookPriceValidation, bookStockValidation} from "../../../util/validation/validationCommon.js";


//전체선택, 개별선택 삭제, 장바구니버튼, 바로구매버튼, 찜목록 버튼 , 리뷰--

const AdminBookCreate = () => {
    
    // 로그인여부, 역할 훅
    const {userData} = useAuth();
    //도서 등록 훅
    const {openModal, closeModal,navigate,registerBook} = useAdminBook();


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
        if (userData && userData.roleId) {
            setCreateBook(prev => ({
                ...prev,
                roleId: userData.roleId,     // roles[0] 대신 직접 접근
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
            const result = name === "bookPrice" ? bookPriceValidation(value,name) : bookStockValidation(value,name);

            if(!result.valid){
                // 숫자 검증 false 일 경우, 모달 알림 뜸
                openModal({
                    modalType:"error",
                    content:<>
                        <p>{`${result.message}`}</p>
                    </>,
                    onConfirm:()=>{closeModal()}
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


//전송
    const onSubmit = async (e) => {
        e.preventDefault(); // 기본 폼 제출 동작을 막기 위해서 추가
       const isRegistered =   await registerBook(createBook, bookImg); // 도서등록 훅에 담아줄 객체들 담아서 서버 등록 처리
        //서버 등록 처리 완료 여부
        console.log("isRegistered",isRegistered);
        if(isRegistered){
            console.log("isRegistered success"); // 목록페이지로 이동
            navigate("/admin/book/bookList");
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
                    <Category mode="create" setDefaultData={setCreateBook} defaultData={createBook}
                              categoryList={categoryList}/>

                    <div className="row col-12 align-items-center mb-1 ">
                        {/*등록타입*/}
                        <RecomType setDefaultData={setCreateBook} defaultData={createBook}/>
                        {/* 판매상태관리 */}
                        <SalesStatus setDefaultData={setCreateBook} defaultData={createBook}/>
                    </div>
                    {/*도서명*/}
                    <div className="row col-12 align-items-center mb-1">
                        <FormTag id="bookName" label="도서명" labelClass="form-title col-3"
                                 className="form-control flex-fill"
                                 name="bookName" type="text"
                                 placeholder="도서명 입력" value={createBook.bookName} onChange={handleChange}/>

                    </div>

                    <div className="row col-12 align-items-center mb-1 stock-price">
                        {/*재고 & 가격*/}
                        <PriceStock bookPrice={createBook.bookPrice} stock={createBook.stock}
                                    stockStatus={createBook.stockStatus} handleChange={handleChange}/>
                        {/*발행일*/}
                        <PublishDate publishDate={createBook.publishDate} handleChange={handleChange}/>
                    </div>
                    <div className="row col-12 align-items-center mb-1 author-writer">
                        {/*저자명 */}
                        <FormTag id="author" label="저자" labelClass="form-title col-2" className="form-control"
                                 name="author"
                                 type="text"
                                 placeholder="저자입력" value={createBook.author} onChange={handleChange}/>

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
                                 placeholder="등록일" value={createBook.createDate} readOnly={true}/>

                    </div>

                    {/*도서설명*/}
                    <div className="d-flex align-items-center mb-1">
                        <label htmlFor="bookDesc" className="form-title col-3">도서설명</label>
                        <textarea id="bookDesc" className="form-control flex-fill" name="bookDesc" type="text"
                                  placeholder="도서설명을 입력해주세요" value={createBook.bookDesc}
                                  aria-describedby="bookDescHelp" required onChange={handleChange}/>
                    </div>

                     {/*도서이미지 이미지 파일 업로드 안하면 그냥 기본 이미지로 등록, 필요      */}
                    <div className="d-flex align-items-center flex-wrap">

                        <FileUpload bookImg={bookImg} setBookImg={setBookImg} defaultData={createBook}
                                    setDefaultData={setCreateBook}/>
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
