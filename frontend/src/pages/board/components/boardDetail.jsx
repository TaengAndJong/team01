// import Btn from "@util/reuseBtn.jsx";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Btn from "@util/reuseBtn.jsx";
import axios from "axios";
import "@css/board/userBoardDetail.css";
import { handleFileDownload } from "@util/fileDownload.jsx";
import { formatToDate } from "@util/dateUtils.jsx";

const BoardDetail = ({ userType }) => {
  const { category, boardId } = useParams();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId"); // 쿼리 파라미터 사용
  const [board, setBoard] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    console.log("🔥 DetailBoard 렌더링됨!");
    console.log(category, boardId, userId, userType);
    console.log("상세조회 api 호출 시작");
    const url = `/api/board/${category}/detail/${boardId}`;
    console.log("url", url);
    const fetchData = async (userId) => {
      try {
        const response = await axios.get(url, {
          params: { userId: userId },
        });
        console.log("상세 데이터:", response.data);
        setBoard(response.data);
        return response.data;
      } catch (err) {
        console.log(err);
      }
    };
    fetchData(userId);
  }, [category, boardId, userId, userType]);
  console.log(board);

  //카테고리 별 문의 이름 바꾸기
  return (
    <div className="board-detail">
      <div className="boardInfo card-body">
        <div className="info-header clearfix">
          <h3 className="board-title title-dotted  d-flex align-items-center">
            <i className="icon qna me-3"></i>
            {board?.qnaTitle}
          </h3>
          <span className="detail-date tultip uncomplete float-end d-inline-block">
            <i className="sr-only">작성일</i>
            {formatToDate(new Date(board?.qnaDate))}
          </span>
        </div>
        <div className="content-box p-4 text-left">{board?.qnaContent} </div>
        <div className="attachment-box border-top  d-block p-4">
          <strong className="py-2 d-inline-block">원본 첨부파일</strong>
          <span className="mx-2 fw-bold">
            <em className="text-danger ">{board?.attachmentList.length}</em>개
          </span>
        </div>
        {board?.attachmentList.length > 0 && (
          <ol className="file-list px-4  list">
            {board?.attachmentList?.map((file, idx) => {
              return (
                <li
                  key={idx}
                  className="d-flex align-items-center mb-2 bullet-li"
                >
                  <button type="button" className="btn btn-link d-inline-flex align-items-center"
                          title={`${file?.fileName} 다운로드 버튼`}
                          onClick={() => {
                            handleFileDownload();
                          }}
                  >
                    <i className="icon down me-3"></i>
                    <strong
                        className="fw-bold me-2"
                        onClick={() => {
                          handleFileDownload(file?.fileName, file?.fileData);
                        }}
                    >
                      {file.fileName}
                    </strong>
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {board?.comment ? (
          <div className="comment-container">
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center comment-title">
              <strong>관리자 답변</strong>
              <span className="tultip">
                {board.comment.comWriterName}({board.comment.comWriter})
              </span>
            </div>
            <div className="comment-box p-4 mb-4 text-left">
              {board?.comment.commentCon}
            </div>
          </div>
        </div>
      ) : (
        <p className="bg-warning-subtle p-3 mb-4">답변 대기중 입니다.</p>
      )}

      <div className="d-grid gap-2 d-md-flex justify-content-md-end pt-4 border-top">
        <Btn
          className="btn custom-btn01"
          text="목록"
          onClick={() => navigate(`/board/${category}Board`)}
        />
      </div>
    </div>
  );
};

export default BoardDetail;
