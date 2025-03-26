
import {Link, useLocation} from "react-router-dom";
import {leftFirstMenuToggle} from "../js/subLayout.js";
import {useEffect} from "react";
import {useMenu} from "../pages/common/MenuContext.jsx";


const LeftMenu = () => {

    const {menu,currentPath,standardPoint}  = useMenu();

    console.log("left menu",menu);
    console.log("left current",currentPath);
    console.log("left standardPoint",standardPoint);



    useEffect(() => {

    },[])


    return (
        <>
            <aside id="sidebar" className="left-menu">
                <div className="left-title">
                    {/*현재경로의 부모 1차메뉴 이름*/}
                    <h4 className="sub-title first-title title-border">
                        {
                            menu?.adminList?.map((item)=>{
                                return item.menuPath === standardPoint? item.menuName:"";
                            })
                        }
                    </h4>
                </div>

                <ul className="depth first-depth">

                    {
                        menu?.adminList?.filter((item)=> item.menuPath.startsWith(`${standardPoint}/`))
                            .map((item)=>{
                                if(item.menuVisible === "Y"){
                                    return(
                                        <li key={item.menuId} className="">
                                            <Link to={item.menuPath} className={`depth-menu first ${currentPath==item.menuPath? "current":""}`}>{item.menuName}
                                                <i className="leaf icon"></i>
                                            </Link>
                                        </li>
                                    )

                                }
                        })
                    }

                        {/*    문의관리*/}
                        {/*    <i className="arrow circle-arrow"></i> </Link>*/}
                        {/*<button type="button" className="depth-menu first" onClick={leftFirstMenuToggle}>문의관리 <i*/}
                        {/*    className="arrow circle-arrow"></i></button>*/}
                        {/*<button type="button" className="depth-menu first current" title="1차메뉴 열림" onClick={leftFirstMenuToggle} onFocus={leftMenuFocus} onBlur={leftMenuBlur}>*/}

                        {/*<ul className="depth second-depth">*/}
                        {/*    <li>*/}
                        {/*        <Link to="/admin/board/oneBoard" className="depth-menu second">1:1문의</Link>*/}
                        {/*    </li>*/}
                        {/*    <li>*/}
                        {/*        <Link to="/admin/board/deliveryBoard" className="depth-menu second">배송문의</Link>*/}
                        {/*    </li>*/}
                        {/*    <li>*/}
                        {/*        <Link to="/admin/board/productBoard" className="depth-menu second">상품문의</Link>*/}
                        {/*    </li>*/}
                        {/*</ul>*/}

                                    </ul>

            </aside>

        </>

    )
}

export default LeftMenu;