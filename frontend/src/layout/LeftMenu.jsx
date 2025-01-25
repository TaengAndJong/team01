import Btn from "../util/reuseBtn.jsx"
import Admin from "../pages/admin/adminCoponent.jsx";
import PathData from "../assets/pathsData.jsx"


const LeftMenu = () => {

    return (
<>
        <div className="left">
            <div className="depth depth1">
                <h3>게시판</h3>
                <ul className="depth depth2">
                    <li>
                        <button onClick={() => handleMenuClick("delivery")}>배송문의</button>
                    </li>
                    <li>
                        <button onClick={() => handleMenuClick("product")}>상품문의</button>
                    </li>
                    <li>
                        <button onClick={() => handleMenuClick("qna")}>1:1문의</button>
                    </li>
                </ul>
            </div>
            <div className="depth depth1">
                <h3>도서관리</h3>
                <ul className="depth depth2">
                    <li>
                        <button onClick={() => handleMenuClick("product")}>도서조회</button>
                    </li>
                    <li>
                        <button onClick={() => handleMenuClick("delivery")}>도서등록</button>
                    </li>
                </ul>
            </div>

        </div>
</>
    )
}

export default LeftMenu;