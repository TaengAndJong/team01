import {Link} from "react-router-dom";
import {useAuth} from "../../common/AuthContext.jsx";

const SectionSkipBtns= ()=>{

    const { isAuthenticated } = useAuth();  // 로그인 여부
    return (
        <>
            <section className="section skipbtns">
                <div className="sc-inner">
                    <ul className="skip-btn-list">
                        {isAuthenticated && (
                            <>
                                <li>
                                    <Link to={"/board"} className="skip-btn qna text-end" title={"문의게시판 바로가기 링크입니다."}>
                                        <div className="skip-btn-con">
                                            <p>책이 더 가까워지는 순간</p>
                                            <p>The Book과 함께 해요.</p>
                                            <span className="btn circle-btn float-end">
                                        <em>문의하러가기</em>
                                    </span>
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={"/mypage/wishlist"} className="skip-btn wishlist text-start"
                                          title={"위시리스트 바로가기 링크입니다."}>
                                        <div className="skip-btn-con">
                                            <p>당신만의 리스트,</p>
                                            <p>하나씩 읽어가는 즐거움.</p>
                                            <span className="btn circle-btn float-start">
                                        <em>위시리스트</em>
                                    </span>
                                        </div>
                                    </Link>
                                </li>
                            </>

                        )}

                        <li>
                            <Link to={"/signup"} className="skip-btn join text-end" title={"회원가입 바로가기 링크입니다."}>
                                <div className="skip-btn-con">
                                    <p>책을 사랑하는 당신에게</p>
                                    <p>특별한 공간을</p>
                                    <span className="btn circle-btn float-end">
                                    <em>회원가입</em>
                                </span>
                                </div>
                            </Link>
                        </li>
                    </ul>
                </div>
            </section>
        </>
    )
}

export default SectionSkipBtns;