import { useEffect, useState } from "react";
import QnAList from "./components/qnaList.jsx";
const qnaComponent = () => {
  // const [isLogin, setIsLogin] = useState(""); // 로그인 데이터 확인

  const [data, setData] = useState(null);

  useEffect(() => {
    
    const userId = localStorage.getItem("userData").clientId;
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/test/qnaList?userId=${userId}`, {
          method: "GET",
        });
        const result = await response.json();
        setData(result);
      
      } catch (err) {
        //에러처리
        console.error("err", err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div>
        {data ? (
          <span>
            데이터 : {data ? JSON.stringify(data) : "No Data Available"}
          </span> // Display a specific field from the data
        ) : (
          <span>Loading...</span>
        )}
        <QnAList />
      </div>
    </>
  );
};

export default qnaComponent;
