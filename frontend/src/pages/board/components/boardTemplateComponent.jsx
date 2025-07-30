import { useContext } from "react";
import PropTypes from "prop-types";
import BoardListComponent from "./boardListComponent";
import { BoardListContext } from "../boardComponent";

// 카테고리별 한글 제목 매핑
const categoryNameMap = {
  one: "1:1 문의",
  product: "상품 문의",
  delivery: "배송 문의",
};

const BoardTemplateComponent = ({ category }) => {
  const boardList = useContext(BoardListContext);
  console.log("BoardTemplate -------- boardList------------------", boardList);
  const list = boardList?.[category] || [];

  return (
    <div>
      <h2>{categoryNameMap[category]}</h2>

      {/* 게시물이 없다면 안내 */}
      {list.length === 0 ? (
        <p>등록된 문의가 없습니다.</p>
      ) : (
        <BoardListComponent list={list} />
      )}
    </div>
  );
};

export default BoardTemplateComponent;

BoardTemplateComponent.propTypes = {
  category: PropTypes.oneOf(["one", "product", "delivery"]).isRequired,
};
