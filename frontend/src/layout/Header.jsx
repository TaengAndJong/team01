import React from "react";
import Gnb from "./Gnb.jsx";
import { useMenu } from "../pages/common/MenuContext.jsx";
import {useSessionCheck} from "../js/sessionCheck.js";

const Header = () => {
    console.log("Header 진입");
    const { menu } = useMenu(); // 모든 메뉴 가져오는 커스텀훅
    const commonMenu = menu?.commonList;
    const commonMenuItems =commonMenu?.filter((item)=>(
        ["cart", "mypage"].includes(item.menuId)
    ));

    console.log("header menu data",menu);
    console.log("header commonMenu data",commonMenu);
    console.log("header commonMenuItems data",commonMenuItems);


    return (
        <header id="header" className="header">
            {/*글로벌 메뉴*/}
            <div className="header-inner menu">
                <div className="gnbWrap d-flex  align-items-center">
                    <Gnb
                        menu={menu}
                        commonMenuItems={commonMenuItems} />
                </div>

            </div>

        </header>
    );

};

export default Header;
