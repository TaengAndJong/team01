import "@assets/css/board/adminBoard.css";
import React, { useContext, useEffect, useState } from "react";
import AdminBoardItem from "@pages/adminBoard/components/adminBoardItem.jsx";
import SearchBar from "@pages/adminBoard/components/qnaAdminBoardSearchBar.jsx";
import { BookBoardStateContext } from "@pages/adminBoard/adminBoardComponent.jsx";
import Pagination from "@util/pagination.jsx";
import Btn from "@util/reuseBtn.jsx";
import { useModal } from "@pages/common/modal/ModalContext.jsx";

const ProductBoard = () => {
  const { product } = useContext(BookBoardStateContext);
  // const { onDeleteProduct, initFetch } = useContext(BookBoardDispatchContext);

  const [boardList, setBoardList] = useState(null); // 확인 하는 방법
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalRecord: 0,
    pageSize: 5,
  });

  const getProductBoard = async (page = 1, pageSize = 5) => {
    setIsLoading(true);
    setIsError(false);

    const response = await fetch(
      `/api/admin/board/qnaProductList?currentPage=${page}&pageSize=${pageSize}`
    );

    if (response.ok) {
      setIsSearchRequest(false);
      console.log("성공");
      const data = await response.json();
      setBoardList(data.items);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalRecord: data.totalRecord,
        pageSize: data.pageSize,
      });
    } else {
      console.log("실패");
      setIsError(true);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    console.log("getProductBoard 실행됨 ---------------------");
    getProductBoard();

    // console.log("콘텍스트에서 가져온 product", product);
    if (!product || !Array.isArray(product) || product.length === 0) {
      setBoardList([]);
      return;
    }

    const allItems = product.flatMap((item) =>
      Array.isArray(item.items) ? item.items : []
    );
    setBoardList(allItems);
  }, []); // product가 바뀔 때마다 실행

  //전체선택
  const [selectAll, setSelectAll] = useState(false); // 전체 선택 여부
  //체크박스 상태관리(단일선택, 다중선택 초기값은 배열로)
  const [checkedInput, setCheckedInput] = useState([]);
  const [isSearchRequest, setIsSearchRequest] = useState(false);
  const [lastSearchKeyword, setLastSearchKeyword] = useState(""); // 마지막 검색어 저장
  //페이지버튼 클릭시 실행되는 핸들러
  const onChangeProPageHandler = async (page) => {
    console.log("changePage----", page);
    //pagination의 currentPage 값 갱신

    // if (isSearchRequest) await handleSearch(page);
    // else {
    //   await getProductBoard(page);
    // }

    // > 검색어 입력 요청 O
    // > 검색된 데이터가 페이지네이션과 함께 출력
    // > 검색어 삭제 요청 X > 페이지 버튼 클릭 시
    // > 기존에 했던 검색어로 요청 O
    if (isSearchRequest) {
      // 이전 검색 상태가 유지되어 있을 때 → 마지막 검색어 기준으로 요청
      await handleSearch(page, pagination.pageSize, lastSearchKeyword);
    } else {
      // 검색 상태가 아니면 전체 데이터 요청
      await getProductBoard(page, pagination.pageSize);
    }
  };

  const handleSelectAll = (isChecked) => {
    setSelectAll(isChecked);
    if (isChecked) {
      console.log("selectAll", isChecked);
      // 모든 bookId를 배열에 추가
      const allIds = boardList.map((item) => item.qnaProId);
      console.log("allIds-Del", allIds);
      setCheckedInput(allIds);
    } else {
      // 전부 해제
      setCheckedInput([]);
    }
  };

  const onChangeCheck = (proId, isChecked) => {
    if (isChecked) {
      const newArray = [...checkedInput, proId];
      setCheckedInput(newArray);
      console.log("선택된 게시물 :", newArray);
    } else {
      const newArray = checkedInput.filter((id) => id !== proId);
      setCheckedInput(newArray);
      console.log("해제된 게시물 :", newArray);
    }
  };

  const [search, setSearch] = useState({});
  console.log("search 상태관리 :", search);

  const handleSearch = async (
    page = 1,
    pageSize = 5,
    keywordParam = search.keyword
  ) => {
    if (
      search.keyword === undefined ||
      (search.keyword.length === 0 && lastSearchKeyword === "")
    )
      await getProductBoard();

    setIsLoading(true);
    setIsError(false);
    // 2. 요청 URL 확인
    const requestUrl = `/api/admin/board/qnaProductList?keyword=${keywordParam}&currentPage=${page}&pageSize=${pageSize}`;
    console.log("요청 URL:", requestUrl);

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      setIsSearchRequest(true);
      const data = await response.json();
      setBoardList(data.items);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalRecord: data.totalRecord,
        pageSize: data.pageSize,
      });
      setLastSearchKeyword(keywordParam); // 마지막 검색어 저장
    } else {
      setIsError(true);
    }
    setIsLoading(false);
  };

  const onDeleteHandler = async (deleteItems) => {
    if (deleteItems.length === 0) {
      alert("게시물을 선택해 주세요");
      return;
    }
    console.log("삭제 할 게시물 아이디", deleteItems);
    try {
      //"/detail/product/{boardId}"
      const response = await fetch(`/api/admin/board/detail/product`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deleteItems),
      });
      if (response.ok) {
        if (isSearchRequest) {
          // 검색어 존재 유무에 따라 동작
          const targetPage = // 페이지 안에서 게시물이 하나 남은 페이지에서 삭제를 할 때 이전 페이지를 보여준다.
            pagination.totalPages > 1 &&
            pagination.totalRecord % pagination.pageSize === 1
              ? pagination.currentPage - 1
              : pagination.currentPage;
          handleSearch(targetPage, pagination.pageSize, lastSearchKeyword);
        } else {
          const targetPage = // 페이지 안에서 게시물이 하나 남은 페이지에서 삭제를 할 때 이전 페이지를 보여준다.
            pagination.totalPages > 1 &&
            pagination.totalRecord % pagination.pageSize === 1
              ? pagination.currentPage - 1
              : pagination.currentPage;
          getProductBoard(targetPage, pagination.pageSize);
        }

        // 선택 상태 초기화
        setCheckedInput([]);
        setSelectAll(false);
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
      {isLoading ? (
        <div>로딩 중...</div>
      ) : isError ? (
        <div>에러</div>
      ) : (
        <div>
          <SearchBar
            search={search}
            setSearch={setSearch}
            handleSearch={handleSearch}
          />

          {/* 테이블 */}

          <table className="table table-custom mt-4">
            <caption className="sr-only">등록된 상품 문의 테이블</caption>
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
                    key={item.qnaProId || index}
                    data={item}
                    number={
                      (pagination.currentPage - 1) * pagination.pageSize +
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
          {/* 테이블 */}
          {/*pagination*/}
          <Pagination
            paginationInfo={pagination}
            onChangePageHandler={onChangeProPageHandler}
          />
          {boardList && boardList?.length === 0 ? (
            []
          ) : (
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
          )}
        </div>
      )}
    </>
  );
};

export default ProductBoard;
