
const qnaOneBoardSearchBar = ({search,setSearch,handleSearch}) => {

    const searchHandler = (e) =>{
        const value = e.target.value;
        setSearch(value); // 입력 값 저장
        console.log("검색 키워드 :", value);
    }

    return (<>
        <div className="boardQnaFinder">
            <div className="boardQnaFinderBox">
                        <textarea
                            className="Finder_textArea"
                            placeholder="검색어 입력"
                            value={search}
                            onChange={searchHandler}
                        />
            </div>
            <button onClick={() => handleSearch()}>검색</button>
        </div>
    </>)

}

export default qnaOneBoardSearchBar;