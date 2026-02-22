
import React, { useContext, useEffect, useState } from "react";
import Btn from "@util/form/reuseBtn.jsx";
import pathsData from "@assets/pathsData.jsx";
import {
  BookStateContext,
  PaginationContext,
} from "../adminBookComponent.jsx";
import { Link } from "react-router-dom";

import { formatToDate } from "@util/date/dateUtils.jsx";
import SearchBar from "@pages/adminBook/components/searchBar.jsx";
import Pagination from "@util/pagination.jsx";
import {useModal} from "../../common/modal/ModalContext.jsx";
import ImgBaseUrl from "@/util/imgBaseUrl";
import "@assets/css/book/adminbookList.css";
import axios from "axios";
import {useAdminBook} from "../adminBookProvider.jsx";
import {useAdminListBook} from "../hook/useAdminListBook.jsx";

/*
* 컴포넌트는 화면 구성 담당, hook은 서버와 데이터처리
* */


const AdminBookList = () => {

  //검색어 입력중 상태관리로  서버 전송 전이기때문에 컴포넌트에서 관리
  const [search, setSearch] = useState({
    bookType: "ALL", // 전체 / 국내도서 / 국외도서
    searchType: "bookName", // bookName(도서명), author(저자)
    recomType: "ALL",
    stockType: "ALL",
    keyword: "", // 검색어
  });

  //pagination, 목록화면에서만 사용하니까 목록컴포넌트 내부에서 관리
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    totalPages: 0,
    totalRecord: 0,
    pageSize: 6,
  });
  const { searchCondition ,setSearchCondition} = useAdminBook();
  const { bookList,fetchDeleteBooks  } =
      useAdminListBook(paginationInfo,setPaginationInfo, searchCondition);


  //전체선택
  const [selectAll, setSelectAll] = useState(false); // 전체 선택 여부
  //체크박스 상태관리(단일선택, 다중선택 초기값은 배열로)
  const [checkedInput, setCheckedInput] = useState([]);
  const {openModal,closeModal} = useModal();

  const handleSearch = () => {
    // 검색 조건 확정
    setSearchCondition(search);
    //  페이지 1로 초기화
    setPaginationInfo(prev => ({
      ...prev,
      currentPage: 1
    }));

  }

  const onChangePageHandler = (page) => {
    setPaginationInfo(prev => ({
      ...prev,
      currentPage: page
    }));
  };

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

  const onDeleteHandler = async (deleteItems) => {
    const data = await fetchDeleteBooks(deleteItems); // return 한 값 data 변수에 저장
    //삭제확인 알림 ( UI 관리 )
    openModal({
      modalType: "default",
      content: <p>{data.message}</p>,
      onConfirm:  () => {
        closeModal();
        setCheckedInput([]);  // 삭제할 배열 초기화 ==> 초기화안하면 이전에 삭제한 아이디값이 남아있게됨
      }
    });
  };



  const recomTypeMap = {
    NORMAL: { recomType: "normal", label: "일반" },
    RECOMMEND: { recomType: "recom", label: "추천" },
    POPULAR: { recomType: "popular", label: "인기" },
  };

  const recomTultip = (status) => {

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
            <colgroup>
              <col style={{width: '4%'}}/>
              {/* 체크 */}
              <col style={{width: '4%'}}/>
              {/* No */}
              <col style={{width: '8%'}}/>
              {/* 이미지 */}
              <col style={{width: '8%'}}/>
              {/* 카테고리 */}
              <col style={{width: '20%'}}/>
              {/* 도서명 */}
              <col style={{width: '8%'}}/>
              {/* 저자 */}
              <col style={{width: '8%'}}/>
              {/* 가격 */}
              <col style={{width: '8%'}}/>
              {/* 발행일 */}
              <col style={{width: '6%'}}/>
              {/* 등록자 */}
              <col style={{width: '8%'}}/>
              {/* 등록일 */}
              <col style={{width: '4%'}}/>
              {/* 재고 */}
              <col style={{width: '6%'}}/>
              {/* 판매상태 */}
            </colgroup>
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
                                onChangeCheck(item.bookId, e.target.checked)
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
                        <div className="img-box">
                          <img
                              src={ImgBaseUrl(item.bookImgList[0])}
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