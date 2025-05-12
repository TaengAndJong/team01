import QnaOneItem from "./qnaOneBoardItem.jsx";
import "@assets/css/board/oneBoard.css";
import {useEffect ,useState } from "react";
import axios from "axios";

const QnaOneBoard = () => {
    const [qnaOneData, setQnaOneData] = useState([]);
    const [isLoading,setIsLoading] = useState(true);

    useEffect(() => {
     axios.get('/api/admin/board/qnaOneList', {
         params: {
             clientId: 'user01'
         }
     })
     .then(response => {
         console.log("1:1문의 데이터",response.data);
         setQnaOneData(response.data);
     })
     .catch(error => {
         console.error('에러:',error);
     })
     .finally(() => {
         setIsLoading(false);
     });
    }, []);



    if (isLoading) {
        return <div>로딩 중...</div>;
    }

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
                    {qnaOneData.map((item ,index) => (<QnaOneItem key={item.qnaOneId || index} data={item}/>))}
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