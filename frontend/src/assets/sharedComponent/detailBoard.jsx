import Btn from "@util/reuseBtn.jsx";
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
        setData(JSON.parse(response.data));
        console.log("DetailBoard data", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [category, boardId, userId]);

  if (!data)
    return (
      <div
        style={{
          padding: "20px",
          background: "yellow",
          border: "2px solid red",
        }}
      >
        <h1>🎯 DetailBoard 컴포넌트 렌더링 성공!</h1>
        <p>Category: {category}</p>
        <p>BoardId: {boardId}</p>
        <p>UserId: {userId}</p>
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
    );
};

export default DetailBoard;
