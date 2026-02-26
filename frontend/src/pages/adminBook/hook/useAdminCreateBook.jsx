//훅은 변수명 첫글자 대문자 x

import React, {useState} from "react";
import axios from "axios";
import {formatToDate, getToday} from "../../../util/date/dateUtils.jsx";
import {useModal} from "../../common/modal/ModalContext.jsx";



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

// reducer 함수 onCreate 필요, 초기값 설정 함수 필요

export const useAdminCreateBook = () => {


    //훅 외부에 초기값 함수 선언 , 내부에 선언하면 프로바이더가 렌더링 될때마다 계속 함수 생성
    const initialBook  ={
        bookName: '',
        bookCateNm: [],
        bookCateDepth: [],
        bookDesc: '',
        author: '',
        bookPrice: '0',
        stock: '0',
        stockStatus: '재고없음',
        publishDate: '',
        roleId: '',
        cateId: [],
        bookImg: [],
        writer: '',
        createDate: formatToDate(new Date()), // 매번 실행할 때마다 '지금' 날짜 생성
        recomType: 'NORMAL',
        saleStatus: '판매중'
    };

    //도서등록 데이터
    const [currentBook, setCurrentBook] = useState(initialBook);
    const { openModal, closeModal } = useModal();

    //도서 이미지파일목록
    const [bookImg, setBookImg] = useState({
        existing: [], // 서버에서 불러온 기존 파일
        new: [],      // 새로 업로드한 파일
        removed: []   // 삭제한 기존 파일
    });

    // 카테고리
    const [categoryList, setCategoryList] = useState([]);

    //카테고리 리스트 get 요청
    const getCategories = async () => {

        try{
            const response = await axios.get("/api/admin/book/bookCreate")
            setCategoryList(response.data); // 서버에서 요청한 카테고리 데이터로 목록 갱신
        }catch(err){
            openModal({
                modalType: "error",
                content: <p>카테고리 목록을 불러오는데 실패했습니다.</p>,
                onConfirm: () => closeModal()
            });
        }

    }

    // create 도서 등록 함수
    const fetchCreateBook = async (currentBook, bookImg) => {
        // formData 생성
        const formData = new FormData();

        Object.entries(currentBook).forEach(([key, value]) => {

            if(key === "bookImg") return;

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
                // 등록일 생성
                const today = getToday();
                formData.append("createDate", today);
            }
            else {
                // 일반 문자열 처리
                formData.append(key, value ?? ""); //value가 null 이면 "" 처리
            }
        });

        //bookimg 처리( bookimg 객체를 formData에 담아줘야 함) ==> new라는 예약어떄문에 new를 newFiles로 명명하겠다
        const { new: newFiles} = bookImg;

        //새로 업로드한 파일이 있다면 , 배열로 변환하고 새 파일의 개수가 1개 이상이면
        if (Array.isArray(newFiles) && newFiles.length > 0) {
            newFiles.forEach((file) => { // 새 파일을 순회하여 formData에 bookImg  데이터를 담아주기
                console.log("newFile -- formData에 파일 담아주기",file);
                formData.append("bookImg", file);
            });
        }


        // 유효성 검사
        const entries = Array.from(formData.entries());

        for (const [key, value] of entries) {

            //bookImgPath는 비어 있어도 통과
            if (key === "bookImgPath") continue;

            if (!value || typeof value === "string" && value.trim() === "") { // null, undefined 등 비어있는 값 & 비어있는 문자열
                const errorField = korname[key] || key;
                // openModal({
                //     modalType: "error",
                //     content: <p>{errorField} 값을 채워주세요.</p>,
                //     onConfirm: () => closeModal()
                // });
                 return { success: false, message: `${errorField} 값을 채워주세요.` }; // 검증 실패 시 중단 , true, false 로 성공여부를 알려주면 이후 과정확장 시 조건 여부로 사용가능
            }
        }


        // 서버로 axios.post 비동기 요청
        try {
            const response = await axios.post("/api/admin/book/bookCreate",formData)
            // 컴포넌트에게 성공 보고 , true, false 로 성공여부를 알려주면 이후 과정확장 시 조건 여부로 사용가능
            return { // 객체로 반환 ( 서버에서 받아 온 데이터 사용 용이 )
                success: true,
                data: response?.data,
                message: "도서등록 완료."
            };

        } catch (err) {

            return {// 컴포넌트에게 실패 보고
                success: false,
                message:err?.response?.data || "서버 요청 중 오류가 발생했습니다. 다시 시도해주세요."
            };
        }
    }


    return{
         currentBook,
        setCurrentBook,
        categoryList,
        setCategoryList,
        bookImg,
       setBookImg,
        getCategories,
        fetchCreateBook,
    }
//hook end
}