import "@assets/css/board/adminBoard.css";
import { Link } from "react-router-dom";
import { formatToDate } from "@util/dateUtils.jsx";
const adminBoardItem = ({ data, number, checkedInput, onChangeCheck }) => {
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

  const getQnaDel = (data) => {
    if (data.qnaDel === "Y") return "삭제";
    return "미삭제";
  };

  return (
    <>
      <tr key={getBoardId(data)} className="table-light border-bottom">
        <td className="text-center">
          <input
            type="checkbox"
            id={`item${number}`}
            name={`item${number}`}
            checked={checkedInput.includes(getBoardId(data))}
            onChange={(e) => onChangeCheck(getBoardId(data), e.target.checked)}
          />
          <label
            htmlFor={`item${number}`}
            className="sr-only"
          >{`${data.qnaTitle}`}</label>
        </td>
        <td className="text-center ">{number}</td>
        <Link
          to={`/admin/board/detail/${getCategory(data)}/${getBoardId(
            data
          )}?userId=${data.clientId}`}
        >
          <td className="text-left">{data.qnaTitle}</td>
        </Link>
        <td className="text-center ">
          {data.qnaWriter}({data.clientId})
        </td>

        <td className="text-center ">{data.qnaStatus}</td>
        <td className="text-center ">{formatToDate(new Date(data.qnaDate))}</td>
        <td className="text-center ">{getQnaDel(data)}</td>
      </tr>
    </>
  );
};

export default adminBoardItem;
