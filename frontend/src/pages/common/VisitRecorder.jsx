import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { recordVisit } from "@util/visitCount";

const VisitRecorder = () => {
  const location = useLocation();

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData?.roles?.includes("ROLE_ADMIN")) return;

    recordVisit(location.pathname);
  }, [location.pathname]); // 페이지가 바뀔 때만 호출

  return null; // UI 렌더링은 없음
};

export default VisitRecorder;
