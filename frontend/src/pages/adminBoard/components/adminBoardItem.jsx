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
      <tr key={data.productId} className="table-light border-bottom">
        <td className="text-center ">{number}</td>

        <td className="text-left">{getTitle(data)}</td>
        <td className="text-center ">{getWriter(data)}</td>
        <td className="text-center ">{getStatus(data)}</td>
        <td className="text-center ">{getDate(data)}</td>
      </tr>
    </>
  );
};

export default adminBoardItem;
