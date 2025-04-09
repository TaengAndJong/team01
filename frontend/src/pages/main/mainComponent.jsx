import Btn from "../../util/reuseBtn.jsx"
import pathsData from "../../assets/pathsData.jsx"
import {Outlet} from "react-router-dom";
import "../../../../frontend/dist/assets/css/main.css"

const mainComponent = () => {

    return (<>
            <div className="flower"></div>
            <ul className="content-wrapper">
                <li>
                    <a href="">
                        <h3>
                            국내도서
                            <span>
                        	Domestic Books
                       	</span>
                        </h3>
                        <span className="cont">
                            <h5></h5>
                            <span className="img">

                            </span>
                        </span>
                    </a>
                </li>

                <li>
                    <a href="">
                        <h3>
                            국외도서
                            <span>
                        	International Books
                       	</span>
                        </h3>
                        <span className="cont">
                            <h5></h5>
                            <span className="img">

                            </span>
                        </span>
                    </a>
                </li>

                <li>
                    <a href="">
                        <h3>
                            전자도서
                            <span>
                        	 E-books
                       	</span>
                        </h3>
                        <span className="cont">
                            <h5></h5>
                            <span className="img">

                            </span>
                        </span>
                    </a>
                </li>

                <li>
                    <a href="">
                        <h3>
                            문의
                            <span>
                        	Contact
                       	</span>
                        </h3>
                        <span className="cont">
                            <h5></h5>
                            <span className="img">

                            </span>
                        </span>
                    </a>
                </li>
            </ul>

        </>
    )
}

export default mainComponent;