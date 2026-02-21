
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
import {getToday} from "../../util/date/dateUtils.jsx";

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


    const [bookdata, dispatch] = useReducer(reducer, null);
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


    // 컴포넌트에서 useAdminBookMangement 훅을 사용해 가져다 쓸 객체들 반환
    return {
        bookdata,
        search,
        setSearch,
        searchCondition,
        setSearchCondition,
        paginationInfo,
        setPaginationInfo,
        fetchBookList,
        onInit,
        onCreate,
        onDelete,
        onUpdate,
        openModal, // adminbookContext를 통해서 사용하려면 다시 담아서 반환해야함 ,장점 : 각 컴포넌트를 찾아가 선언할 필요 없음
        closeModal,
        navigate,
        registerBook
    }
}