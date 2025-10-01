import RecentViewSlide from "./recentViewSlide.jsx";
import "@css/mypage/mypageDash.css";
import { useEffect } from "react";
import axios from "axios";

const MyPageMain = () => {
  //slide Data , 최근 10일정도의 찜목록 , 문의내역, 결제내역 건수
  //한꺼번에 promiseAll.로 비동기 받아서 데이터 나눠서 뿌리기 ?

  const dashFetch = async () => {
    const response = await axios.get("/api/mypage/mypageDashBoard");
    console.log("dashFetch-----------------마이페이지 대시보드", response.data);

    return response.data;
  };

  useEffect(() => {
    dashFetch();
  }, []); //빈 배열 , 마운트 시에만 한 번 렌더

  return (
    <>
      <div className="mypage-dash">
        <div className="inner left">
          <strong className="title d-inline-block mb-4">
            최근 본 도서목록
          </strong>
          <ul className="recent-slide box-list">
            <li className="li gray">1</li>
            <li className="li gray">2</li>
            <li className="li gray">3</li>
            <li className="li purple">4</li>
          </ul>
          {/*<RecentViewSlide slideData={null}/>*/}
        </div>
        <div className="inner right">
          <ul className="box-list d-flex flex-wrap">
            <li className="li green">
              <strong className="title">찜목록</strong>
              <span className="count ms-auto fw-bold">
                <em>10</em>건
              </span>
            </li>
            <li className="li yellow">
              <strong className="title">문의내역</strong>
              <span className="count ms-auto fw-bold">
                <em>10</em>건
              </span>
            </li>
            <li className="li red">
              <strong className="title">결제내역</strong>
              <span className="count ms-auto fw-bold">
                <em>10</em>건
              </span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default MyPageMain;
