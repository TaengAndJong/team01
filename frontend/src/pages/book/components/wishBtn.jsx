import React, { useState } from "react";
import { useAuth } from "../../common/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../common/modal/ModalContext.jsx";
import { catchError } from "../../../util/error/error.jsx";
import axios from "axios";

const WishBtn = ({ wishIds, setWishIds, bookId }) => {
  // 로그인 여부
  const { isAuthenticated } = useAuth(); //
  //이동
  const navigate = useNavigate();
  //모달
  const { openModal, closeModal } = useModal();
  //서버에서 클라이언트까지 응답이 도달할 때까지의 상태관리
  const [isLoading, setIsLoading] = useState(false);

  // console.log("isAuthenticated",isAuthenticated);
  // console.log("wishIds",wishIds);

  //찜목록 비동기 fetch 요청
  const wishFetch = async (bookId) => {
    //   console.log("wishFetch --- 진입")
    // bookId는 쿼리스트링보다 body 에 담아주는게 더 나음
    const UrlSearchParams = new URLSearchParams();
    UrlSearchParams.append("bookId", bookId);
    // console.log("bookId wishList",bookId);

    try {
      //경로에 bookId 담아서 보내기
      const response = await axios.post(
        `/api/mypage/wishlist/save?${UrlSearchParams.toString()}`,
        { bookId: bookId }
      );

      // console.log("찜목록 페치 응답",response);

      if (response.status === 200) {
        // wishIds 값 재설정할 때에 이전 상태값에 대해서 bookId가 있는 지 확인후 동일한 bookId 이면 필터링해서 새배열반환, 없으면 기존배열을 복사 후 bookId 추가
        setWishIds((prev) => {
          // 이전 상태값에 bookId가 있는지 확인
          const existId = prev.includes(bookId);

          // 찜목록 모달 분기 기준 (이미 담겨져 있을경우 재요청은 찜해제요청)
          if (existId) {
            openModal({
              modalType: "error",
              content: (
                <>
                  <p>찜목록 삭제 성공.</p>
                </>
              ),
              onConfirm: () => {
                closeModal();
              },
            });
            // 기존 존재하는 아이디를 제외하고 배열 반환
            return prev.filter((id) => id !== bookId); // 제거;
          } else {
            // 존재하지 않는다면 추가 (찜목록 추가)
            openModal({
              modalType: "error",
              content: (
                <>
                  <p>찜목록에 추가되었습니다.</p>
                </>
              ),
              onConfirm: () => closeModal(),
            });
            // 기존 배열에 새로운 찜목록 도서 아이디 추가
            return [...prev, bookId];
          }
        });
      }
    } catch (err) {
      //에러 처리 핸들러
      catchError(err, { openModal, closeModal });
    }
    //wishFetch 엔드
  };

  //찜목록 핸들러
  const wishHandler = async (bookId) => {
    // 클릭하면 selected 클래스 추가,
    //찜버튼 누르면 전송 되기 전까지 disable 되게  해야하나?
    if (isLoading) return; // 클라이언트가 서버로 정보 요청 중이면 중단
    setIsLoading(true); // 클라이언트가 서버로 요청 중

    /*  withCredentials: true
     *  CORS 로 설정되어 있으면, 기존 프론트 포트와 백엔드 포트가 다르고
     * 기본적으로 쿠키가 포함되어있지 않기 때문에
     * withCredentials: true 설정을 통해 쿠키를 같이 비동기 요청에 담아
     * 서버에서 세션 정보를 확인하고 서버에서 쿠기기반 세션확인을 통해 로그인 상태 인증을 가능하게 함
     *  */

    //bookId를 받아서 비동기요청, 컨트롤러로 전송
    try {
      if (!isAuthenticated) {
        openModal({
          modalType: "confirm",
          content: (
            <>
              <p>로그인페이지로 이동하시겠습니까?</p>
            </>
          ),
          onConfirm: () => {
            closeModal();
            navigate("/login");
          },
        });

        return;
      } else {
        //로그인 중인지  세션 체크검증필요
        const response = await axios.get("/api/auth", {
          withCredentials: true,
        });
        //console.log("response status",response);

        if (response.status === 200) {
          // console.log("찜목록 페치요청 보내는 듕");
          // console.log("엑시오스 찜목록 버튼",response.status);
          await wishFetch(bookId);
        }
      }
    } catch (err) {

      //에러 처리 핸들러
      catchError(err, { openModal, closeModal, navigate });
    } finally {
      setIsLoading(false); // 응답 완료되면 다시 클릭 가능하게 설정
    }
  };

  return (
    <>
      <button
        type="button"
        className={`submit btn me-2 icon wish ${
          wishIds.includes(bookId) ? "selected" : ""
        }`}
        onClick={() => wishHandler(bookId)}
      >
        <span className="sr-only">위시리스트에 담기</span>
      </button>
    </>
  );
};

export default WishBtn;
