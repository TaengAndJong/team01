import { useContext } from "react";
import { BookBoardStateContext } from "../adminBoardComponent.jsx";
// import adminBoardItem from "./adminBoardItem.jsx";
// import SearchBar from "./adminBoardSearchBar.jsx";
// import Pagination from "./pagination.jsx";

const AdminboardTemplateComponent = ({ category }) => {
  const boardList = useContext(BookBoardStateContext);

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
        {console.log("boardList map 돌리기 전", boardList)}
        <div className="oneBoardQuestionBox">
          {boardList.map((item, index) => (
            <adminBoardItem key={item.qnaOneId || index} data={item} />
          ))}
        </div>
      </div>
      {/* <SearchBar
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
      /> */}
      <div>
        <button>삭제</button>
      </div>
      {/*pagination*/}
      {/* <Pagination
        paginationInfo={paginationInfo}
        onChangePageHandler={onChangePageHandler}
      /> */}
    </>
  );
};

export default AdminboardTemplateComponent;
