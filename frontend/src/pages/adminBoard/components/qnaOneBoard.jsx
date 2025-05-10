import "@assets/css/board/oneBoard.css";
const QnaOneBoard = () => {


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
                    <ul>
                        <li>문의제목</li>
                        <li>문의2</li>
                        <li>문의3</li>
                        <li>문의4</li>
                    </ul>
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