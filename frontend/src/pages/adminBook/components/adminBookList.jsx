//전체선택, 개별선택 삭제, 장바구니버튼, 바로구매버튼, 찜목록 버튼 , 리뷰

import React, { useContext, useEffect, useState } from "react";
import Btn from "@util/reuseBtn.jsx";
import pathsData from "@assets/pathsData.jsx";
import {
  BookDispatchContext,
  BookStateContext,
  PaginationContext,
} from "../adminBookComponent.jsx";
import { Link } from "react-router-dom";

import { formatToDate } from "@util/dateUtils.jsx";
import SearchBar from "@pages/adminBook/components/searchBar.jsx";
import Pagination from "@util/pagination.jsx";
import {useModal} from "../../common/modal/ModalContext.jsx";
import axios from "axios";

const AdminBookList = () => {
  const bookdata = useContext(BookStateContext);
  const {
    paginationInfo,
    setPaginationInfo,
    onChangePageHandler,
    search,
    setSearch,
    handleSearch
  } = useContext(PaginationContext);

  const { onDelete,onInit } = useContext(BookDispatchContext); // 사용할 함수 가져올때 전역설정이면 context 훅 불러와야함
  const [bookList, setBookList] = useState([]);

// bookdata가 존재할 때만 bookList 업데이트
  useEffect(() => {
    //1.부모에서 받아온 데이터를 상태관리 함수에 갱신해줌
    if(bookdata){
      setBookList(bookdata);
    }

    console.log("1bookList--------",bookList);
    console.log("1bookdata--------",bookdata);
  },[bookdata])
   console.log("2bookdata--------",bookdata);
  console.log("2bookList--------",bookList);

  //전체선택
  const [selectAll, setSelectAll] = useState(false); // 전체 선택 여부
  //체크박스 상태관리(단일선택, 다중선택 초기값은 배열로)
  const [checkedInput, setCheckedInput] = useState([]);
  const {openModal,closeModal} = useModal();


  const handleSelectAll = (isChecked) => {
    setSelectAll(isChecked);
    if (isChecked) {
      //console.log("selectAll", isChecked);
      // 모든 bookId를 배열에 추가
      const allIds = bookList.map((item) => item.bookId);
      setCheckedInput(allIds);
    } else {
      // 전부 해제
      setCheckedInput([]);
    }
  };

  const onChangeCheck = (bookId, isChecked) => {
    if (isChecked) {
      setCheckedInput((prev) => [...prev, bookId]);
    } else {
      setCheckedInput((prev) => prev.filter((id) => id !== bookId));
    }
  };

  //삭제핸들러
  const onDeleteHandler = async(deleteItems)=>{

      try{

        const response = 
            await axios.post(`/api/admin/book/bookDelete`
                ,deleteItems, // 자동직렬화가 되기때문에 Json.stringify(직렬화대상객체); 미사용
                { withCredentials: true,
                        params: { currentPage: paginationInfo.currentPage, pageSize: paginationInfo.pageSize }
                }); // 인증 세션 또는 쿠키 사용시 필요함
            //conetent-Type : application/json도 자동처리로 미사용

           // console.log("도서 삭제 목록 응답 데이터",response.data);
          const data = response.data;
            onDelete(data.items);// 삭제이후에 새로 변경된 bookData 로 상태갱신
            console.log("삭제 응답 :response", data);
            //페이지네이션 갱신
            if (data.items.length === 0 && paginationInfo.currentPage > 1) {
              const newPage = paginationInfo.currentPage - 1;
              setPaginationInfo((prev) => ({ ...prev, currentPage: newPage }));
              onChangePageHandler(newPage); // 👉 새 페이지로 데이터 재요청
            } else {
              onChangePageHandler(paginationInfo.currentPage); // 👉 현재 페이지 다시 불러오기
            }

        //삭제확인 알림
            openModal({
              modalType:"default",
              content: <><p>{`${response.data.message}`}</p></>,
              onConfirm:()=>{ closeModal()}
            });

            // 삭제할 배열 초기화 ==> 초기화안하면 이전에 삭제한 아이디값이 남아있게됨
            setCheckedInput([]);


      }catch(err){
        // fetch는 네트워크에러만 감지, axios는 http오류(400,500)e도 감지
       // console.error("요청 실패", err);
        openModal({
          modalType:"error",
          content: <><p>{`상태메시지 : ${err.statusText} (상태코드: ${err.status}), `}</p></>
        });

      }
      //공통로직
  }



  const recomTypeMap = {
    NORMAL: { recomType: "normal", label: "일반" },
    RECOMMEND: { recomType: "recom", label: "추천" },
    POPULAR: { recomType: "popular", label: "인기" },
  };

  const recomTultip = (status) => {
    // console.log(
    //     `status : ${status} , recomtype : ${recomTypeMap[status]?.recomType},label: ${recomTypeMap[status]?.label}`
    // );

    return (
        <span className={`tultip ${recomTypeMap[status]?.recomType} mb-3`}>
        {recomTypeMap[status]?.label}
      </span>
    );
  };




  return (
      <>
        <SearchBar search={search} setSearch={setSearch}  handleSearch={handleSearch}/>
        <div className="table-responsive">
          <table className="table table-custom mt-4">
            <caption className="sr-only">등록된 도서상품 테이블</caption>
            <thead>
            <tr>
              <th scope="col" className="text-center">
                <input
                    type="checkbox"
                    id="selectAll"
                    checked={
                        checkedInput.length === bookList.length && bookList.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                />
                <label htmlFor="selectAll" className="sr-only">
                  전체 선택
                </label>
              </th>
              <th scope="col" className="text-center">
                No.
              </th>
              <th scope="col" className="text-center">
                이미지
              </th>
              <th scope="col" className="text-center">
                카테고리
              </th>
              <th scope="col" className="text-center">
                도서명
              </th>
              {/*<th className="text-center">설명</th>*/}
              <th scope="col" className="text-center">
                저자
              </th>
              <th scope="col" className="text-center">
                가격
              </th>
              <th scope="col" className="text-center">
                발행일
              </th>
              <th scope="col" className="text-center">
                등록자
              </th>
              <th scope="col" className="text-center">
                등록일
              </th>
              <th scope="col" className="text-center">
                재고
              </th>
              <th scope="col" className="text-center">
                판매상태
              </th>
            </tr>
            </thead>

            <tbody className="">
            {/* undefined 와 데이터의 개수 검증*/}
            {!bookList || bookList?.length === 0 ? (
                <tr className="">
                  <td colSpan="12" className="text-center">
                    데이터가 없습니다.
                  </td>
                </tr>
            ) : (
                bookList?.map((item, index) => (
                    <tr key={index} className="table-light border-bottom">
                      <td className="text-center">
                        <input
                            type="checkbox"
                            id={`item${index}`}
                            name={`item${index}`}
                            checked={checkedInput.includes(item.bookId)} // 상태 기반 체크 여부 결정
                            onChange={(e) =>
                                onChangeCheck(`${item.bookId}`, e.target.checked)
                            }
                        />
                        <label
                            htmlFor={`item${index}`}
                            className="sr-only"
                        >{`${item.bookName}`}</label>
                      </td>
                      <td className="text-center " id={`bookId${index}`}>
                        {item.bookId}
                      </td>

                      <td className="text-center" id={`bookImg${index}`}>
                        <div className="imgbox">
                          <img
                              src={`${item.bookImgList[0]}`}
                              alt={`${item.bookName}도서 이미지`}
                          />
                        </div>
                      </td>

                      <td className="text-left" id={`bookCateNm${index}`}>
                        {item.bookCateNm}
                      </td>
                      <td className="text-left" id={`bookNm${index}`}>
                        <Link
                            to={`/admin/book/bookDetail/${item.bookId}`}
                            title={`${item.bookName} 상세페이지로 이동`}
                        >
                          {recomTultip(item.recomType)}
                          <p className="book-title"><span>{item.bookName}</span></p>
                        </Link>
                      </td>
                      {/*<td className="text-left" id={`bookDesc${index}`}>{item.bookDesc}</td>*/}
                      <td className="text-center" id={`bookAuthor${index}`}>
                        {item.author}
                      </td>
                      <td className="text-center" id={`bookPrice${index}`}>
                        {item.bookPrice}원
                      </td>
                      <td className="text-center" id={`bookPublishDt${index}`}>
                        {item.publishDate}
                      </td>
                      <td className="text-center" id={`bookWriter${index}`}>
                        {item.writer}
                      </td>
                      <td className="text-center" id={`bookPublishDt${index}`}>
                        {formatToDate(new Date(item.createDate))}
                      </td>
                      <td className="text-center" id={`bookStock${index}`}>
                        {item.stock}
                      </td>
                      <td className="text-center" id={`saleStatus${index}`}>
                        {item.saleStatus}
                      </td>
                    </tr>
                ))
            )}
            </tbody>
          </table>
        </div>
        {/*pagination*/}
        <Pagination
            paginationInfo={paginationInfo}
            onChangePageHandler={onChangePageHandler}
        />

        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <Btn
              className={"delete btn btn-danger"}
              id={"deleteBtn"}
              type={"button"}
              onClick={() => onDeleteHandler(checkedInput)}
              text="삭제"
          />
          <Btn
              className={"create btn custom-btn02"}
              id={"createBtn"}
              type={"button"}
              path={pathsData.page.adminBookCreate}
              text="등록"
          />
        </div>

      </>
  );
};



export default AdminBookList;