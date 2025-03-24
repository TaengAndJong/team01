
import {Outlet} from "react-router-dom";
import React from "react";
import LeftMenu from "../../layout/LeftMenu.jsx";


const AdminBoard = () => {

    return(
        <>
            <div className="page adminBoard d-flex">
                <div className="left">
                    <LeftMenu/>
                </div>

                {/*링크이동할 사이드메뉴 */}
                <div className="right">
                    <Outlet/>
                </div>
            </div>
        </>
    )
}

export default AdminBoard;