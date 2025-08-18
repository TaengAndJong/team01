import Btn from "@util/reuseBtn.jsx";
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { handleFileDownload } from "@util/fileDownload.jsx";
import "@assets/css/board/adminBoard.css";

const DetailBoard = () => {
  console.log("🔥 DetailBoard 컴포넌트 렌더링됨!");
  const navigate = useNavigate();
  const { category, boardId } = useParams();
  const [searchParams] = useSearchParams();

  const userId = searchParams.get("userId");
  console.log("DetailBoard category", category);
  console.log("DetailBoard boardId", boardId);
  console.log("DetailBoard userId", userId);
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/admin/board/detail/${category}/${boardId}?userId=${userId}`
        );
        setData(response.data);
        console.log("DetailBoard data", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [category, boardId, userId]);

  if (data)
    return (
      <>
        <div className="boardDetailLayout">
          <div className="boardDetail">
            <div className="boardDetail-header">
              <div className="boardDetail-title">
                <h1>{data.qnaTitle}</h1>
              </div>
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
                <Btn
                  text="목록"
                  onClick={() => navigate(`/admin/board/${category}Board`)}
                />
                <Btn text="삭제" />
                <Btn text="수정" />
                <Btn text="답변 등록" />
              </div>
            </div>
            <div></div>
            <div></div>
          </div>
        </div>
      </>
    );
};

export default DetailBoard;
