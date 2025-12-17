import "@assets/css/pagination.css";

//totalItems == totalRecord
const Pagination = ({ paginationInfo, onChangePageHandler}) => {
    console.log("paginationInfo -- 첫번째 ", paginationInfo);

    const {currentPage, totalPages,totalRecord, pageSize} = paginationInfo;

    if (totalPages === 0) return null;
    
 
    const pageButtons = [];
    for (let i = 1; i <= paginationInfo.totalPages; i++) {
        pageButtons.push(
            <li
                key={i}
                className="d-inline-block"
                onClick={() => onChangePageHandler(i)}
            >
                <button className={`btn d-inline-block ${i === paginationInfo.currentPage ? "active" : ""}`}>{i}</button>
            </li>
        );
    }

    return (
        paginationInfo.totalPages > 0 && (
            <div className="pagination">
                <ul className="pagelist d-flex w-100 justify-content-center">{pageButtons}</ul>
            </div>
        )
    );
};

export default Pagination;