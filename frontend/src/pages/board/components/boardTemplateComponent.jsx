import { useContext } from "react";
import BoardListComponent from "./boardListComponent";
import { BoardListContext } from "../boardComponent";
import PropTypes from "prop-types";
import "@assets/css/board/userBoard.css";

const BoardTemplateComponent = ({ category }) => {
  const boardList = useContext(BoardListContext);
  console.log("BoardTemplate -------- boardList------------------", boardList);
  const list = boardList?.[category] || [];
  console.log("BoardTemplate -------- list------------------", list);

  return (
    <div>
      <div>
        <ul className="BoardIndex">
          <li className="item">제목</li>
          <li className="item">작성자</li>
          <li className="item">상태</li>
          <li className="item">등록일</li>
        </ul>
      </div>
      <div>
        {/* {list.map((item, index) => (
          <BoardListComponent key={index} categoryListData={item} />
        ))} */}
      </div>
    </div>
  );
};

BoardTemplateComponent.propTypes = {
  category: PropTypes.string.isRequired,
};

export default BoardTemplateComponent;
