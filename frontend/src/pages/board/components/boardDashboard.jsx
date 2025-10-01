import "@css/board/userDashBoard.css";
import "@util/reuseBtn.jsx";
import { useNavigate } from "react-router-dom";
import Btn from "@util/reuseBtn.jsx";
import { BoardListContext } from "../boardComponent";
import { useContext } from "react";
const BoardDashboard = () => {
  const boardList = useContext(BoardListContext);
  console.log("게시물 데이터", boardList);
  const navigate = useNavigate();

  const handleCreateBoard = () => {
    navigate(`/board/createBoard`);
  };

  return (
    <>
      <div className="content-inner custom-border">
        <div className="">
          <strong className="title d-inline-block mb-4">
            최근 등록한 문의
          </strong>
          {/*컴포넌트 카드 */}
          <div className="flex_box inner">
            <div className="card_box">
              <strong className="card_title">1:1 문의</strong>
              <div>
                <ul className="recent-slide box-list">
                  {boardList.one.slice(0, 5).map((board, idx) => {
                    return (
                      <li className="card-item li gray" key={idx}>
                        {board.qnaTitle}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className="card_box">
              <strong className="card_title">상품 문의</strong>
              <div>
                <ul className="recent-slide box-list">
                  {boardList.product.slice(0, 5).map((board, idx) => {
                    return (
                      <li className="card-item li gray" key={idx}>
                        {board.qnaTitle}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className="card_box">
              <strong className="card_title">배달 문의</strong>
              <div>
                <ul className="recent-slide box-list">
                  {boardList.delivery.slice(0, 5).map((board, idx) => {
                    return (
                      <li className="card-item li gray" key={idx}>
                        {board.qnaTitle}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <Btn
              className={"create btn btn-create"}
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
