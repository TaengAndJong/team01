import React,{useContext, useEffect, useState} from "react";
import EditForm from "./EditForm.jsx";
import AddForm from "./AddForm.jsx";
import AddressItem from "./AddressItem.jsx";
import {Outlet} from "react-router-dom";


export const AddressStatusContext = React.createContext();
export const AddressDispatchContext = React.createContext();

const AddressComponent = () =>{

    //배송지상태관리 변수
    const [deliveryData, setDeliveryData] = useState([]);


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
            setDeliveryData(data);

        }catch(e){
            console.log(e);
        }

    }


    //onCreate
    const onCreate = () =>{
        console.log("deliveryData Oncreate");

       // setDeliveryData();
    }

    useEffect(() => {
        addrFetch();

    },[]);

    console.log("deliveryData-------",deliveryData);

    return (
        <>
            배송지 목록
            4) 리렌더링 == 등록폼 닫히고 두 번째 배송지 추가하기 메시지 + 배송지 추가버튼 출력
            5) 배송지가 있다면 수정하기 버튼 출력
            6) 수정하기 버튼 클릭 시 수정 폼 등장 및 수정
            7) 다시 수정 목록등장

            <AddressStatusContext.Provider value={{deliveryData,setDeliveryData}}>
                <AddressDispatchContext.Provider value={{onCreate}}>
                    <AddressItem/>
                </AddressDispatchContext.Provider>
            </AddressStatusContext.Provider>


        </>
    )
}

export default AddressComponent;