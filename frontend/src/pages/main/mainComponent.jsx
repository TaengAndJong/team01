
import "@assets/css/main.css"

const mainComponent = () => {

    return (<>
            {/* 슬라이드 영역 */}
            <section className="section mainSlide">
                <div className="sc-inner slide">
                    메인슬라이드 영역입니다
                </div>
            </section>

            {/* 국내도서 영역 */}
            <section className="section books">
                <div className="sc-inner d-flex align-items-start">
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
                                aria-controls="v-pills-messages" aria-selected="false">전자도서
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
                             aria-labelledby="v-pills-settings-tab" tabIndex="0">전자도서 슬라이드
                        </div>
                    </div>
                </div>
            </section>
            {/*인기도서 & 추천도서 */}
            <section className="section">
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
            {/* 마이페이지 영역  == 해당 유저의 mypage 문의 내역 */}

            {/* 퀵메뉴 영역 */}
            <div className="quickMenu">

            </div>


        </>
    )
}

export default mainComponent;