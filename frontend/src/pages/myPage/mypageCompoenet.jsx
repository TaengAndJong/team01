import LeftMenu from "../../layout/LeftMenu.jsx";
import {Link, Outlet, useLocation} from "react-router-dom";
import React from "react";
import {BookDispatchContext, BookStateContext} from "../book/bookComponent.jsx";
import {menuNavi} from "../../util/menuNavi.jsx";
import {useMenu} from "../common/MenuContext.jsx";


const Mypage = () => {

    const {currentPath}  = useMenu();
    console.log("currentPath",currentPath);

    //마이페이지 타이틀 동적 설정 함수
    const mypageTile=(currentPath)=>{
        //마지막 주소값 받도록
        const lastPathArr = currentPath.split("/"); // 주소값을 "/"  기준으로 배열반환
        const lastPathNm= lastPathArr[lastPathArr.length-1] // 제일 마지막 배열값 인덱스 설정
       //switch 문으로 제목 지정
        switch(lastPathNm){
            case "personal":
                return "개인정보";
                break;
            case "address":
                return "배송지";
                break;
            case "payment":
                return "결제내역";
                break;
            case "wishlist":
                return "찜목록";
                break;
            default:
                return "마이페이지";
        }
    }


    return(
        <>
            <div className="hoverLeaf"></div>

            <div className="page mypage d-flex">
                <div className="left">
                    <aside id="sidebar" className="left-menu">
                        <div className="left-title">
                            {/*현재경로의 부모 1차메뉴 이름*/}
                            <h4 className="sub-title first-title title-border">
                                {mypageTile(currentPath)}
                            </h4>
                        </div>

                        <ul className="depth first-depth">

                            <li>
                                <Link to="personal"
                                      className={`depth-menu first ${currentPath.includes("personal") ? "current" : ""}`}>
                                    개인정보
                                    <i className="leaf icon"></i>
                                </Link>

                            </li>
                            <li>
                                <Link to="address"
                                      className={`depth-menu first ${currentPath.includes("address") ? "current" : ""}`}>
                                    배송지
                                    <i className="leaf icon"></i>
                                </Link>

                            </li>
                            <li>
                                <Link to="payment"
                                      className={`depth-menu first ${currentPath.includes("payment") ? "current" : ""}`}>
                                    결제내역
                                    <i className="leaf icon"></i>
                                </Link>

                            </li>
                            <li>
                                <Link to="wishlist"
                                      className={`depth-menu first ${currentPath.includes("wishlist") ? "current" : ""}`}>
                                    찜목록
                                    <i className="leaf icon"></i>
                                </Link>
                            </li>

                        </ul>

                    </aside>
                </div>

                {/*링크이동할 사이드메뉴 */}
                <div className="right">
                    <section className="content">
                        <div className="content-inner custom-border">

                            {/*오른쪽 컨텐츠*/}

                        </div>
                    </section>
                </div>
            </div>

        </>
    )
}

export default Mypage;