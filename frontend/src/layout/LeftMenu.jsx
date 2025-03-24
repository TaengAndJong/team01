
import {Link} from "react-router-dom";
import {leftFirstMenuToggle} from "../js/subLayout.js";

const LeftMenu = () => {

    return (

        <>

            <aside id="sidebar" className="left-menu">
                <div className="left-title">
                    {/*현재경로의 부모 1차메뉴 이름*/}
                    <h4 className="sub-title first-title title-border">도서관리</h4>
                </div>

                <ul className="depth first-depth">
                    <li className="">
                        {/*2차메뉴 있으면 이동 막고 2차메뉴 첫번재링크로 이동 */}
                        <button type="button" className="depth-menu first"  onClick={leftFirstMenuToggle} >
                        {/*<button type="button" className="depth-menu first current" title="1차메뉴 열림" onClick={leftFirstMenuToggle} onFocus={leftMenuFocus} onBlur={leftMenuBlur}>*/}
                            게시판
                            <i className="arrow circle-arrow"></i>
                        </button>
                        <ul className="depth second-depth">
                            <li>
                                <Link to="/admin/board/oneBoard" className="depth-menu second">1:1문의</Link>
                            </li>
                            <li>
                                <Link to="/admin/board/deliveryBoard" className="depth-menu second">배송문의</Link>
                            </li>
                            <li>
                                <Link to="/admin/board/productBoard" className="depth-menu second">상품문의</Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        {/*2차메뉴 있으면 이동 막고 2차메뉴 첫번재링크로 이동 */}
                        <button type="button" id="first-menu" className="depth-menu first" title="1차메뉴 닫힘" onClick={leftFirstMenuToggle}>
                            도서관리
                            <i className="arrow circle-arrow"></i>
                        </button>
                        <ul className="depth second-depth">
                            <li>
                                <Link to="/admin/book/bookList" id="second-menu" className="depth-menu second">도서조회</Link>
                            </li>
                        </ul>
                    </li>
                </ul>

            </aside>

        </>

    )
}

export default LeftMenu;