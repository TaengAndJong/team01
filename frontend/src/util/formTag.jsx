
const FormTag = ({ label, name, value, onChange, type = "text", checked, msg }) => {
    return (
        <div className="input-field">
            <label htmlFor={name}>{label}</label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                checked={checked}
                className={msg ? "msg" : ""}
            />
            {msg && <span className="msg">{msg}</span>}
        </div>
    );
};

export default  FormTag;
