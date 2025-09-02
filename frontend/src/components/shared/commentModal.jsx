import Btn from "@util/reuseBtn.jsx";
import PropTypes from "prop-types";

const CommentModal = ({
  answer,
  setModalOpen,
  handleAnswerSubmit,
  handleAnswerChange,
}) => {
  return (
    <div>
      <div>
        <textarea value={answer} onChange={handleAnswerChange} />
        <Btn
          text="등록"
          onClick={() => {
            handleAnswerSubmit(answer);
            setModalOpen(false);
          }}
        />
      </div>
    </div>
  );
};

CommentModal.propTypes = {
  answer: PropTypes.string.isRequired,
  handleAnswerSubmit: PropTypes.func.isRequired,
  handleAnswerChange: PropTypes.func.isRequired,
};

export default CommentModal;
