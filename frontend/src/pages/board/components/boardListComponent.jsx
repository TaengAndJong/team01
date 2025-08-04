import PropTypes from "prop-types";
import "@assets/css/board/userBoard.css";

const BoardListComponent = ({ categoryListData }) => {
  console.log("categoryListData------------------", categoryListData);
  return (
    <div>
      <ul className="BoardList">
        <li className="item">{categoryListData.qnaTitle}</li>
        <li className="item">{categoryListData.clientId}</li>
        <li className="item">{categoryListData.qnaStatus}</li>
        <li className="item">{categoryListData.qnaDate}</li>
      </ul>
    </div>
  );
};

BoardListComponent.propTypes = {
  categoryListData: PropTypes.object.isRequired,
  number: PropTypes.number.isRequired,
};

export default BoardListComponent;
