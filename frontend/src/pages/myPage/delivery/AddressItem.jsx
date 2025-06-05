const AddressItem = () => {



    return (
        <>
            <dt className="title me-3">분류</dt>
            <dd className="border-end pe-4">집</dd>
            <dt className="title me-3 ms-4">상세주소</dt>
            <dd>배송 주소등록한 배송지 기준 빠른배송 상품을 보실 수 있습니다.
                <button aria-label="배송지변경" className="btn btn-sm btn-primary ms-3">변경</button>
            </dd>
        </>
    )
}

export default AddressItem;