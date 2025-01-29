
const FormTag = ({ label,labelClass,id, name, value, onChange,className,
                     type = "text", checked, msg,
                     disabled = false, readOnly = false }) => {

    return (
    <>
            {/* labelClass가 null이나 undefined 이면 "" (빈문자열 반환) */}
            <label htmlFor={name} className={ labelClass? labelClass: ""}>{label}</label>
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                checked={checked}
                className={msg ? "msg" : className}
                disabled={disabled}
                readOnly={readOnly}
                {...(type === "password" ? { autoComplete: "new-password" } : {})}
                {...(type === "name" ? { autoComplete: "name" } : {})}
            />
            {msg && <span className="msg">{msg}</span>}
    </>
    );
};

export default  FormTag;

// 스프레드 연산자를 통해 새로운 속성 추가 ...(기존 속성들이 당겨 있음)