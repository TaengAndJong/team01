import Btn from "@util/reuseBtn.jsx";
import axios from "axios";
import { handleFileDownload } from "@util/fileDownload.jsx";
import "@assets/css/board/adminBoard.css";
// import CommentModal from "@pages/common/board/commentModal.jsx";
// import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

const AdminDetailBoard = ({ userType }) => {
  const { category, boardId } = useParams();
  const [searchParams] = useSearchParams();
  const [board, setBoard] = useState();
  const navigate = useNavigate();
  const userId = searchParams.get("userId"); // 쿼리 파라미터 사용
  // const [modalOpen, setModalOpen] = useState(false); // 모달 창 여닫기
  // const [modalMode, setModalMode] = useState("create"); // 모달 창 분기용 모드
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

  return (
    <div>
      <div className=" title-dotted">
        <span className="detail-title">제목 :</span>
        <span>{board?.qnaTitle}</span>
      </div>
      <div className="m-2 detail-date ">
        <span className="p-2">작성일 :</span>
        <span>{board?.qnaDate}</span>
      </div>
      <div className="m-4 content-box">
        <div>{board?.qnaContent}</div>
      </div>
      <div className="border border-secondary attachment-box">
        <strong className="p-2 text-#333">원본 첨부파일</strong>
        <strong className="text-danger">{board?.attachmentList.length}</strong>
        {board?.attachmentList?.map((file, idx) => {
          return (
            <span
              key={idx}
              className="attachment-list"
              onClick={() => {
                handleFileDownload(file?.fileName, file?.fileData);
              }}
            >
              {file.fileName}
            </span>
          );
        })}
        <span
          className="attachment-list"
          onClick={() => {
            handleFileDownload();
          }}
        ></span>{" "}
        {/*첨부파일 이름*/}
      </div>
      <div className="comment-box">
        <div>{board?.comment || <span>답변을 등록해 주세요.</span>}</div>
        <div>
          <Btn className="btn custom-btn00" text="답변 등록" />
        </div>
      </div>

      <div>
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
