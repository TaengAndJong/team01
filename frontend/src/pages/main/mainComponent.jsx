
import "@assets/css/main.css"
import {Link} from "react-router-dom";

const mainComponent = () => {

    return (<>
            <section className="section main">
                <div className="sc-inner">
                        <div className="text-box">
                            <p className="title ">
                                <span className="text-dot text-or s-tit">R</span>
                                <span className="text-dot text-or s-tit">E</span>
                                <span className="text-dot text-or s-tit">A</span>
                                <span className="text-dot text-or s-tit">D</span>
                                <span className="s-tit">WITH</span>
                                <span className="text-dot text-gr s-tit">U</span>
                                <span className="text-dot text-gr s-tit">S</span>
                            </p>
                            <p className="title  m-tit">혼자보다, 함께 읽는 감동</p>
                            <p className="title bold b-tit">Found In The Book</p>
                        </div>
                        <Link to={"/book"} className="btn circle-btn"><span>도서보러가기</span></Link>
                </div>
            </section>

            {/* 국내도서 영역 */}
            <section className="section books">
                <div className="sc-inner d-flex align-items-start">
                    <h2 className="sc-tit">
                        <span className="text-dot">오</span>
                        <span className="text-dot">늘</span>
                        <span className="text-dot">의</span>
                        <span className="text-dot">책</span>
                    </h2>
                    <p className="desc">하루의 끝, 당신에게 닿을 한 권의 이야기</p>
                    {/*도서 슬라이드*/}
                    <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist"
                         aria-orientation="vertical">
                        <button className="nav-link active" id="v-pills-home-tab" data-bs-toggle="pill"
                                data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home"
                                aria-selected="true">국내도서
                        </button>
                        <button className="nav-link" id="v-pills-profile-tab" data-bs-toggle="pill"
                                data-bs-target="#v-pills-profile" type="button" role="tab"
                                aria-controls="v-pills-profile" aria-selected="false">국외도서
                        </button>
                        <button className="nav-link" id="v-pills-messages-tab" data-bs-toggle="pill"
                                data-bs-target="#v-pills-messages" type="button" role="tab"
                                aria-controls="v-pills-messages" aria-selected="false">ebook
                        </button>
                    </div>
                    <div className="tab-content" id="v-pills-tabContent">
                        <div className="tab-pane fade show active" id="v-pills-home" role="tabpanel"
                             aria-labelledby="v-pills-home-tab" tabIndex="0">국내도서 슬라이드
                        </div>
                        <div className="tab-pane fade" id="v-pills-profile" role="tabpanel"
                             aria-labelledby="v-pills-profile-tab" tabIndex="0">국외도서 슬라이드
                        </div>
                        <div className="tab-pane fade" id="v-pills-settings" role="tabpanel"
                             aria-labelledby="v-pills-settings-tab" tabIndex="0">ebook 슬라이드
                        </div>
                    </div>
                </div>
            </section>


            {/* 문의, 위시리스트 , 회원가입 */}
            <section className="section skipbtns">
                <div className="sc-inner">
                    <ul>
                        <li>
                            <Link to={"/board"} title={"문의게시판 바로가기 링크입니다."}>
                                <span className={"sr-only"}>문의하러가기</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={"/mypage/wishlist"} title={"위시리스트 바로가기 링크입니다."}>
                                <span className={"sr-only"}>위시리스트</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={"/signup"} title={"회원가입 바로가기 링크입니다."}>
                                <span className={"sr-only"}>회원가입</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </section>

            {/*인기도서 & 추천도서 */}
            <section className="section curation">
                <div className="sc-inner">
                    <div className="d-flex align-items-start w-50">
                        <h3>인기도서</h3>
                        <ul>
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                        </ul>
                    </div>
                    <div className="d-flex align-items-start w-50">
                        <h3>추천도서</h3>
                        <ul>
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                        </ul>
                    </div>
                </div>
            </section>
            
            {/* 퀵메뉴 영역 */}
            <div className="quickMenu">
                <span>퀵메뉴</span>
            </div>
            <div className="top_btn">
                <span>위로가기</span>
            </div>

        </>
    )
}

export default mainComponent;