import "@assets/css/board/userBoard.css"
import Btn from "@util/reuseBtn.jsx";
import pathsData from "@assets/pathsData.jsx";
import {Outlet, useLocation} from "react-router-dom";
import React from "react";
import LeftMenu from "@layout/LeftMenu.jsx";

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


    return (
        <div>
            <div className="page d-flex">
                <div className="left">
                    <LeftMenu/>
                </div>
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
