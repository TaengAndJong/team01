import 'react-datepicker/dist/react-datepicker.css';
import FormTag from "../../../util/formTag.jsx";
import {formatToDate} from "../../../util/dateUtils.jsx";
import React, {useEffect} from "react";
import {useModal} from "../../common/modal/ModalContext.jsx";


const PublishDate = ({publishDate,handleChange}) =>{

    const {openModal} = useModal();

    const dateHandler = (e)=>{
        // onChange 핸들러 이벤트가 발생하면 
        const { name, value } = e.target; // 이벤트 타겟에 담긴 name, value 할당--
        const val = value.replace(/[^\d]/g, '').slice(0, 8);
        // 정수가 아닌 모든 부분을 공백으로 변경, sliece로 날짜의 총 개수만 나타나게 자름

        // 8자가 되면 자동으로 점 찍기
        let formatted = val;
        if (val.length >= 5 && val.length <= 6) {
            formatted = `${val.slice(0, 4)}-${val.slice(4)}`;
        } else if (val.length >= 7) {
            formatted = `${val.slice(0, 4)}-${val.slice(4, 6)}-${val.slice(6, 8)}`;
        }
        //handleChange에서 e.target 내부 값을 받고 있기때문에 target에서 데이터를 담아서 보내야함
        handleChange({ target: { name, value: formatted } });
        }


    return (
        <>

            <FormTag id="publishDate" label="발행일" labelClass="form-title" className="form-control w-auto"
                     name="publishDate"  type="date"
                     placeholder="yyyy-mm-dd"
                     value={publishDate}  onChange={dateHandler}/>
        </>
    )
}

export default PublishDate;
