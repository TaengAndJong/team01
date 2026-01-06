import Select from "react-select";
import React, {useEffect, useState} from "react";
import {generateOptions} from "@util/selectDate.jsx";
import PriceStock from "../../../adminBook/components/priceStock.jsx";
import FormTag from "../../../../util/formTag.jsx";

const Birth = ({birth}) =>{

    return(
        <>
            {/* 생년월일 */}
            <div className="mb-2">
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
            </div>
        </>
    )
}

export default Birth;