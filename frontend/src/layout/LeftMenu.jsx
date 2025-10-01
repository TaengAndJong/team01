
import {Link, useLocation} from "react-router-dom";

import {useEffect} from "react";
import {useMenu} from "../pages/common/MenuContext.jsx";


const LeftMenu = () => {

    const {menu,currentPath,standardPoint}  = useMenu();

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
                        {
                            menu?.clientList?.map((item)=>{
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

                    {
                        menu?.clientList?.filter((item)=> item.menuPath.startsWith(`${standardPoint}/`))
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

                </ul>

            </aside>

        </>

    )
}

export default LeftMenu;