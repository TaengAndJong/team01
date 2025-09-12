import Btn from "@util/reuseBtn.jsx";
import PropTypes from "prop-types";

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
    <div>
      <div>
        <h2>{title}</h2>
        <textarea value={answer} onChange={handleAnswerChange} />
        <Btn
          text={buttonText}
          onClick={() => {
            handleAnswerSubmit(answer, modalMode);
            onClose();
          }}
        />
      </div>
      <span onClick={onClose} style={{ cursor: "pointer" }}>
        X
      </span>
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
