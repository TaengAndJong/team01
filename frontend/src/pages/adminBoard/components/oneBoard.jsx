import "@assets/css/board/adminBoard.css";
import React, { useContext, useEffect, useState, useMemo } from "react";
import AdminBoardItem from "@pages/adminBoard/components/adminBoardItem.jsx";
import SearchBar from "@pages/adminBoard/components/qnaAdminBoardSearchBar.jsx";
import {
  BookBoardStateContext,
  BookBoardDispatchContext,
} from "@pages/adminBoard/adminBoardComponent.jsx";
import { PaginationContext } from "@pages/adminBoard/adminBoardComponent.jsx";
import Pagination from "@util/pagination.jsx";
import Btn from "@util/reuseBtn.jsx";
import { useModal } from "@pages/common/modal/ModalContext.jsx";

const OneBoard = () => {
  const { one } = useContext(BookBoardStateContext);
  const { onInitOne, onDeleteOne } = useContext(BookBoardDispatchContext);
  const { paginationInfo, onChangePageHandler } = useContext(PaginationContext);

  const boardList = useMemo(() => {
    if (!one || !Array.isArray(one) || one.length === 0) {
      return [];
    }

    const firstItem = one[0];
    if (
      !firstItem ||
      !firstItem.items ||
      !Array.isArray(firstItem.items) ||
      firstItem.items.length === 0
    ) {
      return [];
    }

    return Array.isArray(firstItem.items) ? firstItem.items : [];
  }, [one]);

  // SearchBar
  const [search, setSearch] = useState([]);
  console.log("search 상태관리 :", search);

  const [checkedInput, setCheckedInput] = useState([]);

  //전체선택
  const [selectAll, setSelectAll] = useState(false); // 전체 선택 여부

  const handleSelectAll = (isChecked) => {
    setSelectAll(isChecked);
    if (isChecked) {
      console.log("selectAll", isChecked);
      // 모든 bookId를 배열에 추가
      const allIds = boardList.map((item) => item.qnaOneId);
      setCheckedInput(allIds);
      console.log("allIds-One", allIds);
    } else {
      // 전부 해제
      setCheckedInput([]);
    }
  };

  const onChangeCheck = (oneId, isChecked) => {
    if (isChecked) {
      const newArray = [...checkedInput, oneId];
      setCheckedInput(newArray);
      console.log("선택된 게시물 :", newArray);
    } else {
      const newArray = checkedInput.filter((id) => id !== oneId);
      setCheckedInput(newArray);
      console.log("해제된 게시물 :", newArray);
    }
  };

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
      //URLSearchParam 객체를 사용해서 url에 쿼리스트링으로 값을 담아 보내기때문에
      // Content-Type,body 사용할 필요 없음 (body는 클라이언트가 데이터를 서버로 보낼 때 필요)
      const response = await fetch(
        `/api/admin/board/qnaOneList?${paramString}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();
      console.log("응답 데이터:", data);
      console.log("데이터 타입:", typeof data);
      console.log(
        "데이터 길이:",
        Array.isArray(data) ? data.length : "배열이 아님"
      );

      onInitOne(data);
    } catch (e) {
      console.log("에러 발생:", e);
      console.log("에러 메시지:", e.message);
    }
  };

  const onDeleteHandler = async (deleteItems) => {
    if (deleteItems.length === 0) {
      alert("게시물을 선택해 주세요");
      return;
    }
    console.log("삭제 할 게시물 아이디", deleteItems);
    try {
      //"/detail/product/{boardId}"
      const response = await fetch(`/api/admin/board/detail/one`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deleteItems),
      });
      if (response.ok) {
        onDeleteOne(deleteItems);
      }
    } catch (e) {
      console.log("에러 발생:", e);
      console.log("에러 메시지:", e.message);
    }
  };

  // 모달 관련 커스텀 훅
  const { openModal, closeModal } = useModal();

  return (
    <>
      <SearchBar
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
      />
      {/* 테이블 */}

      <table className="table table-custom mt-4">
        <caption className="sr-only">등록된 1:1 문의 테이블</caption>
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
                key={item.qnaOneId || index}
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
          onClick={() =>
            openModal({
              modalType: "confirm",
              data: {
                message: "선택된 게시물을 삭제하시겠습니까?",
              },
              onConfirm: () => {
                onDeleteHandler(checkedInput), closeModal();
              },
              onClose: closeModal,
            })
          }
          text="삭제"
        />
      </div>
    </>
  );
};

export default OneBoard;
