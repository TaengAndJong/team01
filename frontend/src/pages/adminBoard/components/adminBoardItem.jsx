import "@assets/css/board/oneBoard.css";

const adminBoardItem = ({ data }) => {
  return (
    <>
      <div>
        <ul className="qnaOneItemBox">
          <li className="qnaOneItem">{data.qnaOneId}</li>
          <li className="qnaOneItem">{data.qnaTitle}</li>
          <li className="qnaOneItem">{data.qnaWriter}</li>
          <li className="qnaOneItem">{data.qnaStatus}</li>
          <li className="qnaOneItem">{data.qnaDate}</li>
        </ul>
      </div>
    </>
  );
};

export default adminBoardItem;
