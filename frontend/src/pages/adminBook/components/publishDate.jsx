import 'react-datepicker/dist/react-datepicker.css';
import FormTag from "../../../util/formTag.jsx";


const PublishDate = ({publishDate,handleChange}) =>{

    const dateHandler = (date)=>{
        console.log(typeof date);
       console.log(date);
        handleChange("publishDate",date);
    }
    return (
        <>
            <div className="d-flex align-items-center mb-1">
                <FormTag id="publishDate" label="발행일" labelClass="form-title" className="form-control"
                         name="publishDate" type="datePicker"
                         placeholder="발행일선택"
                         value={publishDate}  onChange={(date)=>dateHandler(date)}/>
            </div>
        </>
    )
}

export default PublishDate;