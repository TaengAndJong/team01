// import Btn from "@util/reuseBtn.jsx";
// import { useState, useEffect } from "react";
// import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
// import { handleFileDownload } from "@util/fileDownload.jsx";
// import "@assets/css/board/adminBoard.css";
// import CommentModal from "@pages/common/board/commentModal.jsx";
// import PropTypes from "prop-types";

import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const AdminDetailBoard = ({ userType }) => {
  const { category, boardId } = useParams();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId"); // 쿼리 파라미터 사용
  // const [modalOpen, setModalOpen] = useState(false); // 모달 창 여닫기
  // const [modalMode, setModalMode] = useState("create"); // 모달 창 분기용 모드
  useEffect(() => {
    console.log("🔥 AdminDetailBoard 렌더링됨!");
    console.log({ category, boardId, userId, userType });
    console.log("상세조회 api 호출 시작");
    const url = `/api/${userType}/board/detail/${category}/${boardId}`;
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

export default AdminDetailBoard;
