
/* 도서 데이터 관리
*   Reducer, Fetch, Search 등  비즈니스 로직 Hook 분리
*   axios로 데이터를 가져오고, reducer로 상태 업데이터,
*   pagination 번호 계산, fetchBookList 등의 함수를 리턴
*
*   ** UI를 그리지 않는 순수한 로직일 경우  .js **
*
*  hook은 데이터를 처리하고 결과만 보고하는 역할
* */

import React, {useReducer, useState} from "react";
import axios from "axios";
import {catchError} from "../../util/error/error.jsx";
import {formatToDate, getToday} from "../../util/date/dateUtils.jsx";

//reducer은 훅 외부에 작성하는 게  깔끔
function reducer(state, action) {

    switch (action.type) {
        case "INIT": //초기데이터

            // 서버에서 단일객체{} 또는 여러 개의 객체가  action.data로 넘어오면 배열에 담아줘야 함.
            return Array.isArray(action.data) ? action.data : [action.data];
        case "CREATE"://생성

            return [action.data, ...state]; // 새 객체(action.data) + 기존 배열, action.data는 단일객체
        case "DELETE"://삭제
            //서버에서 재조회된 items 배열로 전체 교체
            return Array.isArray(action.data) ? [...action.data] : state;

        case "UPDATE":
            // if (action.data) {
            //   console.log("UPDATE action", action.data, Array.isArray(action.data));
            // }
            //state는 새로 들어온 데이터객체를 담고있는 배열
            // action.data의 bookId가 기존데이터인 book의 bookId와 같으면 새로들어온 action.data로 교체 아니면 기존 데이터 유지
            return state.map((book) =>
                book.bookId === action.data.bookId ? action.data : book
            );
        default:
            return state;
    }
    //reducer end
}

//한글 변환용 객체
const korname = {
    bookName: "도서명",
    bookCateNm:"카테고리",
    bookDesc: "도서설명",
    author:"저자",
    publishDate:"발행일", //발행일
    recomType:"도서분류",
    saleStatus:'판매중'
}


