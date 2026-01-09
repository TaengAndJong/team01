


//search 컴포넌트
import Btn from "@util/reuseBtn.jsx";
import React from "react";

const SearchBar = ({search,setSearch, handleSearch}) =>{

    const handleSearchChange = (e) => {

        const name= e.target.name;
        const value = e.target.value;

        setSearch((prev) =>({
                ...prev,
                [name]:value
            }
        ))
    };

    return(
        <>
            <div className="search-bar d-flex justify-content-end">
                <select className="form-control form-select w-auto" name="bookType" value={search?.bookType ?? "ALL"}
                        onChange={(e) => handleSearchChange(e)}>
                    <option value="ALL">전체</option>
                    <option value="국내도서">국내도서</option>
                    <option value="국외도서">국외도서</option>
                    <option value="EBOOK">Ebook</option>
                </select>
                <select className="form-control form-select w-auto" name="stockType" value={search?.stockType ?? "ALL"}
                        onChange={(e) => handleSearchChange(e)}>
                    <option value="ALL">전체</option>
                    <option value="in">재고있음</option>
                    <option value="out">재고없음</option>
                </select>
                <select className="form-control form-select w-auto" name="recomType" value={search?.recomType ?? "ALL"}
                        onChange={(e) => handleSearchChange(e)}>
                    <option value="ALL">전체</option>
                    <option value="NORMAL">일반</option>
                    <option value="RECOMMEND">추천</option>
                    <option value="POPULAR">인기</option>
                </select>
                <select className="form-control form-select w-auto" name="searchType" value={search?.searchType ?? ""}
                        onChange={(e) => handleSearchChange(e)}>
                    <option value="bookName">도서명</option>
                    <option value="author">저자</option>
                </select>
                <input className="form-control w-auto"
                       type="text"
                       name="keyword"
                       value={search?.keyword || ""}
                       onChange={(e) => handleSearchChange(e)}
                       placeholder="검색어 입력"
                />
                <Btn className={"search btn btn-dark"} type={"button"} onClick={() => handleSearch()} text="검색"/>
            </div>
        </>
    )
}

export default SearchBar;