import Btn from "@util/reuseBtn.jsx";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DetailBoard = () => {
  const [boardData, setBoardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { category, boardId } = useParams();

  useEffect(() => {
    if (category && boardId) {
      // 값이 준비됐을 때만 호출
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await axios.get(`상세조회요청 API`);
          console.log("성공:", response.data);
          setBoardData(response.data);
        } catch (error) {
          console.error("에러 발생:", error);
          setError("데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [category, boardId]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러: {error}</div>;
  }
  return (
    <>
      <div>
        <div className="readBoardBox">
          <div className="d-flex">
            <dt className="name">고객명</dt>
            <dd>
              <span>{boardData?.customerName || "사용자 이름"}</span>
            </dd>
          </div>
          <div className="d-flex">
            <dt className="id">ID</dt>
            <dd>
              <span>{boardData?.userId || "사용자 아이디"}</span>
            </dd>
          </div>
          <div className="d-flex">
            <dt>문의 종류</dt>
            <dd>
              <div>
                <span>{boardData?.inquiryType || "문의 종류 적혀야 됨"}</span>
              </div>
            </dd>
          </div>
          <div className="d-flex">
            <dt className="inquireTitle">문의 제목</dt>
            <dd>
              <span>{boardData?.title || "사용자가 작성한 제목"}</span>
            </dd>
          </div>

          <div className="d-flex">
            <dt className="inquireContents">문의 내용</dt>
            <dd>
              <span>{boardData?.content || "사용자가 작성한 내용"}</span>
            </dd>
          </div>

          <div className="d-flex">
            <dt className="attachfiles">첨부 파일</dt>
            <dd>
              <span>{boardData?.attachments || "사용자가 첨부한 파일"}</span>
            </dd>
          </div>

          <div className="d-flex"></div>
          <div className="readBtnBox">
            <Btn
              className={"Btn updateBoard "}
              id={"updateBtn"}
              onClick={() => {}}
              text="수정하기"
            ></Btn>
          </div>
          {userType === "admin" && <div></div>}
        </div>
      </div>
    </>
  );
};

export default DetailBoard;
