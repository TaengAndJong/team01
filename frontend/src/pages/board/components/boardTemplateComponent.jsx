import { useContext } from "react";
import BoardListComponent from "./boardListComponent";
import { BoardListContext } from "../boardComponent";
import PropTypes from "prop-types";
import "@assets/css/board/userBoard.css";
import Btn from "@util/reuseBtn.jsx";
import { useNavigate } from "react-router-dom";
import "@assets/css/board/adminBoard.css";

const BoardTemplateComponent = ({ category }) => {
  const boardList = useContext(BoardListContext);
  console.log("BoardTemplate -------- boardList------------------", boardList);
  const list = boardList?.[category] || [];
  console.log("BoardTemplate -------- list------------------", list);
  const navigate = useNavigate();

  const handleCreateBoard = () => {
    navigate(`/board/createBoard`);
  };
  return (
    <div>
      <table className="table table-custom mt-4">
        <caption className="sr-only">등록된 게시물 테이블</caption>
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
        {console.log("사용자 게시물 돌리기 전", boardList)}
        <tbody className="">
          {list.map((item, index) => (
            <BoardListComponent
              key={index}
              categoryListData={item}
              category={category}
            />
          ))}
        </tbody>
      </table>

      <div>
        <Btn onClick={() => handleCreateBoard()} text="문의 등록" />
      </div>
    </div>
  );
};

BoardTemplateComponent.propTypes = {
  category: PropTypes.string.isRequired,
};

export default BoardTemplateComponent;
