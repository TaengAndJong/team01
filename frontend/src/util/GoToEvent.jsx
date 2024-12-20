import { useNavigate } from "react-router-dom";

const GotoEvent = () => {
    const navigate = useNavigate();

    const goToPage = (path = "/") => {
        // path = "/" 디폴트 값 설정
        navigate(path);
    };

    return {
        goToPage,
    };
};

export default GotoEvent;
