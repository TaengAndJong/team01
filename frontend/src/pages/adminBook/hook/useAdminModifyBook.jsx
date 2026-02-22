import React, {useState} from "react";
import axios from "axios";
import {getToday} from "../../../util/date/dateUtils.jsx";


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

export const useAdminModifyBook = (openModal, closeModal, navigate,onUpdate)=> {

    //서버에서 받아온 값으로 초기값 설정 필요 ==> 빈객체 대체
    const [currentBook, setCurrentBook] = useState({}); // 초기 상태 설정 함수 담아주기

    //도서 이미지파일
    const [bookImg, setBookImg] = useState({
        existing: [], // 서버에서 불러온 기존 파일
        new: [],      // 새로 업로드한 파일
        removed: []   // 삭제한 기존 파일
    });

    //서버에서 받아온 값으로 초기값 설정 필요 ==> 빈 배열 대체
    const [categoryList, setCategoryList] = useState([]);

    //수정 조회 fetch 함수
    const getModifyBook = async (bookId,userData) => {
        console.log("fetchModify --bookId",bookId);
        console.log("fetchModify --userData",userData);

        try{
            const response =
                await axios.get(`/api/admin/book/bookModify/${bookId}`);

            const {book,cateData} = response.data; // 객체형으로 구조분해할당하기
            // 현재 도서 데이터 초기값 갱신
            setCurrentBook({
                ...book, // 서버에서 온 데이터
                roleId: userData?.roleId, // 유저 정보
                writer: userData?.clientName // 유저 이름
            });
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
    const fetchModifyBook = async (bookData,bookImg) => {
        //formData 객체 생성
        const formData = new FormData();
        //수정된 데이터값 formdata에 담아주기
        Object.entries(bookData).forEach(([key, value]) => {

            console.log(`modifyBook ------ key : ${key}, value ${value}`);
            if (key === "bookImg") return; // bookImg 건너뛰기

            if (["bookCateDepth", "bookCateNm", "cateId"].includes(key) && Array.isArray(value)) {
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
                bookData["createDate"]= getToday(); //서버로 전송할 데이터객체형태로 변경
                formData.append("createDate",  bookData["createDate"]);
            }
            else {
                // 일반 문자열 처리
                formData.append(key, value ?? ""); //value가 null 이면 "" 처리
            }
        });

        //이미지 삭제 관리는 엔트리 순회할 때, bookImg 순서가 오지않으면 로직이 실행이 안될 수 있기때문에 분리해서 처리하기
        const { new: newFiles, existing, removed } = bookImg;

        //새로 업로드한 파일이   있다면
        if (Array.isArray(newFiles) && newFiles.length > 0) {
            newFiles.forEach((file) => {
                formData.append("bookImg", file);
            });
        }
        //삭제할 기존 파일이 있다면 추가
        if (Array.isArray(removed) && removed.length > 0) {
            removed.forEach((file) => {
                formData.append("removedBookImg", file.name); // 또는 file이 string이면 그대로
            });
        }
        console.log(`new ${newFiles} existing ${existing}, removed ${removed}`);
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
            const response = await axios.post(`/api/admin/book/bookModify/${bookData.bookId}`,
                formData);

            // onUpdate를 통해 도서목록 갱신
            onUpdate(response.data);
            // 2. 성공 알림
            openModal({
                modalType: "default",
                content: <p>도서 정보가 수정되었습니다.</p>,
                onConfirm: () => {closeModal();

                    //  폼과 이미지객체 초기화
                    resetInitial();
                    navigate(`/admin/book/bookModify/${bookData.bookId}`);
                }

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

    return{
        modifybook : currentBook, // 수정도서일 경우, curruntBook은 modifyBook으로 지칭 함
        setCurrentBook,
        categoryList,
        setCategoryList,
        bookImg,
        setBookImg,
        getModifyBook,
        fetchModifyBook,
    }

}

