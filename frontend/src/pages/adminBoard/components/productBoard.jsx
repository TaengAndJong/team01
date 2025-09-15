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

const ProductBoard = () => {
  const [boardList, setBoarList] = useState([]);
  const { product } = useContext(BookBoardStateContext);
  const { onInitProduct } = useContext(BookBoardDispatchContext);
  const { paginationInfo, onChangePageHandler } = useContext(PaginationContext);

  // product 데이터 존재할 때만 boardList 업데이트
  useEffect(() => {
    const items = product?.[0]?.items;
    if (items) {
      setBoarList(items);
    }
  }, [product]);

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
      const response = await fetch(
        `/api/admin/board/qnaProductList?${paramString}`,
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
      onInitProduct(data);
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
        {console.log("boardList map 상품 문의 돌리기 전", boardList)}
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
      </table>
      {/* 테이블 */}
    </>
  );
};

export default ProductBoard;
