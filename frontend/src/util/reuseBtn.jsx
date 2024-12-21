import { useState } from "react";
import { useNavigate } from "react-router-dom"
import GoToEvent from "./goToEvent.jsx";

const Button = ({text, type, onClick, className, isLoading, isDisabled, confirmMessage, path,}) => { // 버튼 태그에 들어가는 매개 변수 className: Name 지정, type: 버튼 타입, onClick: 클릭 이벤트, text: 버튼 내용,

    // 버튼 타입 초기 값 = submit, includes 함수로 컴포넌트가 제대로 작동하도록 기본값을 설정,
    const btnType = [
        //기본 버튼
        "search",
        "add-to-cart",
        "buy-now",
        "wishlist",
        "remove",
        "checkout",
        "filter",
        //관리자 버튼
        "add-book",
        "edit-book",
        "delete-book",
        "manage-orders",
        "approve",
        //기타 버튼
        "login",
        "logout",
        "register",
        "contact",
        "submit",
        "view-details"].includes(type) ? type : "default";

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
            id={`${type}`}
            type={type}
            onClick={handleClick}
            disabled={isDisabled || isLoading}
        >
            {isLoading ?  text : text}
        </button>)
}


export default Button;