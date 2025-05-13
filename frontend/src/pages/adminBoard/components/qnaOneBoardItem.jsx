import "@assets/css/board/oneBoard.css"

const qnaOneBoardItem = ({data}) => {
    return  (
        <>
            <div>
                <ul className="qnaOneItemBox">
                    <li className="qnaOneItem">{data.qnaOneId}</li>
                    <li className="qnaOneItem">{data.qnaTitle}</li>
                    <li className="qnaOneItem">{data.clientId}</li>
                    <li className="qnaOneItem">{data.qnaStatus}</li>
                    <li className="qnaOneItem">{data.qnaDate}</li>
                </ul>
            </div>
        </>
    )
}

export default qnaOneBoardItem;