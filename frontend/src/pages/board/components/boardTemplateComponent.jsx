import { useContext } from "react";
import BoardListComponent from "./boardListComponent";
import { BoardListContext } from "../boardComponent";

const BoardTemplateComponent = ({ category }) => {
  const boardList = useContext(BoardListContext);
  console.log("BoardTemplate -------- boardList------------------", boardList);
  const list = boardList?.[category] || [];
  console.log("BoardTemplate -------- list------------------", list);

  return (
    <div>
      <BoardListComponent categoryListData={list} />
    </div>
  );
};

export default BoardTemplateComponent;
