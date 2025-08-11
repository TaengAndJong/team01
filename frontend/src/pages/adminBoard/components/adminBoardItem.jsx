import "@assets/css/board/adminBoard.css";
import { Link } from "react-router-dom";
import DetailBoard from "@assets/sharedComponent/detailBoard.jsx";

const adminBoardItem = ({ data, number }) => {
  console.log("adminBoardItem data", data);

  //
  const getCategory = (data) => {
    if (data.qnaTitle || data.qnaOneId) return "qna";
  };

  return (
    <>
      <tr key={data.productId} className="table-light border-bottom">
        <td className="text-center ">{number}</td>
        <Link
          to={`detail/${data.category}/${data.boardId}?userId=${data.userId}`}
        >
          <td className="text-left">{data.qnaTitle}</td>
        </Link>
        <td className="text-center ">{data.qnaWriter}</td>
        <td className="text-center ">{data.clientId}</td>
        <td className="text-center ">{data.qnaDate}</td>
        <td className="text-center ">{data.qnaStatus}</td>
      </tr>
    </>
  );
};

export default adminBoardItem;
