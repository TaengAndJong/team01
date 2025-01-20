
const FormTag = ({ label,id, name, value, onChange, type = "text", checked, msg }) => {
    return (
        <div className="input-field">
            <label htmlFor={name}>{label}</label>
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                checked={checked}
                className={msg ? "msg" : ""}
                {...(type === "password" ? { autoComplete: "new-password" } : {})}
                {...(type === "name" ? { autoComplete: "name" } : {})}
            />
            {msg && <span className="msg">{msg}</span>}
        </div>
    );
};

export default  FormTag;

// 스프레드 연산자를 통해 새로운 속성 추가 ...(기존 속성들이 당겨 있음)