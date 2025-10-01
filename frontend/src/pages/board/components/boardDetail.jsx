// import Btn from "@util/reuseBtn.jsx";
import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
const BoardDetail = ({ userType }) => {
  const { category, boardId } = useParams();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId"); // 쿼리 파라미터 사용
  useEffect(() => {
    console.log("🔥 DetailBoard 렌더링됨!");
    console.log(category, boardId, userId, userType);
    console.log("상세조회 api 호출 시작");
    const url = `/api/board/${category}/detail//${boardId}`;
    console.log("url", url);
    const fetchData = async (userId) => {
      try {
        const response = await axios.get(url, {
          params: { userId: userId },
        });
        console.log("상세 데이터:", response.data);
        return response.data;
      } catch (err) {
        console.log(err);
      }
    };
    fetchData(userId);
  }, [category, boardId, userId, userType]);
  return (
    <div>
      <h3>상세 게시물 페이지</h3>
      <p>카테고리: {category}</p>
      <p>게시물ID: {boardId}</p>
      <p>사용자ID: {userId}</p>
      <p>유저 타입: {userType}</p>
    </div>
  );
};

export default BoardDetail;
