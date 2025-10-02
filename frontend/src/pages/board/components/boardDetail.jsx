// import Btn from "@util/reuseBtn.jsx";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Btn from "@util/reuseBtn.jsx";
import axios from "axios";
import "@css/board/userBoardDetail.css";
import { handleFileDownload } from "@util/fileDownload.jsx";

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
        {board?.comment || <span>답변 대기중 입니다.</span>}
      </div>

      <div>
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
