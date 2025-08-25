import Btn from "@util/reuseBtn.jsx";
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { handleFileDownload } from "@util/fileDownload.jsx";
import "@assets/css/board/adminBoard.css";

const DetailBoard = ({ userType }) => {
  // console.log("🔥 DetailBoard 컴포넌트 렌더링됨!");
  const navigate = useNavigate();
  const { category, boardId } = useParams();
  const [searchParams] = useSearchParams();
  const [answer, setAnswer] = useState("");

  const userId = searchParams.get("userId");
  // console.log("DetailBoard category", category);
  // console.log("DetailBoard boardId", boardId);
  // console.log("DetailBoard userId", userId);
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

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
    console.log("답변", answer);
  };

  const handleAnswerSubmit = (answer) => {
    axios
      .post(`/api/admin/board/detail/comment/${category}/${boardId}`, {
        answerContent: answer,
      })
      .then((res) => {
        console.log("답변 등록 성공", res);
      });

    console.log("답변 등록", answer);
  };

  if (data)
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
                <Btn
                  text="목록"
                  onClick={() => navigate(`/admin/board/${category}Board`)}
                />
                <Btn text="삭제" />
              </div>
            </div>
            {userType === "admin" && (
              <div className="adminAnswer_container">
                <textarea
                  className="adminAnswer_textarea"
                  value={answer}
                  placeholder="답변을 입력해주세요."
                  onChange={handleAnswerChange}
                ></textarea>
                <div>
                  <Btn
                    text="답변 등록"
                    onClick={() => handleAnswerSubmit(answer)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
};

export default DetailBoard;
