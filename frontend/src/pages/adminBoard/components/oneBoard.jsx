import "@assets/css/board/adminBoard.css";
import React, { useContext, useEffect, useState } from "react";
import AdminBoardItem from "@pages/adminBoard/components/adminBoardItem.jsx";
import SearchBar from "@pages/adminBoard/components/qnaAdminBoardSearchBar.jsx";
import { BookBoardStateContext } from "@pages/adminBoard/adminBoardComponent.jsx";
import Pagination from "@util/pagination.jsx";
import Btn from "@util/reuseBtn.jsx";
import { useModal } from "@pages/common/modal/ModalContext.jsx";
import { useAuth } from "@pages/common/AuthContext.jsx";
const OneBoard = () => {
  const { one } = useContext(BookBoardStateContext);
  const { userData } = useAuth();
  const [boardList, setBoardList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalRecord: 0,
    pageSize: 5,
  });

  const [search, setSearch] = useState({});
  console.log("search 상태관리 :", search);

  //전체선택
  const [selectAll, setSelectAll] = useState(false); // 전체 선택 여부
  //체크박스 상태관리(단일선택, 다중선택 초기값은 배열로)
  const [checkedInput, setCheckedInput] = useState([]);
  const [isSearchRequest, setIsSearchRequest] = useState(false);
  const [lastSearchKeyword, setLastSearchKeyword] = useState(""); // 마지막 검색어 저장

  const getOneBoard = async (page = 1, pageSize = 5) => {
    if (!userData || !userData.clientId) return; // userData 없으면 요청 취소
    setIsLoading(true);
    setIsError(false);

    const response = await fetch(
      `/api/admin/board/qnaOneList?currentPage=${page}&pageSize=${pageSize}&userId=${userData.clientId}`
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
    if (userData && userData.clientId) {
      console.log("✅ userData 로드 완료:", userData.clientId);
      console.log("getProductBoard 실행됨 ---------------------");
      getOneBoard();
    } else {
      console.log("⚠️ userData 아직 없음:", userData);
    }

    if (!one || !Array.isArray(one) || one.length === 0) {
      setBoardList([]);
      return;
    }

    const allItems = one.flatMap((item) =>
      Array.isArray(item.items) ? item.items : []
    );

    setBoardList(allItems);
  }, []);

  //페이지버튼 클릭시 실행되는 핸들러
  const onChangeOnePageHandler = async (page) => {
    console.log("changePage----", page);
    if (isSearchRequest) {
      // 이전 검색 상태가 유지되어 있을 때 → 마지막 검색어 기준으로 요청
      await handleSearch(page, pagination.pageSize, lastSearchKeyword);
    } else {
      // 검색 상태가 아니면 전체 데이터 요청
      await getOneBoard(page, pagination.pageSize);
    }
  };

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

  const handleSearch = async (
    page = 1,
    pageSize = 5,
    keywordParam = search.keyword
  ) => {
    if (
      keywordParam === undefined ||
      (keywordParam.length === 0 && lastSearchKeyword === "")
    ) {
      await getOneBoard();
      return;
    }

    setIsLoading(true);
    setIsError(false);

    // 2. 요청 URL 확인
    const requestUrl = `/api/admin/board/qnaOneList?keyword=${keywordParam}&currentPage=${page}&pageSize=${pageSize}&userId=${userData.clientId}`;
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
      const response = await fetch(`/api/admin/board/detail/one`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deleteItems),
      });
      if (response.ok) {
        // totalRecord - 삭제된 게시물 수로 남은 게시물 계산
        const remainingRecords = pagination.totalRecord - deleteItems.length;

        // 총 페이지 다시 계산
        const totalPagesAfterDelete = Math.ceil(
          remainingRecords / pagination.pageSize
        );

        const targetPage =
          pagination.currentPage > totalPagesAfterDelete
            ? pagination.currentPage - 1
            : pagination.currentPage;

        if (isSearchRequest) {
          // 검색어 존재 유무에 따라 동작
          await handleSearch(
            targetPage,
            pagination.pageSize,
            lastSearchKeyword
          );
        } else {
          await getOneBoard(targetPage, pagination.pageSize);
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
                  <td colSpan="12" className="text-center p-4">
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                boardList.map((item, index) => (
                  <AdminBoardItem
                    key={item.qnaOneId || index}
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
          {/*pagination*/}
          <Pagination
            paginationInfo={pagination}
            onChangePageHandler={onChangeOnePageHandler}
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
                    content: (
                      <>
                        <p>선택된 게시물을 삭제하시겠습니까?</p>
                      </>
                    ),
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

export default OneBoard;
