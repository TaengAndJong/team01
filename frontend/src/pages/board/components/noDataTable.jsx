const NoDataTable = () => {
  return (
    <>
      <table className="table table-custom mb-5">
        <caption className="sr-only">테이블에 데이터가 없습니다.</caption>
        <colgroup>
          <col style={{ width: "8%" }} />
          <col style={{ width: "52%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "20%" }} />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className="text-center">
              No.
            </th>
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
          <tr className="rd-5 card-item-box  border-bottom">
            <td className="text-center" colSpan="4">
              등록된 게시물이 없습니다.
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default NoDataTable;
