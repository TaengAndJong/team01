import {map} from "react-bootstrap/ElementChildren";

const AddressItem = ({deliveryData,handleClick}) => {

    console.log("deliveryData--- item", deliveryData)

    return (
        <>
            {deliveryData?.map((item, index) => (

                    <dl key={index} className="d-flex border border-dark-subtle p-4  rounded-1  bg-white bg-opacity-50 align-items-center mb-2">
                        <dt className="title me-3">분류</dt>
                        <dd className="border-end pe-4">{item.addrType}</dd>
                        <dt className="title me-3 ms-4">주소</dt>
                        <dd>
                            <span>{item.zonecode}</span>
                            <span className="me-3">{item.addr}</span>
                            <span>{item.detailAddr}</span>
                        </dd>

                        <dd>
                            <button aria-label="배송지변경" className="btn btn-sm btn-primary ms-3">변경</button>
                             {/*변경 누르면 하단에 EditForm 출력하고 변경 버튼이 저장버튼으로 바뀌기?? 아니면 기존 폼에서 저장까지처리*/}
                        </dd>
                    </dl>

            ))}
        </>
    )
}

export default AddressItem;


