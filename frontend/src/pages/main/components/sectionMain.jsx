import {Link} from "react-router-dom";
import { gsap } from "gsap";
import {useEffect} from "react";


const SectionMain= ()=>{
    useEffect(() => {
        const tl = gsap.timeline({ delay: 0.4 });

        //  READWITHUS 각 글자 개별 bounce
        tl.from(".text-box .title:first-child span", {
            y: 60,
            opacity: 0,
            color: "#000",
            stagger: 0.1,           // 글자 순서대로
            duration: 0.6,
            ease: "bounce.out",     // 공 튀기듯
        })
            .to(".text-box .title:first-child span.text-or", {
                color: "#ff7b00",       // 오렌지 계열 컬러
                stagger: 0.1,
                duration: 0.4,
            }, "-=0.4")
            .to(".text-box .title:first-child span.text-gr", {
                color: "#00b37d",       // 그린 계열 컬러
                stagger: 0.1,
                duration: 0.4,
            }, "-=0.4");

        // 2두 번째 문장 (혼자보다~)
        tl.from(".text-box .m-tit", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.out",
        }, "+=0.3");

        //  세 번째 문장 (Found In The Book)
        tl.from(".text-box .b-tit", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.out",
        }, "-=0.3");

        // 4️⃣ 버튼 등장
        tl.from(".circle-btn", {
            opacity: 0,
            scale: 0.8,
            duration: 0.5,
            ease: "back.out(1.7)",
        }, "+=0.2");

    }, []);

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