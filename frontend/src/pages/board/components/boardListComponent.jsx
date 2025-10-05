import PropTypes from "prop-types";
import "@assets/css/board/userBoard.css";
import { Link } from "react-router-dom";

const BoardListComponent = ({
  categoryListData,
  category,
  number,
  checkedInput,
  onChangeCheck,
  getBoardId,
}) => {
  console.log("게시물 데이터", categoryListData);
  console.log("카테고리", category);

  return (
    <>
      <tr>
        <td className="text-center">
          <input
            type="checkbox"
            id={`item${number}`}
            name={`item${number}`}
            checked={checkedInput.includes(getBoardId(categoryListData))}
            onChange={(e) =>
              onChangeCheck(getBoardId(categoryListData), e.target.checked)
            }
          />
          <label htmlFor={`item${number}`} className="sr-only">
            {categoryListData.qnaTitle}
          </label>
        </td>
        <td className="text-center">{number}</td>
        <td className="text-center">
          <Link
            to={`/board/detailBoard/${category}/${getBoardId(
              categoryListData
            )}/?userId=${categoryListData.clientId}`}
          >
            {categoryListData.qnaTitle}
          </Link>
        </td>
        <td className="text-center">
          {categoryListData.qnaWriter}({categoryListData.clientId})
        </td>
        <td className="text-center">{categoryListData.qnaStatus}</td>
        <td className="text-center">{categoryListData.qnaDate}</td>
      </tr>
    </>
  );
};

BoardListComponent.propTypes = {
  categoryListData: PropTypes.object.isRequired,
  number: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
  checkedInput: PropTypes.array.isRequired,
  onChangeCheck: PropTypes.func.isRequired,
  getBoardId: PropTypes.func.isRequired,
};

export default BoardListComponent;
