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
const OneBoard = () => {
  const [boardList, setBoarList] = useState([]);

  const { one } = useContext(BookBoardStateContext);
  const { onInitOne } = useContext(BookBoardDispatchContext);
  console.log("BookBoardStateContext---one data", one);
  const { paginationInfo, onChangePageHandler } = useContext(PaginationContext);
  const { onDeleteOne } = useContext(BookBoardDispatchContext);
  // one 데이터 존재할 때만 boardList 업데이트
  useEffect(() => {
    const items = one?.[0]?.items;
    if (items) {
      setBoarList(items);
    }
  }, [one]);

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
      const allIds = boardList.map((item) => item.productId);
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
      const response = await fetch("/api/admin/board/qnaOneDelete", {
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
      onDeleteOne(deleteItems); // 삭제 상태관리
      setShow(false);
      console.log("bookData 삭제성공", bookdata);
    } catch (err) {
      console.error("요청 실패", err);
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

      // 요청 성공실패
      if (!response.ok) {
        console.log("통신에러", response.status);
        throw Error(response.statusText);
      }
      //요청 성공
      const data = await response.json();
      console.log("search---------------", data);
      setBoarList(Array.isArray(data) ? data : []); // 서버 데이터 갱신
      onInitOne(data);
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
                key={item.productId || index}
                data={item}
                number={
                  (paginationInfo.currentPage - 1) * paginationInfo.pageSize +
                  index +
                  1
                }
              />
            ))
          )}
        </tbody>
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
            onClick={null}
            text="삭제"
          />
        </div>
      </table>
    </>
  );
};

export default OneBoard;
