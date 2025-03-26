
import {Outlet} from "react-router-dom";
import React from "react";
import LeftMenu from "../../layout/LeftMenu.jsx";
import {useMenu} from "../common/MenuContext.jsx";
import {BookDispatchContext, BookStateContext} from "../adminBook/adminBookComponent.jsx";


const AdminBoard = () => {

    const {menu,currentPath,standardPoint}  = useMenu();


    return(
        <>
            <div className="page d-flex">
                <div className="left">
                    <LeftMenu menu={menu}/>
                </div>

                {/*링크이동할 사이드메뉴 */}
                <div className="right">
                    <section className="content">
                        <div className="content-inner">
                            {/*현재경로의 페이지명 depth 2 */}
                            <h3 className="sub-title current-title title-border">
                                {
                                    menu?.adminList?.map((item) => {
                                        if (item.menuPath.startsWith(`${currentPath}`)) {
                                            return item.menuName
                                        }
                                    })
                                }
                            </h3>
                            {/*depth별 네비주소,현재페이지일 경우 표시필요*/}
                            <ol className="menu-navi d-flex">


                            </ol>
                            {/*문의 관리 데이터 전역관리 설정하기*/}
                             <Outlet/>
                            {/*문의 관리 데이터 전역관리 설정하기*/}
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}

export default AdminBoard;