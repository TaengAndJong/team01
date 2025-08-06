import "@assets/css/board/adminBoard.css";

const adminBoardItem = ({ data, number }) => {
  console.log("adminBoardItem data", data);

  // 각 카테고리별 제목 필드 매핑
  const getTitle = (data) => {
    if (data.qnaTitle) return data.qnaTitle;
    if (data.productTitle) return data.productTitle;
    if (data.deliveryTitle) return data.deliveryTitle;
    return data.title || "N/A";
  };

  // 각 카테고리별 작성자 필드 매핑
  const getWriter = (data) => {
    if (data.qnaWriter) return data.qnaWriter;
    if (data.productWriter) return data.productWriter;
    if (data.deliveryWriter) return data.deliveryWriter;
    return data.writer || "N/A";
  };

  // 각 카테고리별 상태 필드 매핑
  const getStatus = (data) => {
    if (data.qnaStatus) return data.qnaStatus;
    if (data.productStatus) return data.productStatus;
    if (data.deliveryStatus) return data.deliveryStatus;
    return data.status || "N/A";
  };

  // 각 카테고리별 날짜 필드 매핑
  const getDate = (data) => {
    if (data.qnaDate) return data.qnaDate;
    if (data.productDate) return data.productDate;
    if (data.deliveryDate) return data.deliveryDate;
    return data.date || "N/A";
  };

  return (
    <>
      <div>
        <ul className="qnaOneItemBox">
          <li className="qnaOneItem">{number}</li>
          <li className="qnaOneItem">{getTitle(data)}</li>
          <li className="qnaOneItem">{getWriter(data)}</li>
          <li className="qnaOneItem">{getStatus(data)}</li>
          <li className="qnaOneItem">{getDate(data)}</li>
        </ul>
      </div>
    </>
  );
};

export default adminBoardItem;
