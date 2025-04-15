//목록 , 관리자만 = 수정완료 버튼

import {useContext} from "react";
import {BookStateContext} from "../adminBookComponent.jsx";

const AdminBookModify = () => {
    const {bookdata} = useContext(BookStateContext);
    console.log("bookdata",bookdata);


    return(
        <>
            AdminBookModify
        </>
    )
}

export default AdminBookModify;