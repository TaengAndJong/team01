
/* 도서 데이터 관리
*   Reducer, Fetch, Search 등  비즈니스 로직 Hook 분리
*   axios로 데이터를 가져오고, reducer로 상태 업데이터,
*   pagination 번호 계산, fetchBookList 등의 함수를 리턴
*
*   ** UI를 그리지 않는 순수한 로직일 경우  .js **
*
*  hook은 데이터를 처리하고 결과만 보고하는 역할
* */


import axios from "axios";
import {catchError} from "../../../util/error/error.jsx";
import {useEffect, useState} from "react";
import {useModal} from "../../common/modal/ModalContext.jsx";


//useState나 useReducer을 사용하면 use를 포함하여 이름 작성하기
export const useAdminListBook = (paginationInfo,
                                     setPaginationInfo,
                                     searchCondition) =>{

    const { openModal, closeModal, navigate } = useModal();

// 1. 훅 내부에서 도서 목록 상태 관리
    const [bookList, setBookList] = useState([]);


    //get요청(초기 조회 , 검색 시 조회, 페이지번호변경 시 사용하는 fetch요청 함수
    //도서 목록조회 요청
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
            setBookList(items);

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

    //삭제 요청
    const fetchDeleteBooks = async (deleteItems) => {
        try {
            const response = await axios.post(
                "/api/admin/book/bookDelete",
                deleteItems,
                { withCredentials: true }
            );

            const data = response.data;

            setPaginationInfo({
                currentPage: data.currentPage,
                pageSize: data.pageSize,
                totalPages: data.totalPages,
                totalRecord: data.totalRecord,
            });
            //삭제 후 재조회
            await fetchBookList();
            return data; // 컴포넌트에 결과값 전달

        } catch (err) {
            catchError(err, { openModal, closeModal, navigate });
            throw err;
        }
    };


    useEffect(()=>{
        console.log("페이지변경, 검색상태 변경 시 도서 목록 재조회")
        fetchBookList();
    },[paginationInfo.currentPage, searchCondition])// 페이지 번호가 변경될 때마다 다시 호출


    // 컴포넌트에서 useAdminBookMangement 훅을 사용해 가져다 쓸 객체들 반환
    return {
        bookList,
        fetchBookList,
        fetchDeleteBooks
    }
}