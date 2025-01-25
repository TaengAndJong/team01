//전체선택, 개별선택 삭제, 장바구니버튼, 바로구매버튼, 찜목록 버튼 , 리뷰

import LeftMenu from "../../../layout/LeftMenu.jsx";
import {Outlet} from "react-router-dom";
import React from "react";
import Btn from "../../../util/reuseBtn.jsx";
import pathsData from "../../../assets/pathsData.jsx";

const AdminBookList = () => {

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
                <tr>
                    <td className="text-center">
                        {/*<input*/}
                        {/*    type="checkbox"*/}
                        {/*    id="item1"*/}
                        {/*    name="item1"*/}
                        {/*    checked={selectedItems.item1}*/}
                        {/*    onChange={handleItemChange}*/}
                        {/*    aria-checked={selectedItems.item1}*/}
                        {/*/>*/}
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
                </tbody>
            </table>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <Btn className={"create btn btn-primary"} type={"button"} path={pathsData.page.adminBookCreate} text="도서등록" />
            </div>

        </>
    )
}

export default AdminBookList;