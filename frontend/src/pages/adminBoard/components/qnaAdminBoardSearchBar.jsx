const qnaOneBoardSearchBar = ({ search, setSearch, handleSearch }) => {
  const searchHandler = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    console.log("검색 옵션 :", name);
    console.log("검색 키워드 :", value);

    setSearch((prev) => ({
      ...prev,
      [name]: value, //동적 설정
    })); // 부모에게 전달
  };

  return (
    <>
      <div className="search-bar d-flex justify-content-end">
        <select
          className="form-form-control w-auto"
          name="searchType"
          value={search?.searchType || ""}
          onChange={(e) => searchHandler(e)}
        >
          <option value="ALL">전체</option>
          <option value="Replied">답변</option>
          <option value="Waiting">미답변</option>
        </select>

        <input
          className="form-form-control w-auto"
          type="text"
          name="keyword"
          placeholder="검색어 입력"
          value={search?.keyword || ""}
          onChange={(e) => searchHandler(e)}
        />
        <button
          className={"search btn custom-btn00"}
          type={"button"}
          onClick={() => handleSearch()}
        >
          검색
        </button>
      </div>
    </>
  );
};

export default qnaOneBoardSearchBar;
