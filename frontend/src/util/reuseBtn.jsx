import { useState } from "react";
import { useNavigate } from "react-router-dom"


const Button = ({text, type, onClick, className, isLoading, isDisabled, confirmMessage, path,}) => { // 버튼 태그에 들어가는 매개 변수 className: Name 지정, type: 버튼 타입, onClick: 클릭 이벤트, text: 버튼 내용,

    // 버튼 타입 초기 값 = submit, includes 함수로 컴포넌트가 제대로 작동하도록 기본값을 설정,
    const btnType = [
        //기본 버튼
        "search",//검색
        "cart",//장바구니
        "buy-now", // 구매
        "wishlist",//위시리스트
        "filter",//???
        "list", //목록
        "view-details",//상세보기
        //관리자 버튼
        "add",//추가
        "approve", //승인
        "edit",//생성
        "delete",//삭제
        "order",//주문
        "register", //등록
        //기타 버튼
        "login",
        "logout",
        "contact",
        "submit",//제출
        ].includes(type) ? type : "button";

    const navigate = useNavigate(); // useNavigate 선언
    const [loading, setLoading] = useState(isLoading); // useState 선언

    const handleClick = async (e) => { // path 값 = true 페이지 이동, path 값 = false 사용자가 작성한 이벤트 실행
        try{
            if (confirmMessage && !window.confirm(confirmMessage)) return;

        // 기존코드
        // if (path) {
        //     navigate(path); // 경로 이동
        // } else if (onClick) {
        //     onClick(e); // onClick 실행
        // }

        // 수정된 코드
        if (path) {
            navigate(path);
        } else if (onClick && !isLoading) {
            setLoading(true);
            await onClick(e);
        }
        } catch (err){
            console.error("Error executing onClick:", err);
        }finally {
            setLoading(false)
        }
    };

    return (
        <button
            className={className}
            id={`${btnType}Btn`}
            type={btnType}
            onClick={handleClick}
            disabled={isDisabled || isLoading}
        >
            {isLoading ?  text : text}
        </button>)
}


export default Button;