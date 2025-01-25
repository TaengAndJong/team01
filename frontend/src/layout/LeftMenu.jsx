
import {Link} from "react-router-dom";


const LeftMenu = () => {

    return (

      <>
            <div className="depth depth1">
                <h2 className="fw-bold">게시판</h2>
                <ul className="depth depth2">
                    {/*조회 목록 클릭 후 댓글 작성기능, 처리완료 / 미완료 상태 분류 필요*/}
                    <li>
                        <Link to="/admin/board/oneBoard" className="btn">1:1문의</Link>
                    </li>
                    <li>
                        <Link to="/admin/board/deliveryBoard" className="btn">배송문의</Link>
                    </li>
                    <li>
                        <Link to="/admin/board/productBoard" className="btn">상품문의</Link>
                    </li>
                </ul>
            </div>
          <div className="depth depth1">
              <h2 className="fw-bold">도서관리</h2>
              <ul className="depth depth2">
                    {/*전체선택, 개별 선택*/}
                    <li>
                        <Link to="/admin/book/bookList" className="btn">도서조회</Link>
                    </li>
                </ul>
            </div>

      </>

    )
}

export default LeftMenu;