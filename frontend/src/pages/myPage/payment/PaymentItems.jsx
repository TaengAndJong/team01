

const PaymentItems = ({paymentInfo}) =>{

    console.log("PaymentItems paymentInfo", paymentInfo);

    const handleCancel = () =>{

    }

    return (
        <>
            <div>
                <section>
                    <h2 className="book-title title-dotted d-block">결제 상세 정보</h2>
                    <ul className="">
                        <li><span className="">결제방식</span>{paymentInfo.payMethod}</li>
                        <li><span className="">결제상태</span>{paymentInfo.payStatus}</li>
                        <li><span className="">결제일시</span>{paymentInfo.payDate}
                           {paymentInfo.payStatus === "COMPLETED" && (
                            <button className="btn btn-danger" onClick={handleCancel}>결제 취소</button>
                            )}
                        </li>
                    </ul>
                </section>
                <section>
                    <h3 className="book-title title-dotted d-block">도서 목록</h3>
                    <ul>
                        {paymentInfo.books.map((book) => (
                            <li key={book.bookId}>
                                <strong>{book.bookName}</strong> - {book.author} / {book.bookPrice}원
                            </li>
                        ))}
                    </ul>
                </section>
                <section>
                    <h3 className="book-title title-dotted d-block">배송지 정보</h3>
                    <p>{paymentInfo.address.addr}</p>
                    <p>{paymentInfo.address.detailAddr}</p>
                </section>
            </div>
        </>
    )
}

export default PaymentItems