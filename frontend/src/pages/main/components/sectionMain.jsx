import {Link} from "react-router-dom";

const SectionMain= ()=>{
    return (
        <>
            <section className="section main">
                <div className="sc-inner">
                    <div className="text-box">
                        <p className="title">
                            <span className="text-dot text-or s-tit">R</span>
                            <span className="text-dot text-or s-tit">E</span>
                            <span className="text-dot text-or s-tit">A</span>
                            <span className="text-dot text-or s-tit">D</span>
                            <span className="s-tit mx-4">WITH</span>
                            <span className="text-dot text-gr s-tit">U</span>
                            <span className="text-dot text-gr s-tit">S</span>
                        </p>
                        <p className="title"><span className="m-tit">혼자보다, 함께 읽는 감동</span></p>
                        <p className="title">
                            <span className="b-tit">Found In The Book</span>
                        </p>
                    </div>
                    <Link to={"/book"} className="btn circle-btn"><span>도서보러가기</span></Link>
                </div>
            </section>
        </>
    )
}

export default SectionMain;