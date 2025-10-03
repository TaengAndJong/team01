import Btn from "@util/reuseBtn.jsx";
import PropTypes from "prop-types";
import "@assets/css/board/adminBoard.css";
const CommentModal = ({
  answer,
  modalMode,
  onClose,
  handleAnswerSubmit,
  handleAnswerChange,
}) => {
  const title = modalMode === "edit" ? "답변 수정" : "답변 등록";
  const buttonText = modalMode === "edit" ? "수정" : "등록";

  return (
    <div className="comment-modal-overlay" onClick={onClose}>
      <div
        className="comment-modal-box"
        onClick={(e) => e.stopPropagation()} // 내부 클릭 시 모달 닫히지 않음
      >
        <span className="close-btn" onClick={onClose}>
          x
        </span>
        <h2 className="mb-4">{title}</h2>
        <textarea value={answer} onChange={handleAnswerChange} />
        <div>
          <Btn
            className="custom-btn01 text-right"
            text={buttonText}
            onClick={() => {
              handleAnswerSubmit(answer, modalMode);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};

CommentModal.propTypes = {
  answer: PropTypes.string.isRequired,
  handleAnswerSubmit: PropTypes.func.isRequired,
  handleAnswerChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  modalMode: PropTypes.string.isRequired,
};

export default CommentModal;
