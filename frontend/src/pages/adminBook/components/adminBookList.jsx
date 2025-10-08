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
import ReusableModal from "./modal.jsx";
import { formatToDate } from "@util/dateUtils.jsx";
import SearchBar from "@pages/adminBook/components/searchBar.jsx";
import Pagination from "@util/pagination.jsx";

const AdminBookList = () => {
  const bookdata = useContext(BookStateContext);
  const { paginationInfo, onChangePageHandler } = useContext(PaginationContext);
  const { onDelete, onInit } = useContext(BookDispatchContext); // 사용할 함수 가져올때 전역설정이면 context 훅 불러와야함
  const [bookList, setBookList] = useState([]);

  // bookdata가 존재할 때만 bookList 업데이트
  useEffect(() => {
    //1.부모에서 받아온 데이터를 상태관리 함수에 갱신해줌
    if (bookdata) {
      console.log("bookdata--------useEffect", bookdata);
      setBookList(bookdata);
    }
  }, [bookdata]);
  console.log("bookList--------", bookList);

  //전체선택
  const [selectAll, setSelectAll] = useState(false); // 전체 선택 여부
  //체크박스 상태관리(단일선택, 다중선택 초기값은 배열로)
  const [checkedInput, setCheckedInput] = useState([]);
  //모달 상태관리
  const [show, setShow] = useState(false);
  const handleClose = () => {
    console.log("close modal");
    setShow(false);
  };
  const handleShow = () => {
    console.log("handleShow");
    setShow(true);
  };

  const [modalType, setModalType] = useState("confirm");
  const [errorData, setErrorData] = useState({});

  const handleSelectAll = (isChecked) => {
    setSelectAll(isChecked);
    if (isChecked) {
      console.log("selectAll", isChecked);
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
    //fetch 요청 보내기
    try {
      const response = await fetch("/api/admin/book/bookDelete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deleteItems),
        // body에 담길 내용이 간단한 배열일 경우엔 객체나 배열을 문자열로 변환하여 서버에 요청을 보냄
        // 파일, 이미지 , blob등과 같은 바이너리 데이터가 있을경우 또는  enctype(encoding type) 이 존재할경우 에만 formData 형태로 변환해 보내야함
        // form-data랑 x-www-form-urlencoded
      });

      if (!response.ok) {
        //삭제하려는 도서가 없을 경우
        console.log(response.statusText, response.status);
        const errorResponse = await response.json();
        console.log("errorResponse", errorResponse);
      }
      // 삭제성공후 데이터가 한번 갱신되어야 함 (삭제된 아이템들을 제외하고 )
      console.log("deleteItems 배열?", Array.isArray(deleteItems));
      onDelete(deleteItems); // 삭제 상태관리
      setShow(false);
      console.log("bookData 삭제성공", bookdata);
    } catch (err) {
      console.error("요청 실패", err);
    }
  };

  //검색어 필터 상태관리 ==> 초기값 빈 배열!
  const [search, setSearch] = useState({
    bookType: "ALL", // 전체 / 국내도서 / 국외도서
    searchType: "bookName", // bookName(도서명), author(저자)
    keyword: "", // 검색어
  });
  console.log("search 상태관리", search);

  const handleSearch = async () => {
    //search 초기 데이터 URLsearchParam으로 가공
    console.log("search--fetch", search);
    const param = new URLSearchParams(search);
    console.log("search--param", param);
    //URLSearchParam {size: 3}
    const paramString = param.toString();
    console.log("search--paramString", paramString);
    //type=DOMESTIC&keyword=%ED%8C%A8%ED%8B%B0&field=category

    //검색버튼 누르면 서버로 검색 필터 전송
    try {
      //URLSearchParam 객체르 사용해서 url에 쿼리스트링으로 값을 담아 보내기때문에
      // Content-Type,body 사용할 필요 없음 (body는 클라이언트가 데이터를 서버로 보낼 때 필요)
      const response = await fetch(`/api/admin/book/bookList?${paramString}`, {
        method: "POST",
      });

      // 요청 성공실패
      if (!response.ok) {
        console.log("통신에러", response.status);
        throw Error(response.statusText);
      }
      //요청 성공
      const data = await response.json();
      console.log("search---------------", data);
      //setbookData에 데이터 갱신 처리 해주어함?
      onInit(data);
    } catch (e) {
      console.log("검색실패", e);
    }
  };

  const recomTypeMap = {
    NORMAL: { recomType: "normal", label: "일반" },
    RECOMMEND: { recomType: "recom", label: "추천" },
    POPULAR: { recomType: "popular", label: "인기" },
  };

  const recomTultip = (status) => {
    console.log(
      `status : ${status} , recomtype : ${recomTypeMap[status]?.recomType},label: ${recomTypeMap[status]?.label}`
    );

    return (
      <span className={`tultip ${recomTypeMap[status]?.recomType}`}>
        {recomTypeMap[status]?.label}
      </span>
    );
  };

  return (
    <>
      <SearchBar
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
      />

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
                    <p>{item.bookName}</p>
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
              </tr>
            ))
          )}
        </tbody>
      </table>
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
          onClick={() => handleShow()}
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
      {/*checkedInput만 하면 빈 배열이라도 true로 판정해서 모달이 열리기때문에 요소의 개수로 판단*/}
      {show && checkedInput.length === 0 && (
        <ReusableModal
          show={show}
          onClose={handleClose}
          modalType="noSelection"
        />
      )}

      {show && checkedInput.length > 0 && (
        <ReusableModal
          show={show}
          onClose={handleClose}
          onConfirm={() => onDeleteHandler(checkedInput)}
          modalType="delete"
        />
      )}
    </>
  );
};

export default AdminBookList;
