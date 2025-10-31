import Btn from "@util/reuseBtn.jsx";
import axios from "axios";
import { handleFileDownload } from "@util/fileDownload.jsx";
import "@assets/css/board/adminBoard.css";
import CommentModal from "./commentModal";
// import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@pages/common/AuthContext.jsx";
import { useModal } from "@pages/common/modal/ModalContext.jsx";
import { formatToDate } from "@util/dateUtils.jsx";

const AdminDetailBoard = ({ userType }) => {
  const { userData } = useAuth(); // 로그인 상태와 사용자 데이터 가져오는
  console.log("로그인한 사용자 ", userData);
  const { category, boardId } = useParams();
  const [searchParams] = useSearchParams();
  const [board, setBoard] = useState();
  const navigate = useNavigate();
  const userId = searchParams.get("userId"); // 쿼리 파라미터 사용
  const [modalOpen, setModalOpen] = useState(false); // 모달 창 여닫기
  const [modalMode, setModalMode] = useState("create"); // 모달 창 분기용 모드
  const [answer, setAnswer] = useState("");

  // 모달 관련 커스텀 훅
  const { openModal, closeModal } = useModal();

  const openCreateModal = () => {
    setAnswer("");
    setModalMode("create");
    setModalOpen(true);
  };

  const openEditModal = () => {
    setAnswer(board?.comment.commentCon);
    setModalMode("edit");
    setModalOpen(true);
  };

  const closeCommentModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    console.log("🔥 AdminDetailBoard 렌더링됨!");
    console.log({ category, boardId, userId, userType });
    console.log("상세조회 api 호출 시작");
    const url = `/api/admin/board/detail/${category}/${boardId}`;
    console.log("url", url);
    const fetchData = async (userId) => {
      try {
        const response = await axios.get(url, {
          params: { userId: userId },
        });
        console.log("요청한 상세 데이터:", response.data);
        setBoard(response.data);
        return response.data;
      } catch (err) {
        console.log(err);
      }
    };
    fetchData(userId);
  }, [category, boardId, userId, userType]);

  const handleAnswerSubmit = async (answer) => {
    try {
      if (modalMode === "create") {
        // ✨ 1. 서버에서 등록된 댓글을 바로 받아옴
        const response = await axios.post(
          `/api/admin/board/detail/comment/${category}/${boardId}`,
          {
            commentCon: answer,
            comWriter: userData.clientId,
            comWriterName: userData.clientName,
          }
        );

        setBoard((prev) => ({ ...prev, comment: response.data }));
        setAnswer("");
      } else if (modalMode === "edit") {
        const response = await axios.put(
          `/api/admin/board/detail/comment/${category}/${board.comment.commentId}`,
          {
            commentCon: answer,
            comWriter: userData.clientId,
          }
        );
        setBoard((prev) => ({ ...prev, comment: response.data }));
        setAnswer("");
      }
    } catch (error) {
      const action = modalMode === "create" ? "등록" : "수정";
      console.error(`답변 ${action} 실패:`, error);
      alert(`답변을 추가 해주세요.`);
    }
  };

  const handleAnswerChange = (e) => {
    const value = e.target.value;
    setAnswer(value);
    console.log("답변", value);
  };

  const handleCommentDelete = async () => {
    await axios.delete(
      `/api/admin/board/detail/comment/${category}/${board.comment.commentId}`
    );
    console.log("답글 삭제 결과");
    setBoard((prev) => ({ ...prev, comment: null }));
    setAnswer("");
  };

  return (
    <div className="admin-board-detail">
      <div className="boardInfo card-body border-bottom">
        <div className="info-header clearfix">
          <h3 className="board-title title-dotted">
            <i className="icon qna me-3"></i>
            {board?.qnaTitle}
          </h3>
          <span className="detail-date tultip popular float-end d-inline-block">
            <i className="sr-only">작성일</i>
            {formatToDate(new Date(board?.qnaDate))}
          </span>
        </div>
        <div className="content-box p-4 text-left">{board?.qnaContent}</div>
        <div className="attachment-box border-top border-bottom d-block p-4">
          <strong className="py-2 d-inline-block">원본 첨부파일</strong>
          <span className="mx-2 fw-bold">
            <em className="text-danger ">{board?.attachmentList.length}</em>개
          </span>
        </div>
        {board?.attachmentList.length > 0 && (
          <ol className="file-list p-4 list">
            {board?.attachmentList?.map((file, idx) => {
              return (
                <li
                  key={idx}
                  className=" d-flex align-items-center mb-2 bullet-li"
                >
                  <strong
                    className="fw-bold me-2"
                    onClick={() => {
                      handleFileDownload(file?.fileName, file?.fileData);
                    }}
                  >
                    {file.fileName}
                  </strong>
                  <span
                    className="icon down"
                    onClick={() => {
                      handleFileDownload();
                    }}
                  >
                    <em className="sr-only">다운로드</em>
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </div>
      {board?.comment ? (
        <div className="comment-container">
          <div className="p-4">
            <div className="d-flex justify-content-between align-items-center comment-title">
              <strong>관리자 답변</strong>
              <span className="tultip">
                {board.comment.comWriterName}({board.comment.comWriter})
              </span>
            </div>
            <div className="comment-box mb-4 text-left">
              {board?.comment.commentCon}
            </div>
          </div>
          <div className="modify-btn mb-4">
            <Btn
              className="custom-btn02 m-1"
              onClick={openEditModal}
              text="수정"
            />
            <Btn
              className="custom-btn00"
              onClick={() =>
                openModal({
                  modalType: "confirm",
                  content:<><p>선택된 답변을 삭제하시겠습니까?</p></>,
                  onConfirm: () => {
                    handleCommentDelete(), closeModal();
                  },
                  onClose: closeModal,
                })
              }
              text="삭제"
            />
          </div>
        </div>
      ) : (
        <div className="d-md-flex justify-content-md-end">
          <Btn
            className="btn custom-btn00 btn-submit d-grid gap-2 mt-4"
            text="답변 등록"
            onClick={() => openCreateModal()}
          />
        </div>
      )}
      {modalOpen === true ? (
        <CommentModal
          answer={answer}
          setModalOpen={setModalOpen}
          onClose={closeCommentModal}
          modalMode={modalMode}
          handleAnswerSubmit={handleAnswerSubmit}
          handleAnswerChange={handleAnswerChange}
        />
      ) : null}
      <div className="d-grid gap-2 d-md-flex justify-content-md-end pt-4 border-top">
        <Btn
          className="btn custom-btn01"
          text="목록"
          onClick={() => navigate(`/admin/board/${category}Board`)}
        />
      </div>
    </div>
  );
};

export default AdminDetailBoard;
