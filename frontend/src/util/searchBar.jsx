


//search 컴포넌트

import ReuseBtn from "./reuseBtn.jsx";
import Btn from "./reuseBtn.jsx";
import React from "react";

const SearchBar = ({search,setSearch, handleSearch}) =>{

    const handleSearchChange = (e) => {
        //검색조건 필터에 대해서 이벤트객체로 받아오기
        const name =e.target.name;
        const value=e.target.value;

        console.log("searchName",name);
        console.log("searchValue", value);

        setSearch((prev) =>(
            {
                ...prev,
                [name] : value //동적 설정
            }
        )); // 부모에게 전달
    };
console.log("search------------", search);

    return(
        <>
            <select className="form-control" name="type" value={search?.type || ""} onChange={(e)=>handleSearchChange(e)}>
                <option value="ALL">전체</option>
                <option value="국내도서">국내도서</option>
                <option value="국외도서">국외도서</option>
                <option value="EBOOK">Ebook</option>
            </select>
            <select className="form-control" name="field" value={search?.field|| ""} onChange={(e)=>handleSearchChange(e)}>
                <option value="title">도서명</option>
                <option value="author">저자</option>
            </select>
            <input className="form-control"
                type="text"
                name="keyword"
                value={search?.keyword || ""}
                onChange={(e)=>handleSearchChange(e)}
                placeholder="검색어 입력"
            />
            <Btn className={"search btn btn-primary"} type={"button"}  onClick={() => handleSearch()}  text="검색"/>

        </>
    )
}

export default SearchBar;