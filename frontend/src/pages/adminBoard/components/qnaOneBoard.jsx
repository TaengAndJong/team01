import "@assets/css/board/oneBoard.css";
import {useContext, useEffect, useState} from "react";
import QnaOneItem from "../components/qnaOneBoardItem.jsx";
import {BookBoardStateContext} from "../adminBoardComponent.jsx";

const QnaOneBoard = () => {

    const qnaOneData = useContext(BookBoardStateContext);
    console.log("qnaOneData",qnaOneData);
    const [boardList, setBoarList] = useState([]);

    // boardData 존재할 때만 bookList 업데이트
        useEffect(() => {
            //1.부모에서 받아온 데이터를 상태관리 함수에 갱신해줌
            if(qnaOneData){
                console.log("bookdata--------useEffect",qnaOneData);
                setBoarList(qnaOneData);
            }
            //페이지 fetch요청 보내기

        }, [qnaOneData]);

        console.log("boardList",boardList);
    return (
        <>
            <h3>1:1 문의 목록</h3>
            <div>
                <div>
                    <ul className="oneBoardIndex">
                        <li className="item">번호</li>
                        <li className="item">제목</li>
                        <li className="item">작성자</li>
                        <li className="item">상태</li>
                        <li className="item">등록일</li>
                    </ul>
                </div>
                <div className="oneBoardQuestionBox">
                    {boardList.map((item ,index) => (<QnaOneItem key={item.qnaOneId || index} data={item}/>))}
                </div>
                <div className="boardQnaFinder">
                    <div className="boardQnaFinderBox">
                        <textarea className="Finder_textArea" placeholder="검색어 입력">
                        </textarea>
                    </div>
                    <button>검색</button>
                </div>
            </div>
            <div>
                <button>삭제</button>
            </div>
        </>

    );
}

export default QnaOneBoard;