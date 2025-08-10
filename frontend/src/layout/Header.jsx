import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Btn from "../util/reuseBtn.jsx";
import pathsData from "../assets/pathsData.jsx";
import { useAuth } from "../pages/common/AuthContext.jsx";
import Gnb from "./Gnb.jsx";
import { useMenu } from "../pages/common/MenuContext.jsx";

const Header = () => {
  const { isAuthenticated, userData, logout } = useAuth(); // 로그인 상태와 사용자 데이터 가져오는 커스텀훅
  const { menu } = useMenu(); // 모든 메뉴 가져오는 커스텀훅
  const navigate = useNavigate();


    const commonMenu = menu?.commonList;
    console.log("commonMenu-----------",commonMenu);
    // ["cart", "mypage"].includes(item.menuId) ==> item.menuId에 cart,mypage를 포함하고 있는지
    const commonMenuItems =commonMenu?.filter((item)=>(
        ["cart", "mypage"].includes(item.menuId)
    ));



    return (
        <header id="header" className="header">
            {/*글로벌 메뉴*/}
            <div className="header-inner menu">
                <div className="gnbWrap d-flex justify-content-end align-items-center">
                    <Gnb userData={userData} menu={menu}
                         commonMenuItems={commonMenuItems}
                         isAuthenticated={isAuthenticated}
                         logout={logout}
                    />
                </div>

            </div>

        </header>
    );


  return (
    <header id="header" className="header">
      {/*글로벌 메뉴*/}
      <div className="header-inner menu">
        <div className="gnbWrap d-flex justify-content-end align-items-center">
          <Gnb
            userData={userData}
            menu={menu}
            commonMenuItems={commonMenuItems}
            isAuthenticated={isAuthenticated}
            logout={logout}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
