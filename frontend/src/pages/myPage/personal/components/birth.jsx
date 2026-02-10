
import React, {useEffect, useState} from "react";
import FormTag from "@util/form/formTag.jsx";

const Birth = ({birth}) =>{

    return(
        <>
            {/* 생년월일 */}

            <div className="Info birth d-flex align-items-center mb-1 w-100">
                <FormTag id="birth" label="생년월일" labelClass="form-title"
                         className="form-control w-auto"
                         name="birth"
                         type="text"
                         value={birth}
                         placeholder="생년월일"
                         readOnly={true}
                         aria-readonly="true"/>
            </div>

        </>
    )
}

export default Birth;