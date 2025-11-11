import DatePicker from "react-datepicker";
import {ko} from "date-fns/locale";

const FormTag = ({ label,labelClass,id, name, value, onChange,className,
                     type = "text", checked, msg,ref,

                     disabled = false, readOnly = false, required=false }) => {

    // 여기서 input type 분류에 따른 return 반환 함수 내부에 작성하는 것보다  여기에 작성하기
    // 렌더링 전에 변수나 함수로 처리하는 것이 더 효율적이고 가독성이 높음
   const inputType =()=>{
       switch (type) {
           case "text":
               return (
                   <input id={id} name={name} type={type} value={value || ""} onChange={onChange}  ref={ref}
                          className={msg ? "msg form-control" : className} disabled={disabled} readOnly={readOnly} required={required} />
           );
           case "checkbox":
           case "radio":
               return <input id={id} name={name} type={type} value={value} checked={checked} onChange={onChange}   ref={ref}
                             className={msg ? "msg form-control" : className} disabled={disabled} readOnly={readOnly} required={required} />
           case "textarea":
               return <textarea id={id} name={name} value={value} onChange={onChange}  ref={ref}
                                className={msg ? "msg form-control" : className} disabled={disabled} readOnly={readOnly} required={required}/>
           case "password":
               return (
                   <input
                       id={id} name={name} type={type} value={value || ""} onChange={onChange}  ref={ref}
                       className={msg ? "msg form-control" : className}
                       required={required}
                       readOnly={readOnly}
                       {...(type === "password" ? {autoComplete: "new-password"} : {})}
                       {...(type === "name" ? {autoComplete: "name"} : {})}
                   />
               );
               break;

           case "file":
               return (
                   <input
                       id={id}
                       name={name}
                       type={type}
                       value={value}
                       onChange={onChange}
                       ref={ref}
                       checked={checked}
                       className={msg ? "msg form-control" : className}
                       readOnly={readOnly}
                       required={required}
                   />

               );
               break;
           case "datePicker" :
               return(
                   <DatePicker
                       selected={value}
                       onChange={onChange}
                       ref={ref}
                       dateFormat="yyyy.MM.dd"
                       locale={ko}
                       className={msg ? "msg form-control" : className}
                       disabled={disabled}
                       readOnly={readOnly}
                       required={required}
                       placeholderText="날짜 선택"
                   />
               )
           default:
               return (
                   <input
                       id={id}
                       name={name}
                       type="text"
                       value={value || ""}
                       onChange={onChange}
                       ref={ref}
                       checked={checked}
                       className={msg ? "msg form-control" : className}
                       disabled={disabled}
                       readOnly={readOnly}
                       required={required}
                   />
               );
       }
   }
    // return문 내부는 JSX 코드이며, 렌딩 후 처리임
    return (
        <>
            {/* labelClass가 null이나 undefined 이면 "" (빈문자열 반환) */}
            <label htmlFor={name} className={labelClass ? labelClass : ""}>{label}</label>
            {inputType()}
            {msg && <span className="msg tip">{msg}</span>}
        </>
    );
};

export default FormTag;

// 스프레드 연산자를 통해 새로운 속성 추가 ...(기존 속성들이 당겨 있음)