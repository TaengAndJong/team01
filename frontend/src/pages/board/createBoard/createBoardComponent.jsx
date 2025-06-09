import "@assets/css/board/userBoard.css"
import Btn from "@util/reuseBtn.jsx";

const createBoardComponent = ()=> {
    return(
        <>
            <div>
                <div className="createBoardBox">
                    <div className="d-flex">
                        <dt className="name">고객명</dt>
                        <dd>
                            <span>김종호</span>
                        </dd>

                    </div>
                    <div className="d-flex">
                        <dt className="id">ID</dt>
                        <dd>
                            <span>astra9706</span>
                        </dd>

                    </div>
                    <div className="d-flex">
                        <dt>문의 종류</dt>
                        <dd>
                            <div>
                                <select className="inquireOption">
                                    <option className="">문의 선택</option>
                                    <option className="">1:1 문의</option>
                                    <option className="">상품 문의</option>
                                    <option className="">배송 문의</option>
                                </select>
                            </div>
                        </dd>

                    </div>
                    <div className="d-flex">
                        <dt className="inquireTitle">문의 제목</dt>
                        <dd><input/></dd>

                    </div>

                    <div className="d-flex">
                        <dt className="inquireContents">문의 내용</dt>
                        <dd><textarea/></dd>
                    </div>

                    <div className="d-flex">
                        <dt className="attachfiles">첨부 파일</dt>
                        <dd>
                            <p>이미지 파일만 첨부해 주세요</p>
                            <a className="btn">파일 첨부하기</a>
                            <span>"(<b>최대 10개</b>, 30MB)"</span>
                        </dd>
                    </div>
                    <div className="createBtnBox">
                        <Btn className={"Btn postBoard "} id={"createBtn"} text="게시물 등록"></Btn>
                    </div>
                </div>
            </div>
        </>
    )
}

export default createBoardComponent;