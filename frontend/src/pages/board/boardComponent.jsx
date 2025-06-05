import "@assets/css/board/userDashBoard.css"
import Btn from "@util/reuseBtn.jsx";
import React from "react";
import pathsData from "@assets/pathsData.jsx";
const Board = () => {
    const logCheck = () =>{
        console.log("페이지 이동")
    }
    return (
        <>
            <div>
                <div className="DashBoardHeader">게시판 제목</div>
                <div>다른 사용자 들 게시물</div>
                <div></div>
                <div>
                    <Btn className={"btn createBoard"} id={"createBtn"} onClick={logCheck} type={"button"}  path={pathsData.page.userCreateBoard} text="게시물 작성"/>
                </div>
            </div>
        </>
    );
};

export default Board;
