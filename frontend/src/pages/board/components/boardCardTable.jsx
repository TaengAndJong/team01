import "@assets/css/board/userDashBoard.css";
import { formatToDate } from "@util/dateUtils.jsx";

const BoardCardTable = ({ items, category }) => {
  console.log("items:", items);
  console.log("category", category);
  if (!items || items.length === 0) {
    return <p>등록된 게시물이 없습니다.</p>;
  }

  // 카테고리별 ID 선택 함수
  const categoryId = (item, category) => {
    switch (category) {
      case "one":
        return item.qnaOneId;
      case "product":
        return item.qnaProId;
      case "delivery":
        return item.qnaDelId;
      default:
        return null;
    }
  };

  return (
    <table className="table table-custom">
      <caption className="sr-only"></caption>
      <thead>
        <tr>
          <th scope="col" className="text-center">
            제목
          </th>
          <th scope="col" className="text-center">
            답변여부
          </th>
          <th scope="col" className="text-center">
            등록일
          </th>
        </tr>
      </thead>

      <tbody className="">
        {items?.slice(0, 5)?.map((item, idx) => {
          return (
            <tr className="rd-5 card-item-box" key={idx}>
              <td className="text-left">
                <a
                  href={`/board/detailBoard/${category}/${categoryId(
                    item,
                    category
                  )}/?userId=${item.clientId}`}
                >
                  {item.qnaTitle}
                </a>
              </td>
              <td className="text-center">{item.qnaStatus}</td>
              <td className="text-center">
                {formatToDate(new Date(item.qnaDate))}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
export default BoardCardTable;
