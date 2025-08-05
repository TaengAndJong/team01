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

const DeliveryBoard = () => {
  const [boardList, setBoarList] = useState([]);

  const { delivery } = useContext(BookBoardStateContext);
  const { onInitDelivery } = useContext(BookBoardDispatchContext);
  console.log("BookBoardStateContext---delivery data", delivery);
  const { paginationInfo, onChangePageHandler } = useContext(PaginationContext);

  // delivery 데이터 존재할 때만 boardList 업데이트
  useEffect(() => {
    if (delivery && delivery.length > 0) {
      console.log("delivery data--------useEffect", delivery);
      setBoarList(delivery);
    }
  }, [delivery]);

  console.log("boardList", boardList);

  // SearchBar
  const [search, setSearch] = useState([]);
  console.log("search 상태관리 :", search);

  const handleSearch = async () => {
    //search 초기 데이터 URLsearchParam으로 가공
    console.log("search--fetch", search);
    const param = new URLSearchParams(search);
    console.log("search--param", param);
    const paramString = param.toString();
    console.log("search--paramString", paramString);

    //검색버튼 누르면 서버로 검색 필터 전송
    try {
      const response = await fetch(`/api/board/DelivBoardlist?${paramString}`, {
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
      setBoarList(Array.isArray(data) ? data : []); // 서버 데이터 갱신
      onInitDelivery(data);
    } catch (e) {
      console.log(e, "에러");
    }
  };

  return (
    <>
      <h3>배송문의 목록</h3>
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
        {console.log("boardList map 돌리기 전", boardList)}
        <div className="oneBoardQuestionBox">
          {boardList.map((item, index) => (
            <QnaOneItem key={item.deliveryId || index} data={item} />
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

export default DeliveryBoard;
