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
    <div>
      <div className=" title-dotted">
        <span className="detail-title">제목 :</span>
        <span>{board?.qnaTitle}</span>
      </div>
      <div className=" mb-4 detail-date ">
        <span className="p-2">작성일 :</span>
        <span>{formatToDate(new Date(board?.qnaDate))}</span>
      </div>
      <div className="m-4 content-box">
        <div>{board?.qnaContent}</div>
      </div>
      <div className="attachment-box border border-secondary pt-3">
        <strong className="p-2 text-#333">원본 첨부파일</strong>
        <strong className="text-danger">{board?.attachmentList.length}</strong>
        <ul>
          {board?.attachmentList?.map((file, idx) => {
            return (
              <li key={idx} className=" attachment-list p-2">
                <a
                  className="download-item"
                  onClick={() => {
                    handleFileDownload(file?.fileName, file?.fileData);
                  }}
                >
                  {file.fileName}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      {board?.comment ? (
        <div className="comment-box ">
          <div className="d-flex mb-4 justify-content-md-between">
            <div>{board?.comment.commentCon} </div>
            <div className="">
              <span>답변자 : </span>
              <span>{board.comment.comWriter}</span>
            </div>
          </div>
          <div className="modify-btn">
            <Btn className="custom-btn02" onClick={openEditModal} text="수정" />
            <Btn
              className="custom-btn00"
              onClick={() =>
                openModal({
                  modalType: "confirm",
                  data: {
                    message: "선택된 답변을 삭제하시겠습니까?",
                  },
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
        <div>
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
      <div className="">
        <Btn
          className="btn btn-secondary d-grid gap-2 d-md-flex mt-4"
          text="목록"
          onClick={() => navigate(`/admin/board/${category}Board`)}
        />
      </div>
    </div>
  );
};

export default AdminDetailBoard;
