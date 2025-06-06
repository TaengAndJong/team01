import "@assets/css/board/userBoard.css"

const createBoardComponent = ()=> {
    return(
        <>
            <div>
                <div>
                    <div><p>문의 종류</p>
                        <select>
                            <option>문의 선택</option>
                            <option>1:1 문의</option>
                            <option>상품 문의</option>
                            <option>배송 문의</option>
                        </select>
                    </div>
                    <div>문의 내용</div>
                    <div>첨부 이미지</div>
                    <div><button>게시물 등록</button></div>
                </div>
            </div>
        </>
    )
}

export default createBoardComponent;