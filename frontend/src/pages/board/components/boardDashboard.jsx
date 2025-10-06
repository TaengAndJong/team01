import "@css/board/userDashBoard.css";
import "@util/reuseBtn.jsx";
import { useNavigate } from "react-router-dom";
import Btn from "@util/reuseBtn.jsx";
import { BoardListContext } from "../boardComponent";
import { useContext } from "react";
import BoardCardTalble from "./boardCardTable";
const BoardDashboard = () => {
  const boardList = useContext(BoardListContext);
  // console.log("게시물 데이터", boardList);
  const navigate = useNavigate();
  // console.log("1:1", boardList.one);
  // console.log("1:1", boardList.pruduct);
  // console.log("1:1", boardList.delivery);
  const handleCreateBoard = () => {
    navigate(`/board/createBoard`);
  };

  return (
    <>
      <div className="">
        <div className="">
          {/* <strong className="title d-inline-block mb-4">
            최근 등록한 문의
          </strong> */}
          {/*컴포넌트 카드 */}
          <div className="flex_box inner">
            <div className="card-box">
              <span className="mb-4">1:1문의</span>
              <BoardCardTalble items={boardList.one} />
            </div>
            <div className="card-box">
              <span className="mb-4">상품문의</span>
              <BoardCardTalble items={boardList.product} />
            </div>
            <div className="card-box">
              <span className="mb-4">배송문의</span>
              <BoardCardTalble items={boardList.delivery} />
            </div>
          </div>

          <div>
            <Btn
              className={"create btn w- custom-btn00 btn-create"}
              id={"createBtn"}
              type={"button"}
              onClick={() => handleCreateBoard()}
              text="문의 하기"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BoardDashboard;
