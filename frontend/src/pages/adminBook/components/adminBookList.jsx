//전체선택, 개별선택 삭제, 장바구니버튼, 바로구매버튼, 찜목록 버튼 , 리뷰

import React, {useEffect, useState} from "react";
import Btn from "../../../util/reuseBtn.jsx";
import pathsData from "../../../assets/pathsData.jsx";

const AdminBookList = () => {

    const [bookList, setBookList] = useState([]);


    useEffect(() => {
        console.log("Fetching book list..."); // 실행되는지 확인

        const fetchData = async () => {
            console.log("fetchData 함수 실행됨"); // 실행되는지 확인
            try {
                const response = await fetch("/api/admin/book/bookList", {
                    method: "GET",
                    credentials: "include"  // 쿠키를 포함해서 보내도록 설정
                });

                if (response.ok) {
                    console.log("response------------", response);
                    const contentType = response.headers.get("Content-Type");

                    if (contentType && contentType.includes("application/json")) {
                        const json = await response.json();
                        console.log("json-----", json);
                        setBookList(json);
                        console.log("bookList",bookList)
                    } else {
                        const textData = await response.text();
                        console.log("textData 입니다. ---", textData);
                    }
                } else {
                    console.error("HTTP Error:", response.status, response.statusText);
                }
            } catch (error) {
                console.error("Fetch Error:", error);
            }
        };

        fetchData(); // 함수 호출 확인
    }, []);




    return(
        <>
            <table className="table">
                <caption className="sr-only">
                    등록된 도서상품 테이블
                </caption>
                <thead>
                <tr>
                    <th className="text-center">
                        {/*<input*/}
                        {/*    type="checkbox"*/}
                        {/*    id="selectAll"*/}
                        {/*    checked={isSelectAll}*/}
                        {/*    onChange={handleSelectAllChange}*/}
                        {/*    aria-checked={isSelectAll}*/}
                        {/*/>*/}
                        <input
                            type="checkbox"
                            id="selectAll"
                        />
                        <label htmlFor="selectAll">전체 선택</label>
                    </th>
                    <th className="text-center">No.</th>
                    <th className="text-center">이미지</th>
                    <th className="text-center">도서명</th>
                    <th className="text-center">설명</th>
                    <th className="text-center">저자</th>
                    <th className="text-center">등록자</th>
                    <th className="text-center">등록일</th>
                </tr>
                </thead>
                <tbody className="">


                    {bookList?.data?(
                        <tr>
                            <td colSpan="8" className="text-center">데이터가 없습니다</td>
                        </tr>
                    ):(
                        <tr>
                            <td className="text-center">
                                <input
                                    type="checkbox"
                                    id="item1"
                                    name="item1"
                                />
                                <label htmlFor="item1">항목 1</label>
                            </td>
                            <td className="text-center"></td>
                            <td className="text-center"></td>
                            <td className="text-left"></td>
                            <td className="text-left"></td>
                            <td className="text-center"></td>
                            <td className="text-center"></td>
                            <td className="text-center"></td>
                        </tr>
                    )}

                </tbody>
            </table>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <Btn className={"create btn btn-primary"} type={"button"} path={pathsData.page.adminBookCreate} text="도서등록" />
            </div>

        </>
    )
}

export default AdminBookList;