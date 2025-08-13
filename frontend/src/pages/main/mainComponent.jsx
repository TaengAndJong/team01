import "@assets/css/main.css";
import { Link } from "react-router-dom";
import MainBookSlide from "./components/mainBookSlide.jsx";
// import SectionMain from "./components/sectionMain.jsx";
// import SectionBooks from "./components/sectionBooks.jsx";
// import SectionSkipBtns from "./components/sectionSkipBtns.jsx";
// import SectionCuration from "./components/SectionCuration.jsx";
import { useEffect, useState } from "react";
import axios from "axios";

const mainComponent = () => {
  const [books, setBooks] = useState([]); // slide data 배열로 초기값
  //const [crData,setCrData] = useState([]); // slide data 배열로 초기값

  const booksFecth = async () => {
    //axios 요청 보내기
    //api, { bookSlide: true} , api?bookSlide 이런식으로 보내서 컨트롤러에서 매핑처리하기 ( 시큐리티에 안걸림)
    try {
      const response = await axios.get("/api", {
        params: {
          bookSlide: true,
        },
      });
      console.log("response data", response.data);
      setBooks(response.data);
    } catch (e) {
      console.log("booksFetch 에러");
      console.error(e);
    }
  };

  const curationFecth = async () => {
    //axios 요청 보내기
    try {
      const response = await axios.get("/api", {
        params: { curation: true },
      });
      console.log("response data", response.data);
    } catch (e) {
      console.log("curationFecth 에러");
      console.error(e);
    }
  };

  //마운트 시 1번 실행
  useEffect(() => {
    console.log("main 컴포넌트 마운트시작");
    booksFecth();
    curationFecth();
    console.log("main 컴포넌트 마운트끝");
  }, []);

  return (
    <>
      {/* 메인*/}
      <SectionMain />
      {/*도서 슬라이드*/}
      <SectionBooks slideData={books || []} />
      {/* 문의, 위시리스트 , 회원가입 */}
      <SectionSkipBtns />
      {/*인기도서 & 추천도서 */}
      <SectionCuration />
    </>
  );
};

export default mainComponent;
