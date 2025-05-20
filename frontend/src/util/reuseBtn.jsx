import { useState } from "react";
import { useNavigate } from "react-router-dom"


const Button = ({text, type, onClick, className, id,isLoading, isDisabled, confirmMessage, path,}) => { // 버튼 태그에 들어가는 매개 변수 className: Name 지정, type: 버튼 타입, onClick: 클릭 이벤트, text: 버튼 내용,

    // 버튼 타입 초기 값 = submit,reset includes 함수로 컴포넌트가 제대로 작동하도록 기본값을 설정,
    const btnType = ["submit","reset"].includes(type) ? type : "button";

    const navigate = useNavigate(); // useNavigate 선언
    const [loading, setLoading] = useState(isLoading); // useState 선언

    const handleClick = async (e) => { // path 값 = true 페이지 이동, path 값 = false 사용자가 작성한 이벤트 실행
        try{
            if (confirmMessage && !window.confirm(confirmMessage)) return;

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
            className={`btn ${className}`}
            id={`${id}`}
            type={btnType}
            onClick={handleClick}
            disabled={isDisabled || isLoading}
        >
            {isLoading ?  text : text}
        </button>)
}


export default Button;
//
