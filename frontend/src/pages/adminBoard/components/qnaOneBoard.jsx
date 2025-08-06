import "@assets/css/board/oneBoard.css";
import React, { useContext, useEffect, useState } from "react";
import QnaOneItem from "@pages/adminBoard/components/adminBoardItem.jsx";
import SearchBar from "@pages/adminBoard/components/adminBoardSearchBar.jsx";
import {
  BookBoardStateContext,
  BookBoardDispatchContext,
} from "@pages/adminBoard/adminBoardComponent.jsx";
import { PaginationContext } from "@pages/adminBoard/adminBoardComponent.jsx";
import Pagination from "@util/pagination.jsx";

const QnaOneBoard = () => {
  const [boardList, setBoarList] = useState([]);

  const { one } = useContext(BookBoardStateContext);
  const { onInitOne } = useContext(BookBoardDispatchContext);
  console.log("BookBoardStateContext---one data", one);
  const { paginationInfo, onChangePageHandler } = useContext(PaginationContext);

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
      <h3>1:1 문의 목록</h3>
      <div>
        <div>
          <ul className="oneBoardIndex">
            <li className="item">번호</li>
            <li className="item">제목</li>
            <li className="item">작성자</li>
            <li className="item">상태</li>
            <li className="item">등록일</li>
          </ul>
        </div>
        {console.log("boardList map 1:1 문의 돌리기 전", boardList)}
        <div className="oneBoardQuestionBox">
          {boardList.map((item, index) => (
            <QnaOneItem
              key={item.qnaOneId || index}
              data={item}
              number={
                (paginationInfo.currentPage - 1) * paginationInfo.pageSize +
                index +
                1
              }
            />
          ))}
        </div>
      </div>
      <SearchBar
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
      />
      <div>
        <button>삭제</button>
      </div>
      {/*pagination*/}
      <Pagination
        paginationInfo={paginationInfo}
        onChangePageHandler={onChangePageHandler}
      />
    </>
  );
};

export default QnaOneBoard;
