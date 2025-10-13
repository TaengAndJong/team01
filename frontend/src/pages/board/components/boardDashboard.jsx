import "@css/board/userDashBoard.css";
import "@util/reuseBtn.jsx";
// import { useNavigate } from "react-router-dom";
import Btn from "@util/reuseBtn.jsx";
import { BoardListContext } from "../boardComponent";
import { useContext } from "react";
import BoardCardTalble from "./boardCardTable";
const BoardDashboard = () => {
  const boardList = useContext(BoardListContext);

  return (
    <>
      {/*컴포넌트 카드 */}
      <div className="inner pb-5">
        {/*1:1문의*/}
        <div className="card-box">
          <strong className="mb-4 d-block fw-bold table-title">1:1문의</strong>
          <BoardCardTalble items={boardList.one} category={"one"} />
        </div>
        {/*상품문의*/}
        <div className="card-box">
          <strong className="mb-4 d-block fw-bold table-title">상품문의</strong>
          <BoardCardTalble items={boardList.product} category={"product"} />
        </div>
        {/*배송문의 */}
        <div className="card-box">
          <strong className="mb-4 d-block fw-bold table-title">배송문의</strong>
          <BoardCardTalble items={boardList.delivery} category={"delivery"} />
        </div>
        {/* 끝*/}
      </div>
    </>
  );
};

export default BoardDashboard;
