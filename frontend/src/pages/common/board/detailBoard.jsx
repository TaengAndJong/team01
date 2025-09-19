import Btn from "@util/reuseBtn.jsx";
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { handleFileDownload } from "@util/fileDownload.jsx";
import "@assets/css/board/adminBoard.css";
import CommentModal from "@pages/common/board/commentModal.jsx";
import PropTypes from "prop-types";

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
  const [modalOpen, setModalOpen] = useState(false); // 모달 창 여닫기
  const [modalMode, setModalMode] = useState("create"); // 모달 창 분기용 모드
  console.log("유저아이디", userId);
  console.log("카테고리", category);
  console.log("게시물아이디", boardId);

  useEffect(() => {
    console.log("DetailBoard useEffect 실행됨", {
      category,
      boardId,
      userId,
      userType,
    });
    const fetchData = async () => {
      try {
        setLoading(true);

        // 조건에 따라 다른 API 호출
        const apiUrl =
          userType === "admin"
            ? `/api/${userType}/board/detail/${category}/${boardId}?userId=${userId}`
            : `/api/board/${category}/detail/${boardId}?userId=${userId}`;

        console.log("apiUrl:", apiUrl); // 확인

        const response = await axios.get(apiUrl);
        setData(response.data);
        console.log("DetailBoard data", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, boardId, userId, userType]); // userType도 의존성에 추가

  console.log("상세조회 데이터", data);

  const handleAnswerChange = (e) => {
    const value = e.target.value;
    setAnswer(value);
    console.log("답변", value);
  };

  const handleAnswerSubmit = async (answer) => {
    try {
      if (modalMode === "create") {
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
      } else if (modalMode === "edit") {
        const response = await axios.put(
          `/api/admin/board/detail/comment/${category}/${data.comment.commentId}`,
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
      }
    } catch (error) {
      const action = modalMode === "create" ? "등록" : "수정";
      console.error(`답변 ${action} 실패:`, error);
      alert(`답변 ${action}에 실패했습니다.`);
    }
  };

  const openCreateModal = () => {
    setAnswer("");
    setModalMode("create");
    setModalOpen(true);
  };

  const openEditModal = () => {
    setAnswer(data.comment.commentCon);
    setModalMode("edit");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handlePostDelete = async () => {
    //게시물 삭제 이벤트 핸들러 동작 순서
    // userType이 admin이면 /api/admin/board/detail/${category}/${boardId}
    // userType이 client이면 /api/board/detail/${category}/${boardId}

    // apiUrl에다가 조건을 추가해서 사용하면 될 듯

    const apiUrl =
      userType === "admin"
        ? `/api/admin/board/detail/${category}/${boardId}`
        : `/api/board/detail/${category}/${boardId}`;
    const response = await axios.delete(apiUrl);
    console.log("게시물 삭제 결과", response.data);
    if (userType === "admin") {
      navigate(`/admin/board/${category}Board`);
    } else {
      navigate(`/board/${category}Board`);
    }
  };

  const handleCommentDelete = async () => {
    const response = await axios.delete(
      `/api/admin/board/detail/comment/${category}/${data.comment.commentId}`
    );
    console.log("답글 삭제 결과", response.data);
    const newComment = response.data;
    // 또는 기존 comment가 있다면 교체
    setData((prev) => ({
      ...prev,
      comment: newComment, // 기존 댓글 덮어쓰기 (답글 1개만 허용이므로)
    }));
    setAnswer("");
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
                  {userType === "admin" && (
                    <div>
                      <Btn onClick={openEditModal} text="답변 수정" />
                      <Btn onClick={handleCommentDelete} text="답변 삭제" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {userType === "admin" && !data.comment && (
            <Btn
              text="답변 등록"
              onClick={() => {
                openCreateModal();
              }}
            />
          )}
          {modalOpen === true ? (
            <CommentModal
              answer={answer}
              setModalOpen={setModalOpen}
              onClose={closeModal}
              modalMode={modalMode}
              handleAnswerSubmit={handleAnswerSubmit}
              handleAnswerChange={handleAnswerChange}
            />
          ) : null}
          <div>
            {userType === "admin" ? (
              <Btn
                text="목록"
                onClick={() => navigate(`/admin/board/${category}Board`)}
              />
            ) : (
              <Btn
                text="목록"
                onClick={() => navigate(`/board/${category}Board`)}
              />
            )}
            <Btn color="red" onClick={() => handlePostDelete()} text="삭제" />
          </div>
        </div>
      </div>
    </>
  );
};

DetailBoard.propTypes = {
  userType: PropTypes.string.isRequired,
};

export default DetailBoard;
