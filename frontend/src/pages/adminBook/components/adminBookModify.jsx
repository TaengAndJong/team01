import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Btn from "../../../util/reuseBtn.jsx";
import pathsData from "../../../assets/pathsData.jsx";

const AdminBookModify = () => {

    /*
    * 0. URL을 통해서 해당 데이터의 ID값을 가져오기,
    * 1. 렌더링 될 때, useEffect fetch  요청을  통해 해당 ID의 기존 정보 조회해서 가져오기
    *  ==> 상태관리의 초기값이 됨
    * 2. 수정 가능한 부분과 불가능한 부분 나누기
    * 3. 다시 서버로 제출 (post 요청) 및 클라이언트 상태업데이트(onUpdate) 해주기
    * */
    const bookId2 = useParams();
    const {bookId} = useParams(); // URL에서 bookId 값 받아오기
    const [bookData, setBookData] = useState([]);
    console.log("-----",bookId)

    useEffect(() => {
        //fetch 함수 작성하기
        const fetchModify = async()=>{
            try{
                //fetch 요청 보내기
                const data = await fetch(`/api/admin/book/bookModify/${bookId}`);
                //요청 받은 데이터 bookData에 갱신
                setBookData(data);
                console.log("data",data);
                console.log("bookData",bookData);
            }catch(e){

            }
        }
    }, [bookId]); //bookId가 변경될 때마다 데이터 변경

    return(
        <>
            AdminBookModify
            <div className="d-grid gap-2 d-md-flex justify-content-md-between mt-4">
                <Btn className={"modify btn btn-secondary"} type={"button"}
                     path={`${pathsData.page.adminBookDetail}/${bookId}`}
                     text="뒤로"/>
                <Btn className={"modify btn btn-primary"} type={"button"}
                     text="확인"/>
            </div>
        </>
    )
}

export default AdminBookModify;