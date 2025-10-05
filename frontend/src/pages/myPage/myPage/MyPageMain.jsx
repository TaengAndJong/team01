import RecentView from "./recentView.jsx";
import "@css/mypage/mypageDash.css";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import {useMenu} from "../../common/MenuContext.jsx";

const MyPageMain = () => {
  //slide Data , 최근 10일정도의 찜목록 , 문의내역, 결제내역 건수
  const { menu,currentPath } = useMenu();
  console.log("currentPath",currentPath);

  let clientHome = menu?.clientList?.find(
      (item) => item.menuId === "main"
  )?.menuPath;

  const [payCnt, setPayCnt] = useState(0);
  const [qnaCntList, setQnaCntList] = useState([]);
  const [userViewBooks, setUserViewBooks] = useState([]);
  const [wishCnt, setWishCnt] = useState(0);

  const dashFetch = async () => {
    try {
      const response = await axios.get("/api/mypage/mypageDashBoard");
      const { payCnt, qnaCntList, userViewBooks, wishCnt } = response.data;

      setPayCnt(payCnt);
      setQnaCntList(qnaCntList);
      setUserViewBooks(userViewBooks);
      setWishCnt(wishCnt);

    } catch (error) {
      console.error("대시보드 데이터 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    dashFetch();
  }, []); //빈 배열 , 마운트 시에만 한 번 렌더


  console.log("payCnt",payCnt);
  console.log("qnaCntList", qnaCntList, );
  console.log(" userViewBooks",userViewBooks); //  배송,1:1, 상품문의 각각 데이터 있음
  console.log(" wishCnt",wishCnt);


  return (
    <>
      <div className="mypage-dash">
        <div className="inner left">
          <ol className="menu-navi d-flex title-border">
            {/* 서브페이지 네비게이션 */}
            <li>
              <Link to={clientHome} className="home icon">
                <span className="sr-only">홈</span>
              </Link>
            </li>
            <li>
              <strong className="title d-inline-block">
              최근 본 도서목록
              </strong>
            </li>
          </ol>

          <RecentView slideData={userViewBooks}/>
        </div>
        <div className="inner right mt-4">
          <ul className="box-list d-flex flex-wrap">
            <li className="li green">
              <strong className="title">찜목록</strong>
              <span className="count ms-auto fw-bold">
               <em>{wishCnt}</em>건
              </span>
            </li>
            <li className="li red">
              <strong className="title">결제내역</strong>
              <span className="count ms-auto fw-bold">
                 <em>{payCnt}</em>건
              </span>
            </li>
            <li className="li yellow">
              <strong className="title d-block">문의내역</strong>
              <span className="count ms-auto fw-bold">
                        <em>{qnaCntList.totalCnt}</em>건
              </span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default MyPageMain;
