import {map} from "react-bootstrap/ElementChildren";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const AddressItem = ({deliveryData,setDeliveryData,setShowAddForm}) => {

    console.log("deliveryData--- item", deliveryData)

    //배송지 등록 저장 시 서버로 보낼 fetch 함수
    const addrdelFetch = async (addrId) => {
        //주소에 파라미터값 담아서 서버로 전송


        //try ,catch 구문을 사용하면 좀 더  세부적으로 에러처리 가능
        try{

            const response = await fetch(`/api/mypage/address/delete/${addrId}`, {
                method: 'POST',
            });

            if(!response.ok){
                throw Error(response.statusText);
            }

            const data = await response.json();
            //성공여부에 따른 메시지 받아오기
            console.log("get 요청 성공 data",data);
            // 유저에게 성공완료 모달 띄울거?

            //삭제 후 목록 재요청 ==> 이렇게 안하려면 ContextAPI 사용하기
            const getRequest = await fetch('/api/mypage/address');
            const updatedList = await getRequest.json();
            setDeliveryData(updatedList);

        }catch(e){
            console.log(e);
        }

    }

    const deletehandler = (addrId)=>{
        console.log("addrId", addrId);
        addrdelFetch(addrId);
    }

    useEffect(() => {
        if (deliveryData.length > 3) return; // 3개 초과면 추가 폼 열지 않음
        setShowAddForm(false); // 재 렌더링 되었을때는 폼 닫기
    },[deliveryData]);

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
                            <button aria-label="배송지변경" className="btn btn-sm btn-primary mx-1">변경</button>
                            <button aria-label="배송지삭제" className="btn btn-sm btn-danger" onClick={() =>{deletehandler(item.addrId)}}>삭제</button>
                             {/*변경 누르면 하단에 EditForm 출력하고 변경 버튼이 저장버튼으로 바뀌기?? 아니면 기존 폼에서 저장까지처리*/}
                        </dd>
                    </dl>

            ))}
        </>
    )
}

export default AddressItem;


