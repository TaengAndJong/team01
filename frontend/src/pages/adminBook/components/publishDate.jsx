import 'react-datepicker/dist/react-datepicker.css';
import FormTag from "../../../util/formTag.jsx";
import {formatToDate} from "../../../util/dateUtils.jsx";


const PublishDate = ({publishDate,handleChange}) =>{

    const dateHandler = (date)=>{
        console.log(typeof date);
        console.log(date)
        //  datePicker에서 date를 문자열로 반환하기 때문에 e(이벤트객체)를 파라미터로 넘기는 상황이기 때문에
        //이벤트객체와 동일한 형식으로 구조를 만들어서 넘겨주어야 함!
        //  이벤트 객체로 만들어서 전달해주기
        const dateEvent = {
            target: {
                name: "publishDate",
                value: formatToDate(date)
            }
        };

        handleChange(dateEvent);
    }
    return (
        <>

                <FormTag id="publishDate" label="발행일" labelClass="form-title" className="form-control"
                         name="publishDate" type="datePicker"
                         placeholder="발행일선택"
                         value={publishDate}  onChange={(date)=>dateHandler(date)}/>

        </>
    )
}

export default PublishDate;