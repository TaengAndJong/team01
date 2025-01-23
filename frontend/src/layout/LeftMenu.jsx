import Btn from "../util/reuseBtn.jsx"

const LeftMenu = () => {

    return (

        <div className="left">
            <ul className="side_menu">
                <li>
                    <Btn ></Btn>
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
    )
}