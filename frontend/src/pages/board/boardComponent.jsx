import "@assets/css/board/userBoard.css"
import Btn from "@util/reuseBtn.jsx";
import pathsData from "@assets/pathsData.jsx";
import {Link, Outlet, useLocation,} from "react-router-dom";
import React from "react";
import LeftMenu from "@layout/LeftMenu.jsx";
import {useMenu} from "../common/MenuContext.jsx";
import {menuNavi} from "../../util/menuNavi.jsx";

//context 상태관리
export const BoardStateContext = React.createContext();// state 값을 공급하는 context
export const BoardDispatchContext = React.createContext();// 생성, 수정(갱신), 삭제 값을 공급하는 context
export const PaginationContext = React.createContext();


const Board = () => {

    const location = useLocation();
    const isCreatePage = location.pathname.includes("/board/createBoard");
    const logCheck = () =>{
        console.log("페이지 이동")
    }

    const {currentPath}  = useMenu();
    console.log("currentPath",currentPath);

    //마이페이지 타이틀 동적 설정 함수
    const clientTile=(currentPath)=>{
        //마지막 주소값 받도록
        const lastPathArr = currentPath.split("/"); // 주소값을 "/"  기준으로 배열반환
        const lastPathNm= lastPathArr[lastPathArr.length-1] // 제일 마지막 배열값 인덱스 설정
        //switch 문으로 제목 지정
        switch(lastPathNm){
            case "oneboard":
                return "1:1문의";
                break;
            case "productboard":
                return "상품문의";
                break;
            case "diliveryboard":
                return "배송문의";
                break;
            default:
                return "게시판";
        }
    }
    return (
        <div>
            <div className="hoverLeaf"></div>
            <div className="page client d-flex">
                <aside id="sidebar" className="left-menu">
                    <div>
                        <div className="left-title">
                            {/*현재경로의 부모 1차메뉴 이름*/}
                            <h4 className="sub-title first-title title-border">
                                {clientTile(currentPath)}
                            </h4>

                            <ul className="depth first-depth">

                                <li>
                                    <Link to="oneboard"
                                          className={`depth-menu first ${currentPath.includes("oneboard") ? "current" : ""}`}>
                                        1:1문의
                                        <i className="leaf icon"></i>
                                    </Link>

                                </li>
                                <li>
                                    <Link to="productboard"
                                          className={`depth-menu first ${currentPath.includes("productBoard") ? "current" : ""}`}>
                                        배송지
                                        <i className="leaf icon"></i>
                                    </Link>

                                </li>
                                <li>
                                    <Link to="diliveryboard"
                                          className={`depth-menu first ${currentPath.includes("deliveryBoard") ? "current" : ""}`}>
                                        상품문의
                                        <i className="leaf icon"></i>
                                    </Link>
                                </li>

                            </ul>
                        </div>
                    </div>
                </aside>
                {/*링크이동할 사이드메뉴 */}
                <div>
                    {!isCreatePage && (
                        <>
                            <div className="userBoardHeader">게시판 제목</div>
                            <div>다른 사용자 들 게시물</div>
                            <div>
                                <Btn className={"btn createBoard"} id={"createBtn"} onClick={logCheck} type={"button"}
                                     path={pathsData.page.userCreateBoard} text="게시물 작성"/>
                            </div>
                        </>
                    )}
                    <BoardStateContext.Provider value={null}>
                        <BoardDispatchContext.Provider value={null}>
                            <PaginationContext.Provider value={null}>
                                <Outlet/>
                            </PaginationContext.Provider>
                        </BoardDispatchContext.Provider>
                    </BoardStateContext.Provider>
                </div>
            </div>
        </div>
    );
};

export default Board;
