import "@assets/css/board/userDashBoard.css";
import Btn from "@util/reuseBtn.jsx";
import { formatToDate } from "@util/dateUtils.jsx";
import ReuseBtn from "../../../util/reuseBtn.jsx";

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

  //sr-0nly 테이블명 추가
  const categoryName = (category) => {
    switch (category) {
      case "one": return "일대일 문의";
      case "product": return "상품 문의";
      case "delivery": return "배송문의 ";
      default:""
    }
  }

  const categoryPath = (category) => {
    switch (category) {
      case "one": return "/board/oneBoard";
      case "product": return "/board/productBoard";
      case "delivery": return "/board/deliveryBoard";
      default: return "";
    }
  }

  const qnStatus = (qnaStatus) => {
    switch (qnaStatus) {
      case "답변대기": return "uncomplete";
      case "답변완료": return "complete";
      default:return "";
    }
  }

  return (
      <>
      <table className="table table-custom mb-5">
        <caption className="sr-only">{categoryName(category)} 테이블입니다.</caption>
        <colgroup>
          <col style={{width: "8%"}}/>
          <col style={{width: "52%"}}/>
          <col style={{width: "20%"}}/>
          <col style={{width: "20%"}}/>
        </colgroup>
        <thead>
        <tr>
          <th scope="col" className="text-center">No.</th>
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
              <tr className="rd-5 card-item-box  border-bottom" key={idx}>
                <td className="text-center">{idx + 1}.</td>
                <td className="text-left">
                  <a
                      href={`/board/detailBoard/${category}/${categoryId(
                          item,
                          category
                      )}/?userId=${item.clientId}`}
                      className="fw-bold"
                  >
                    {item.qnaTitle}
                  </a>
                </td>
                <td className="text-center"><span className={`tultip ${qnStatus(item.qnaStatus.replace(/\s/g, ""))}`}>{item.qnaStatus.replace(/\s/g, "")}</span></td>
                <td className="text-center">
                  {formatToDate(new Date(item.qnaDate))}
                </td>
              </tr>
          );
        })}
        </tbody>
      </table>

      <Btn
          className="navigate-btn"
          type="button"
          path={`${categoryPath(category)}`}
          text="+"
          aria-label={`${categoryName(category)} 더보기` }
      />

  </>
  );
};
export default BoardCardTable;
