import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const BoardListComponent = ({ list = [] }) => {
  const location = useLocation();

  // ID를 가져오는 함수 정의
  const getItemId = (item) => {
    // 다양한 ID 필드명을 확인하여 사용 가능한 ID 반환
    return item.qnaId || item.boardId || item.id || item.qnaBoardId;
  };

  return (
    <ul>
      {list.map((item) => (
        <li key={getItemId(item)}>
          <Link to={`${location.pathname}/read/${getItemId(item)}`}>
            {item.qnaTitle} (작성자: {item.qnaWriter})
          </Link>
        </li>
      ))}
    </ul>
  );
};

BoardListComponent.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      qnaId: PropTypes.number,
      boardId: PropTypes.number,
      id: PropTypes.number,
      qnaBoardId: PropTypes.number,
      qnaTitle: PropTypes.string.isRequired,
      qnaWriter: PropTypes.string.isRequired,
    })
  ),
};

export default BoardListComponent;
