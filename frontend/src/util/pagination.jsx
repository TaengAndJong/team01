import "@assets/css/pagination.css";

//totalItems == totalRecord
const Pagination = ({ paginationInfo, onChangePageHandler}) => {

    const {currentPage, totalItems, pageSize} = paginationInfo;
    const totalPages = Math.ceil(totalItems / pageSize);

    console.log("paginationInfo", paginationInfo);
    console.log("paginationInfo", Array.isArray(paginationInfo));

    if (totalPages === 0) return null;

    const getPageNumbers = () => {
        const pageNumbers = [];

        // 간단하게 전체 페이지 다 보여주는 방식 (추후 개선 가능)
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    const handlePrev = () => {
        if (currentPage > 1) onChangePageHandler(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onChangePageHandler(currentPage + 1);
    };

    //
    const pageButtons = [];
    for (let i = 1; i <= paginationInfo.totalPages; i++) {
        pageButtons.push(
            <li
                key={i}
                className={`d-inline-block w-25 ${i === paginationInfo.currentPage ? "active" : ""}`}
                onClick={() => onChangePageHandler(i)}
            >
                {i}
            </li>
        );
    }

    return (
        paginationInfo.totalPages > 0 && (
            <div className="pagination">
                <ul className="pageList d-flex w-100">{pageButtons}</ul>
            </div>
        )
    );
};

export default Pagination;