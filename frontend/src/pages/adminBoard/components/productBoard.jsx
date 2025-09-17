import "@assets/css/board/adminBoard.css";
import React, { useContext, useMemo, useState } from "react";
import AdminBoardItem from "@pages/adminBoard/components/adminBoardItem.jsx";
import SearchBar from "@pages/adminBoard/components/qnaAdminBoardSearchBar.jsx";
import {
  BookBoardStateContext,
  BookBoardDispatchContext,
} from "@pages/adminBoard/adminBoardComponent.jsx";
import { PaginationContext } from "@pages/adminBoard/adminBoardComponent.jsx";
import Pagination from "@util/pagination.jsx";

const ProductBoard = () => {
  // const [boardList, setBoarList] = useState([]);
  const { product } = useContext(BookBoardStateContext);
  const { onInitProduct } = useContext(BookBoardDispatchContext);
  const { paginationInfo, onChangePageHandler } = useContext(PaginationContext);

  const boardList = useMemo(() => {
    if (!product || !Array.isArray(product) || product.length === 0) {
      return [];
    }

    const firstItem = product[0];
    if (
      !firstItem ||
      !firstItem.items ||
      !Array.isArray(firstItem.items) ||
      firstItem.items.length === 0
    ) {
      return [];
    }

    return Array.isArray(firstItem.items) ? firstItem.items : [];
  }, [product]);

  // // product 데이터 존재할 때만 boardList 업데이트
  // useEffect(() => {
  //   const items = product?.[0]?.items;
  //   if (items) {
  //     setBoarList(items);
  //   }
  // }, [product]);

  // console.log("boardList", boardList);

  // SearchBar
  const [search, setSearch] = useState([]);
  console.log("search 상태관리 :", search);

  const handleSearch = async () => {
    //search 초기 데이터 URLsearchParam으로 가공
    console.log("=== 검색 디버깅 시작 ===");

    // 1. 검색 파라미터 확인
    console.log("원본 search 객체:", search);
    const param = new URLSearchParams(search);
    console.log("URLSearchParams 객체:", param);
    const paramString = param.toString();
    console.log("최종 파라미터 문자열:", paramString);

    // 2. 요청 URL 확인
    const requestUrl = `/api/admin/board/qnaProductList?${paramString}`;
    console.log("요청 URL:", requestUrl);

    //검색버튼 누르면 서버로 검색 필터 전송
    try {
      const response = await fetch(requestUrl, {
        method: "POST",
      });

      console.log("응답 상태:", response.status);
      console.log("응답 OK:", response.ok);

      // 요청 성공실패
      if (!response.ok) {
        console.log("통신에러", response.status);
        throw Error(response.statusText);
      }

      const data = await response.json();
      console.log("응답 데이터:", data);
      console.log("데이터 타입:", typeof data);
      console.log(
        "데이터 길이:",
        Array.isArray(data) ? data.length : "배열이 아님"
      );

      onInitProduct(data);
    } catch (e) {
      console.log("에러 발생:", e);
      console.log("에러 메시지:", e.message);
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
