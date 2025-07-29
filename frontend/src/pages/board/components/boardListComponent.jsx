import { useContext } from "react";
import { BoardListContext } from "../boardComponent";

const BoardListComponent = () => {
  const boardList = useContext(BoardListContext);
  console.log("boardList", boardList);
  return (
    <>
      <div>
        <div>
          <div>사용자가 작성한 게시물 목록</div>
          <ul>
            <li>게시물 제목</li>
            <li>게시물 내용</li>
            <li>게시물 작성자</li>
            <li>게시물 작성일</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default BoardListComponent;
