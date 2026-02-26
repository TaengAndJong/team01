import { useState, useEffect } from "react";
import Pagination from "@util/pagination.jsx";
import { Link } from "react-router-dom";

const TapMenuNewBookComponent = () => {
  const [activeTab, setActiveTab] = useState("국내도서");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [bookData, setBookData] = useState({
    국내도서: { items: [], pagination: {} },
    국외도서: { items: [], pagination: {} },
    "E-book": { items: [], pagination: {} },
  });
 // console.log("bookData", bookData);
  // const navigate = useNavigate();

  const getNewDomestic = async (page = 1, pageSize = 5) => {
    setIsLoading(true);
    setIsError(false);
    const response = await fetch(
      `/api/admin/newDomesticBook?currentPage=${page}&pageSize=${pageSize}`
    );
    if (response.ok) {
      const data = await response.json();

      setBookData((prev) => ({
        ...prev,
        국내도서: {
          ...prev.국내도서,
          items: data.items,
          pagination: {
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalRecord: data.totalRecord,
            pageSize: data.pageSize,
          },
        },
      }));
    } else {
      //에러처리
      setIsError(true);
    }
    setIsLoading(false);
  };

  const getNewForeign = async (page = 1, pageSize = 5) => {
    setIsLoading(true);
    setIsError(false);
    const response = await fetch(
      `/api/admin/newForeignBook?currentPage=${page}&pageSize=${pageSize}`
    );
    if (response.ok) {
      const data = await response.json();

      setBookData((prev) => ({
        ...prev,
        국외도서: {
          ...prev.국외도서,
          items: data.items,
          pagination: {
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalRecord: data.totalRecord,
            pageSize: data.pageSize,
          },
        },
      }));
    } else {
      //에러처리
      setIsError(true);
    }
    setIsLoading(false);
  };

  const getNewEBook = async (page = 1, pageSize = 5) => {
    setIsLoading(true);
    setIsError(false);
    const response = await fetch(
      `/api/admin/newEbook?currentPage=${page}&pageSize=${pageSize}`
    );
    if (response.ok) {
      const data = await response.json();

      setBookData((prev) => ({
        ...prev,
        ["E-book"]: {
          ...prev["E-book"],
          items: data.items,
          pagination: {
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalRecord: data.totalRecord,
            pageSize: data.pageSize,
          },
        },
      }));
    } else {
      //에러처리
      setIsError(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getNewDomestic();
    getNewForeign();
    getNewEBook();
  }, []);

  const onChangePageHandler = async ({ page, category }) => {
    if (category === "국내도서") {
      await getNewDomestic(page, bookData[category].pagination.pageSize);
    } else if (category === "국외도서") {
      await getNewForeign(page, bookData[category].pagination.pageSize);
    } else {
      await getNewEBook(page, bookData[category].pagination.pageSize);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.split("T")[0];
  };

  return (
    <>
      <h3 className="title">신규 등록 도서</h3>

      {/* 탭 버튼 */}
      <div className="tab-buttons">
        {Object.keys(bookData).map((category) => (
          <button
            key={category}
            className={`rounded-top tab-button ${
              activeTab === category ? "active" : ""
            }`}
            onClick={() => setActiveTab(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 테이블 */}
      <div className="tab-content">
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>도서명</th>
              <th>저자</th>
              <th>등록일</th>
            </tr>
          </thead>
          <tbody>
            {bookData[activeTab].items.length === 0 ? (
              <tr>
                <td colSpan="4">새로 등록된 도서가 없습니다.</td>
              </tr>
            ) : (
              bookData[activeTab].items.map((book, i) => (
                <tr key={i}>
                  <td>
                    {(bookData[activeTab].pagination.currentPage - 1) *
                      bookData[activeTab].pagination.pageSize +
                      i +
                      1}
                  </td>
                  <td>
                    <Link
                      to={`book/bookDetail/${book.bookId}`}
                      title={`${book.bookName} 상세 정보 보기`}
                    >
                      <span>{book.bookName}</span>
                    </Link>
                  </td>
                  <td>{book.author}</td>
                  <td>{formatDate(book.createDate)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Link
        to="/admin/book/bookList"
        className="btn more"
        type={"button"}
        title={"신규등록도서 더보기 버튼"}
      >
        <span className="icon more"></span>
      </Link>

      {/*pagination*/}
      <Pagination
        paginationInfo={bookData[activeTab].pagination}
        onChangePageHandler={(page) =>
          onChangePageHandler({ page, category: activeTab })
        }
      />
    </>
  );
};

export default TapMenuNewBookComponent;
