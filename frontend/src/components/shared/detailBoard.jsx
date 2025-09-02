import Btn from "@util/reuseBtn.jsx";
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { handleFileDownload } from "@util/fileDownload.jsx";
import "@assets/css/board/adminBoard.css";
import CommentModal from "@components/shared/commentModal.jsx";

const DetailBoard = ({ userType }) => {
  // console.log("🔥 DetailBoard 컴포넌트 렌더링됨!");
  const navigate = useNavigate();
  const { category, boardId } = useParams();
  const [searchParams] = useSearchParams();
  const [answer, setAnswer] = useState("");

  // 관리자 id 로컬 스토리지에서 가져오기
  const userData = JSON.parse(localStorage.getItem("userData"));
  const adminId = userData?.clientId;

  const userId = searchParams.get("userId");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/admin/board/detail/${category}/${boardId}?userId=${userId}`
        );
        setData(response.data);
        console.log("DetailBoard data", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category, boardId, userId]);

  const handleAnswerChange = (e) => {
    const value = e.target.value;
    setAnswer(value);
    console.log("답변", value);
  };

  const handleAnswerSubmit = async (answer) => {
    try {
      // ✨ 1. 서버에서 등록된 댓글을 바로 받아옴
      const response = await axios.post(
        `/api/admin/board/detail/comment/${category}/${boardId}`,
        {
          commentCon: answer,
          comWriter: adminId,
        }
      );

      const newComment = response.data;
      // 또는 기존 comment가 있다면 교체
      setData((prev) => ({
        ...prev,
        comment: newComment, // 기존 댓글 덮어쓰기 (답글 1개만 허용이므로)
      }));
      setAnswer("");
    } catch (error) {
      console.error("답변 등록 실패:", error);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (!data) return <div>데이터를 불러올 수 없습니다.</div>;
  return (
    <>
      <div className="main boardDetailLayout">
        <div className="page boardDetail">
          <div className="boardDetail-title">
            <h1>{data.qnaTitle}</h1>
          </div>
          <div className="content">
            <div>{data.qnaContent}</div>
            <div>
              <ul>
                {data.attachmentList.map((item, index) => {
                  return (
                    <li
                      onClick={() =>
                        handleFileDownload(item.attachmentID, item.fileData)
                      }
                      key={index}
                    >
                      {item.fileName}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              {data.comment && (
                <div>
                  <div>{data.comment.commentCon}</div>
                  <div>{data.comment.comWriter}</div>
                  <div>{data.comment.comDate}</div>
                  <div>
                    <Btn onClick={null} text="답변 수정" />
                    <Btn onClick={null} text="답변 삭제" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {userType === "admin" && !data.comment && (
            <Btn
              text="답변 등록"
              onClick={() => {
                setModalOpen(!modalOpen);
              }}
            />
          )}
          {modalOpen === true ? (
            <CommentModal
              answer={answer}
              setModalOpen={setModalOpen}
              category={category}
              boardId={boardId}
              adminId={adminId}
              onClose={() => setModalOpen(false)}
              handleAnswerSubmit={handleAnswerSubmit}
              handleAnswerChange={handleAnswerChange}
            />
          ) : null}
          <div>
            <Btn
              text="목록"
              onClick={() => navigate(`/admin/board/${category}Board`)}
            />
            <Btn text="삭제" />
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailBoard;
