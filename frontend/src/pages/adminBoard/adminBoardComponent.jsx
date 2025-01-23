import PathsData from "../../assets/pathsData.jsx";
import {Outlet} from "react-router-dom";


const AdminBoard = () => {


    return (
            <>
                {/* Outlet 선언하면 첫번째 자식라우터가 보여짐*/}
                <Outlet />
                {/*Link 사용하기 */}
               관리자 게시판

            </>

    );
}

export default AdminBoard;