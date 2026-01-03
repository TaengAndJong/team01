import "@assets/css/main.css";
import { Link } from "react-router-dom";
import MainBookSlide from "./components/mainBookSlide.jsx";
import SectionMain from "./components/sectionMain.jsx";
import SectionBooks from "./components/sectionBooks.jsx";
import SectionSkipBtns from "./components/sectionSkipBtns.jsx";
import SectionCuration from "./components/SectionCuration.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import {useAuth} from "../common/AuthContext.jsx";

const mainComponent = () => {

  const [books, setBooks] = useState([]); // slide data 배열로 초기값
  const [recom,setRecom ] = useState([]);
  const [popular,setPopular ] = useState([]);
  const booksFecth = async () => {
    //axios 요청 보내기
    //api, { bookSlide: true} , api?bookSlide 이런식으로 보내서 컨트롤러에서 매핑처리하기 ( 시큐리티에 안걸림)
    try {
      const response = await axios.get("/api", {
        params: {
          bookSlide: true,
        },
      });
      console.log("response data-----main booksFecth", response.data);
      const {bookSlide,popularSlide,recomSlide} = response.data;


      //단축 평가(short-circuit evaluation)로 ,
      // JS의 논리 연산자 &&와 ||가 왼쪽 피연산자의 값만으로도 결과가 결정되면
      // 오른쪽을 평가하지 않는 성질을 이용한 패턴
      bookSlide && setBooks(bookSlide ?? []); // 왼쪽피연산자가 true이면  setBooks를 호출
      popularSlide && setPopular(popularSlide ?? []);
      recomSlide && setRecom(recomSlide ?? []);

      //setBooks(response.data);
    } catch (e) {
      console.log("booksFetch 에러");
      console.error(e);
      // 에러 시에도 안전하게 기본값 세팅
      setBooks( []);
      setPopular([]);
      setRecom([]);
    }
  };

  // const curationFecth = async () => {
  //   //axios 요청 보내기
  //   try {
  //     const response = await axios.get("/api", {
  //       params: { curation: true },
  //     });
  //     console.log("response data------main curationFecth", response.data);
  //   } catch (e) {
  //     console.log("curationFecth 에러");
  //     console.error(e);
  //   }
  // };


  //마운트 시 1번 실행
  useEffect(() => {
    console.log("main 컴포넌트 마운트시작");
    booksFecth();

    console.log("main 컴포넌트 마운트끝");
  }, []);

  return (
    <>
      {/* 메인*/}
      <SectionMain />
      {/*도서 슬라이드*/}
      <SectionBooks slideData={books} />
      {/*인기도서 & 추천도서 */}
      <SectionCuration popularData={popular} recomData={recom} />
      {/* 문의, 위시리스트 , 회원가입 */}
      <SectionSkipBtns />
    </>
  );
};

export default mainComponent;
