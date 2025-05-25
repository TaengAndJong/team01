
const qnaOneBoardSearchBar = ({search,setSearch,handleSearch}) => {

    const searchHandler = (e) =>{
        const value = e.target.value;
        const name =e.target.name;

        setSearch(value); // 입력 값 저장
        console.log("검색 옵션 :", name);
        console.log("검색 키워드 :", value);

        setSearch((prev) =>(
            {
                ...prev,
                [name] : value //동적 설정
            }
        )); // 부모에게 전달
    }

    return (<>
        <div className="boardQnaFinder">
            <select name = "searchOption" value={search ?.searchOption || ""} onChange={(e)=>searchHandler(e)}>
                <option value="Replied">답변</option>
                <option value="Waiting">미답변</option>
            </select>
            <div className="boardQnaFinderBox">
                        <textarea
                            className="Finder_textArea"
                            placeholder="검색어 입력"
                            value={search?.keyword || ""}
                            onChange={(e) =>searchHandler(e)}
                        />
            </div>
            <button onClick={() => handleSearch()}>검색</button>
        </div>
    </>)

}

export default qnaOneBoardSearchBar;