import FormTag from "../../../util/formTag.jsx";
import React from "react";

//props는 input의 value에 들어갈 값이나, 핸들러함수 등을 받아오면 됨
const PriceStock = ({bookPrice,stock,stockStatus,handleChange}) =>{

    return (
        <>
            <div className="row col-3  align-items-center flex-nowrap ">
                {/* 숫자만 입력되게 검증필요 */}
                <FormTag id="bookPrice" label="도서가격" labelClass="form-title col-2" className="form-control"
                         name="bookPrice" type="text"
                         placeholder="도서가격입력" value={bookPrice} onChange={handleChange}/>
                <span className="w-auto d-inline-flex align-items-center">원</span>
            </div>
            <div className="row col-3  align-items-center flex-nowrap ">
                {/* 100개 이상 입력되면 경고문? 아니면 선택박스로 바꾸기*/}
                <FormTag id="stock" label="재고" labelClass="form-title col-2" className="form-control" name="stock"
                         type="text"
                         placeholder="재고입력" value={stock} onChange={handleChange}/>
                <span className="w-auto d-inline-flex align-items-center">개</span>
            </div>
            <div className="row col-3 align-items-center flex-nowrap ">
                {/*재고도 셀렉트박스로 바꾸기*/}
                <FormTag id="stockStatus" label="재고상태" labelClass="form-title col-2" className="form-control"
                         name="stockStatus"
                         type="text"
                         placeholder="재고상태" value={stockStatus} readOnly={true}/>
                <span className="w-auto d-inline-flex align-items-center">개</span>
            </div>
        </>
)
}

export default PriceStock;