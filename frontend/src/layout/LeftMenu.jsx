
import {Link} from "react-router-dom";


const LeftMenu = () => {

    return (

        <>

            <aside id="left-menu">
                <ul className="depth fist-depth">
                    <li className="dropdown">
                        {/*2차메뉴 있으면 이동 막고 2차메뉴 첫번재링크로 이동 */}
                        <button type="button" className="btn dropdown-toggle" title="1차메뉴 닫힘">
                            게시판
                        </button>
                        <ul className="depth second-depth dropdown-menu">
                            <li>
                                <Link to="/admin/board/oneBoard" className="link dropdown-item">1:1문의</Link>
                            </li>
                            <li>
                                <Link to="/admin/board/deliveryBoard" className="link dropdown-item">배송문의</Link>
                            </li>
                            <li>
                                <Link to="/admin/board/productBoard" className="link dropdown-item">상품문의</Link>
                            </li>
                        </ul>
                    </li>
                </ul>
                <ul className="depth fist-depth">
                    <li>
                        {/*2차메뉴 있으면 이동 막고 2차메뉴 첫번재링크로 이동 */}
                        <button className="btn dropdown">도서관리</button>
                        <ul className="depth second-depth">
                            <li>
                                <Link to="/admin/book/bookList" className="btn">도서조회</Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </aside>
            <section id="content">
                컨텐츠
            </section>
        </>

    )
}

export default LeftMenu;