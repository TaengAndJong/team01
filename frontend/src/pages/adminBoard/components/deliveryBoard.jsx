import "@assets/css/board/adminBoard.css";
import React, { useContext, useEffect, useState } from "react";
import AdminBoardItem from "@pages/adminBoard/components/adminBoardItem.jsx";
import SearchBar from "@pages/adminBoard/components/qnaAdminBoardSearchBar.jsx";
import {
  BookBoardStateContext,
  BookBoardDispatchContext,
} from "@pages/adminBoard/adminBoardComponent.jsx";
import { PaginationContext } from "@pages/adminBoard/adminBoardComponent.jsx";
import Pagination from "@util/pagination.jsx";
import Btn from "@util/reuseBtn.jsx";
const DeliveryBoard = () => {
  const [boardList, setBoarList] = useState([]);

  const { delivery } = useContext(BookBoardStateContext);
  const { onInitDelivery } = useContext(BookBoardDispatchContext);
  console.log("BookBoardStateContext---delivery data", delivery);
  const { paginationInfo, onChangePageHandler } = useContext(PaginationContext);
  const { onDeleteDelivery } = useContext(BookBoardDispatchContext);
  // delivery 데이터 존재할 때만 boardList 업데이트
  useEffect(() => {
    const items = delivery?.[0]?.items;
    if (items) {
      setBoarList(items);
    }
  }, [delivery]);

  console.log("boardList", boardList);

  // SearchBar
  const [search, setSearch] = useState([]);
  console.log("search 상태관리 :", search);

  //전체선택
  const [selectAll, setSelectAll] = useState(false); // 전체 선택 여부
  //체크박스 상태관리(단일선택, 다중선택 초기값은 배열로)
  const [checkedInput, setCheckedInput] = useState([]);

  const handleSelectAll = (isChecked) => {
    setSelectAll(isChecked);
    if (isChecked) {
      console.log("selectAll", isChecked);
      // 모든 bookId를 배열에 추가
      const allIds = boardList.map((item) => item.qnaDelId);
      console.log("allIds-Del", allIds);
      setCheckedInput(allIds);
    } else {
      // 전부 해제
      setCheckedInput([]);
    }
  };

  const onChangeCheck = (delId, isChecked) => {
    if (isChecked) {
      setCheckedInput((prev) => [...prev, delId]);
    } else {
      setCheckedInput((prev) => prev.filter((id) => id !== delId));
    }
  };

  const handleSearch = async () => {
    //search 초기 데이터 URLsearchParam으로 가공
    console.log("search--fetch", search);
    const param = new URLSearchParams(search);
    console.log("search--param", param);
    const paramString = param.toString();
    console.log("search--paramString", paramString);

    //검색버튼 누르면 서버로 검색 필터 전송
    try {
      const response = await fetch(
        `/api/admin/board/qnaDeliveryList?${paramString}`,
        {
          method: "POST",
        }
      );

      // 요청 성공실패
      if (!response.ok) {
        console.log("통신에러", response.status);
        throw Error(response.statusText);
      }
      //요청 성공
      const data = await response.json();
      console.log("search---------------", data);
      setBoarList(Array.isArray(data) ? data : []); // 서버 데이터 갱신
      onInitDelivery(data);
    } catch (e) {
      console.log(e, "에러");
    }
  };

  return (
    <>
      <SearchBar
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
      />
      {/* 테이블 */}

      <table className="table table-custom mt-4">
        <caption className="sr-only">등록된 도서상품 테이블</caption>
        <thead>
          <tr>
            <th scope="col" className="text-center">
              <input
                type="checkbox"
                id="selectAll"
                checked={
                  checkedInput.length === boardList.length &&
                  boardList.length > 0
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
              제목
            </th>
            <th scope="col" className="text-center">
              작성자
            </th>
            <th scope="col" className="text-center">
              id
            </th>
            <th scope="col" className="text-center">
              답변여부
            </th>
            <th scope="col" className="text-center">
              등록일
            </th>
          </tr>
        </thead>
        <tbody className="">
          {/* undefined 와 데이터의 개수 검증*/}
          {boardList && boardList?.length === 0 ? (
            <tr className="">
              <td colSpan="12" className="text-center">
                데이터가 없습니다.
              </td>
            </tr>
          ) : (
            boardList.map((item, index) => (
              <AdminBoardItem
                key={item.productId || index}
                data={item}
                number={
                  (paginationInfo.currentPage - 1) * paginationInfo.pageSize +
                  index +
                  1
                }
                onChangeCheck={onChangeCheck}
                checkedInput={checkedInput}
              />
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
          onClick={() => onDeleteHandler(checkedInput)}
          text="삭제"
        />
      </div>
    </>
  );
};

export default DeliveryBoard;
