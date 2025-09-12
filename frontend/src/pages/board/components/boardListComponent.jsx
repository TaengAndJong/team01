import PropTypes from "prop-types";
import "@assets/css/board/userBoard.css";
import { Link } from "react-router-dom";

const BoardListComponent = ({ categoryListData, category }) => {
  console.log("게시물 데이터", categoryListData);
  console.log("카테고리", category);

  const getBoardId = () => {
    switch (category) {
      case "product":
        return categoryListData.qnaProId;
      case "delivery":
        return categoryListData.qnaDelId;
      case "one":
        return categoryListData.qnaOneId;
      default:
        return categoryListData.qnaId; // 기본값
    }
  };

  const boardId = getBoardId();

  return (
    <>
      <tr>
        <td>
          <Link
            to={`/board/detailBoard/${category}/${boardId}/?userId=${categoryListData.clientId}`}
          >
            {categoryListData.qnaTitle}
          </Link>
        </td>
        <td>{categoryListData.clientId}</td>
        <td>{categoryListData.qnaStatus}</td>
        <td>{categoryListData.qnaDate}</td>
      </tr>
    </>
  );
};

BoardListComponent.propTypes = {
  categoryListData: PropTypes.object.isRequired,
  number: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
};

export default BoardListComponent;
