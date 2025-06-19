import React, {useEffect, useReducer} from "react";
import AddressList from "./AddressList.jsx";


export const AddressStatusContext = React.createContext();
export const AddressDispatchContext = React.createContext();

const reducer = (state,action) => {
    console.log("action",action);
    console.log("state",state);
    console.log("action type of", typeof action); //objects
    console.log("action type of", Array.isArray(action.data)); // 객체


    switch(action.type){
        case "INIT" :
            return action.data;
        case "CREATE":
            return [...state,action.data];
        case "UPDATE": // 업데이트 된 Id 를 찾아서 새로 적용 후 반환
            return state.map((item) =>
                item.addrId === action.data.addrId ? action.data : item
        );
        case "DELETE": //filter로 삭제한 Id 를 제외한 요소들 반환
            if(action.data) {
                console.log("delete" ,action.data);
            }
            return state.filter(item => item.addrId !== action.data.addrId);

        default:
            return state;
    }
}


const AddressComponent = () =>{

    //배송지상태관리 변수
    const [deliveryData, dispatch] = useReducer(reducer,null);

    //배송지 등록 저장 시 서버로 보낼 fetch 함수
    const addrFetch = async () => {
        //try ,catch 구문을 사용하면 좀 더  세부적으로 에러처리 가능
        try{

            const response = await fetch("/api/mypage/address",
                {
                    method: "GET",
                })

            if(!response.ok){
                throw Error(response.statusText);
            }

            const data = await response.json();
            //성공여부에 따른 메시지 받아오기
            console.log("get 요청 성공 data",data);
            onInit(data); // 받아온 데이터로 초기값 기본데이터 상태 갱신


        }catch(e){
            console.log(e);
        }

    }

    //onInit
    const onInit = (deliveryData)=>{
        console.log("deliveryData onInit",deliveryData);
        dispatch({
            type:"INIT",
            data:deliveryData,
        })
    }

    //onCreate
    const onCreate = (createList) =>{
        console.log("deliveryData Oncreate",createList);
        dispatch({
            type:"CREATE",
            data:createList,
        })
    }

    const onUpdate = (updateList) =>{
        console.log("deliveryData onUpdate");
        dispatch({
            type:"UPDATE",
            data:updateList,
        })
    }

    const onDelete = (addrId) =>{
        console.log("deliveryData onDelete",addrId);
        dispatch({
            type:"DELETE",
            data:addrId,
        })
    }


    useEffect(() => {
        addrFetch();
        console.log("deliveryData onInit --- 마운트",deliveryData);


    },[]);

    console.log("deliveryData-------",deliveryData);

    return (
        <>
            {/*배송지 목록 ==> 수정, 삭제, 새로 저장할 때 모달 창 띄울건가??  보류 */}
            <AddressStatusContext.Provider value={deliveryData}>
                <AddressDispatchContext.Provider value={{onInit,onCreate,onUpdate,onDelete}}>
                    <AddressList/>
                </AddressDispatchContext.Provider>
            </AddressStatusContext.Provider>


        </>
    )
}

export default AddressComponent;