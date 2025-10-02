import "@assets/css/board/userDashBoard.css";
const BoardCardTable = ({ items }) => {
  console.log("items:", items);

  if (!items || items.length === 0) {
    return <p>등록된 게시물이 없습니다.</p>;
  }
  return (
    <>
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
          {items?.map((item, idx) => {
            return (
              <tr className="text-center rd-5 card-item-box" key={idx}>
                <td className="text-center">{item.qnaTitle}</td>
                <td className="text-center">{item.qnaStatus}</td>
                <td className="text-center">{item.qnaDate}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
export default BoardCardTable;
