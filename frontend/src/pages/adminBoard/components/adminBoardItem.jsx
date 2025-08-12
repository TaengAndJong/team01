import "@assets/css/board/adminBoard.css";
import { Link } from "react-router-dom";

const adminBoardItem = ({ data, number }) => {
  console.log("adminBoardItem data", data);

  const getCategory = (data) => {
    if (data.qnaOneId) return "one";
    if (data.qnaProId) return "product";
    if (data.qnaDelId) return "delivery";
  };

  const getBoardId = (data) => {
    if (data.qnaOneId) return data.qnaOneId;
    if (data.qnaProId) return data.qnaProId;
    if (data.qnaDelId) return data.qnaDelId;
    return "N/A";
  };

  return (
    <>
      <tr key={data.productId} className="table-light border-bottom">
        <td className="text-center ">{number}</td>
        <Link
          to={`/admin/board/detail/${getCategory(data)}/${getBoardId(
            data
          )}?userId=${data.clientId}`}
        >
          <td className="text-left">{data.qnaTitle}</td>
        </Link>
        <td className="text-center ">{data.qnaWriter}</td>
        <td className="text-center ">{data.clientId}</td>
        <td className="text-center ">{data.qnaStatus}</td>
        <td className="text-center ">{data.qnaDate}</td>
      </tr>
    </>
  );
};

export default adminBoardItem;