//useState나 useReducer을 사용하면 use를 포함하여 이름 작성하기
export const useAdminBookManagement = (openModal, closeModal, navigate) =>{
//openModal, closeModal, navigate : 인자들은 catchError에 필요하기 때문에 받아와야함
    const initialState = {
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
    }

    //리듀서 상태관리
    const [bookdata, dispatch] = useReducer(reducer, null);
    //각 페이지 도서데이터 상태관리
    const [currentBook, setCurrentBook] = useState(initialState)
    //검색어 입력중 상태관리
    const [search, setSearch] = useState({
        bookType: "ALL", // 전체 / 국내도서 / 국외도서
        searchType: "bookName", // bookName(도서명), author(저자)
        recomType: "ALL",
        stockType: "ALL",
        keyword: "", // 검색어
    });
    // 실제 조회 조건 (서버로 보내는 값으로 확정된 검색값 상태관리)
    const [searchCondition, setSearchCondition] = useState(null);
    //pagination
    const [paginationInfo, setPaginationInfo] = useState({
        currentPage: 1,
        totalPages: 0,
        totalRecord: 0,
        pageSize: 6,
    });

    // 카테고리
    const [categoryList, setCategoryList] = useState([]);



    //초기데이터 설정 : 훅 내부로 옮긴 이유는 '캡슐화'로 컴포넌트는 UI 중심으로 복잡한 데이터로직을 알 필요가 없음
    const onInit = (bookdata) => {
        dispatch({
            type: "INIT",
            data: bookdata,
        });
    };
    const onCreate = (createBook) => {

        dispatch({
            type: "CREATE", // 이벤트 발생 시 작동해야할 dispatch 타입 결정
            data: createBook,
        });
    };
    const onDelete = (newBookList) => {

        dispatch({
            type: "DELETE",
            data: newBookList,
        });
    };
    const onUpdate = (updateBook) => {

        dispatch({
            type: "UPDATE",
            data: updateBook,
        });
    };
    
    //get요청(초기 조회 , 검색 시 조회, 페이지번호변경 시 사용하는 fetch요청 함수
    // 문제점 : 검색 버튼을 누르지 않았을 경우에도 검색필터가 반영됨 --- > 검색 키워드 상태값 관리 필요
    const fetchBookList = async () => {

        try{
            const response = await axios.get("/api/admin/book/bookList",{
                params: {
                    currentPage: paginationInfo.currentPage,
                    pageSize: paginationInfo.pageSize,
                    ...(searchCondition ?? {}),//검색조건이 있으면 포함 아니면 빈객체
                }
            });


            //서버에서 넘온 데이터 객체구조분해
            const { currentPage, items, pageSize, totalPages, totalRecord } = response.data;


            // 도서 목록 갱신
            onInit(items);

            // 데이터삭제시 페이지 개수 수정
            let fixedPage = currentPage;
            if (currentPage > totalPages) {
                fixedPage = totalPages === 0 ? 1 : totalPages;
            }

            //페이지네이션 재설정
            setPaginationInfo({
                currentPage: fixedPage,
                pageSize,
                totalPages,
                totalRecord,
            });

        }catch(err){
            //에러 처리 핸들러
            catchError(err, { openModal, closeModal, navigate });
        }
        //try end
    }; //fetch end

    // create 도서 등록 함수
    const registerBook = async (createBookData, bookImg) => {
        // formData 생성 
        const formData = new FormData();

        Object.entries(createBookData).forEach(([key, value]) => {

            if (key === "bookImg") {
                // 이미지 파일 처리
                (bookImg.new || []).forEach(img => formData.append("bookImg", img));
            }
            else if (["bookCateDepth", "bookCateNm", "cateId"].includes(key) && Array.isArray(value)) {
                // 배열 처리 (카테고리 계층)
                if (value.length > 0) {
                    value.forEach(v => formData.append(key, v));
                } else {
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

        // 유효성 검사
        const entries = Array.from(formData.entries());

        for (const [key, value] of entries) {

            //bookImgPath는 비어 있어도 통과
            if (key === "bookImgPath") continue;

            if (!value || typeof value === "string" && value.trim() === "") { // null, undefined 등 비어있는 값 & 비어있는 문자열
                const errorField = korname[key] || key;
                openModal({
                    modalType: "error",
                    content: <p>{errorField} 값을 채워주세요.</p>,
                    onConfirm: () => closeModal()
                });
                return false; // 검증 실패 시 중단 , true, false 로 성공여부를 알려주면 이후 과정확장 시 조건 여부로 사용가능
            }
        }


        // 서버로 axios.post 비동기 요청
        try {
            await axios.post("/api/admin/book/bookCreate",formData);
            // 검색어 상태를 초기화 해줘야 등록완료 후 처음으로 돌아감
            setSearchCondition(null);
            // 1. 페이지 1로 이동 ( 이미 1페이지면 state 변경이 안됨)
            setPaginationInfo(prev => ({ ...prev, currentPage: 1 }));
            // 2. 다시 서버로 재요청 (명시적으로 fetch 호출이 안전)
            await fetchBookList();
            return true;// 컴포넌트에게 성공 보고 , true, false 로 성공여부를 알려주면 이후 과정확장 시 조건 여부로 사용가능

        } catch (err) {
            openModal({
                modalType: "error",
                content:<>
                    <p>{err?.response?.data || "서버 요청 중 오류가 발생했습니다. 다시 시도해주세요."}</p>
                </>,
                onConfirm:()=>{closeModal()}
            });
            return false; // 컴포넌트에게 실패 보고
        }
    }

    //수정 조회 fetch 함수
    const fetchModify = async (bookId) => {

        try{
            const response =
                await axios.get(`/api/admin/book/bookModify/${bookId}`);
            const bookData = response.data;
            const {book,cateData} = bookData; // 객체형으로 구조분해할당하기
            setCurrentBook(book); // 현재 도서 데이터 초기값 갱신
            setCategoryList(cateData); // 수정 페이지 카테고리 초기값 갱신

        }catch(err){
            //error
            openModal({
                modalType:"error",
                content:<><p>`${err.response?.data?.message}`</p></>,
                onConfirm:()=>{closeModal()}
            });
        }
    }

    // modify 도서 수정 함수
    const modifyBook = async (modifyBookData,bookImg) => {
        //formData 객체 생성
        const formData = new FormData();
        //수정된 데이터값 formdata에 담아주기
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

        // formData key,value 객체 배열로 변환
        const entries = Array.from(formData.entries());

        const optionalKeys = ["bookImgPath","viewCnt","wishID"];

        for (const [key, value] of entries) {

            // bookImgPath는 비어 있어도 통과
            if (optionalKeys.includes(key)) continue;

            if (!value || typeof value === "string" && value.trim() === "") { // null, undefined 등 비어있는 값 & 비어있는 문자열
                const errorField = korname[key] || key;
                openModal({
                    modalType: "error",
                    content: <p>{errorField} 값을 채워주세요.</p>,
                    onConfirm: () => closeModal()
                });
                return false; // 검증 실패 시 중단 , true, false 로 성공여부를 알려주면 이후 과정확장 시 조건 여부로 사용가능
            }
            //if end
        }
        //for end

        //서버로 수정 데이터 담아서 보내기
        try{
            const response = await axios.post(`/api/admin/book/bookModify/${modifyBookData.bookId}`,
                formData);

            // onUpdate를 통해 도서목록 갱신
            onUpdate(response.data);
            // 2. 성공 알림
            openModal({
                modalType: "default",
                content: <p>도서 정보가 수정되었습니다.</p>,
                onConfirm: () => closeModal()
            });
            return true;
        }catch(err){
            openModal({
                modalType: "error",
                content:<>
                    <p>서버 요청 중 오류가 발생했습니다. 다시 시도해주세요.</p>
                    <p>`에러 : ${err}`</p>
                </>,
                onConfirm:()=>{closeModal()}
            });
            return false;
        }
    }


    // 컴포넌트에서 useAdminBookMangement 훅을 사용해 가져다 쓸 객체들 반환
    return {
        bookdata,
        search,
        setSearch,
        searchCondition,
        setSearchCondition,
        paginationInfo,
        setPaginationInfo,

        onInit,
        onCreate,
        onDelete,
        onUpdate,
        openModal, // adminbookContext를 통해서 사용하려면 다시 담아서 반환해야함 ,장점 : 각 컴포넌트를 찾아가 선언할 필요 없음
        closeModal,
        navigate,

        currentBook, //공통으로 사용할 도서 초기값
        setCurrentBook, //공통으로 사용할 도서 초기값 변경할 때 사용할 함수
        categoryList, // 등록, 수정 카테고리 목록
        setCategoryList,
        fetchBookList, // 도서 목록 조회
        registerBook, //도서 등록
        fetchModify, // 도서 수정 조회
        modifyBook, // 도서 수정
    }
}