import "@assets/css/board/userDashBoard.css"
import React from "react";

const Board = () => {
    const handleCreate  = (e) => {
        //페이지 이동
        e.preventDefault();
        console.log("생성 이벤트 실행 페이지 이동");
    }
    return (
        <>
            <div>
                <div className="DashBoardHeader">게시판 제목</div>
                <div>다른 사용자 들 게시물</div>
                <div></div>
                <div>
                    <button onClick={handleCreate}>게시물 작성</button>
                </div>
            </div>
        </>
    );
};

export default Board;
