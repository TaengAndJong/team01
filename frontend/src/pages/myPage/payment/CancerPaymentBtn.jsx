import React from "react";

const CancerPaymentBtn = ({handleCancel})=>{

    return (
        <>
            <div className="text-center">
                <button className="btn btn-danger" onClick={handleCancel}>
                    결제취소
                </button>
            </div>
        </>
    )
}

export default CancerPaymentBtn;