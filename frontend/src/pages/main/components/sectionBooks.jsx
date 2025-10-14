import MainBookSlide from "./mainBookSlide.jsx";
import {useEffect, useRef, useState} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap. 스트롤 트리거 가져오기
gsap.registerPlugin(ScrollTrigger);

const SectionBooks= ({slideData})=>{

    // 목표 : 현재탭일 경우에 해당 데이터만 슬라이드에 보여주기
    //slideData에 담긴 객체 구조분해 할당하기
    const {national,foreigner,ebook} = slideData ?? {}; // slideData가 있으면 구조분해 할당 없으면 빈 객체
    // 현재 활성탭 제어 상태관리 변수 ==> 부트스트랩 제어 말고 리액트로 active 제어
    const [activeTab, setActiveTab] = useState("national"); // 처음 보여줄 탭은 국내도서

    //스크롤 애니메이션 돔조작 상태관리
    const sectionRef = useRef(null); // 스크롤이 book슬라이드 섹션에 도달할 경우 dom요소 참조
    const titleRef = useRef(null); // 오늘의 책 dom요소 참조
    const descRef = useRef(null); // 제목 하위 설명 요소 참조
    const contentRef = useRef(null); // 도서 슬라이드 요소 참조
   
    // 화면이 렌더링 될 때
    useEffect(() => {

        // 제목 각각의 글자 모두 선택
        const titleSpans = titleRef.current.querySelectorAll(".text-dot");

        // timeline 생성, 한 번만 실행 (once: true)
        const timeLlne = gsap.timeline({
            scrollTrigger:{
                trigger: sectionRef.current,
                start: "top 50%",
                toggleActions: "play none  none none", // onEnter, onLeav, onEnterBack, onLeaveBack
                //toggleActions: "play reset  play reset", // onEnter, onLeav, onEnterBack, onLeaveBack
            },
        })

        //제목열
        timeLlne.from(titleSpans,{
            y: 30,
            opacity: 0,
            scale: 0.9,
            stagger: 0.15,
            duration: 0.5,
            ease: "back.out(1.5)", // 튀는 느낌
        })

        //desc
            .from(descRef.current,{
                y: 20,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
                },
                "+=0.1" // 글자 튀기고 나서 딜레이
            )

        // 슬라이드 컨텐츠
            .from(contentRef.current,{
                y: 20,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
            }, "-=0.4" )

    },[])
    
    return (
        <>
            <section  ref={sectionRef}  className="section books">
                <div className="sc-inner">
                    <h2  ref={titleRef} className="sc-title m-tit d-flex justify-content-center">
                        <span className="text-dot">오</span>
                        <span className="text-dot">늘</span>
                        <span className="text-dot">의</span>
                        <span className="text-dot ms-5">책</span>
                    </h2>
                    <p ref={descRef}  className="desc">하루의 끝, 당신에게 닿을 한 권의 이야기</p>
                    {/*도서 슬라이드*/}

                    <div ref={contentRef}  className="sc-content">
                        <div className="nav" role="tablist"
                             aria-orientation="vertical">
                            <button className={`nav-link custom-outline-btn ${activeTab === "national" ? "active" : ""}`}
                                    type="button" role="tab" aria-selected={activeTab === "national" ? "true" : "false"}  onClick={() => setActiveTab("national")}>국내도서
                            </button>
                            <button className={`nav-link custom-outline-btn ${activeTab === "foreigner" ? "active" : ""}`} type="button" role="tab"
                                    aria-selected={activeTab === "foreigner" ? "true" : "false"} onClick={() => setActiveTab("foreigner")}>국외도서
                            </button>
                            <button className={`nav-link custom-outline-btn ${activeTab === "ebook" ? "active" : ""}`} type="button" role="tab"
                                    aria-selected={activeTab === "ebook" ? "true" : "false"} onClick={() => setActiveTab("ebook")}>ebook
                            </button>
                        </div>
                        <div className="tab-content">
                            <div className="tab-inner">
                                <MainBookSlide slideData={slideData[activeTab]} naviId={activeTab} activeTab={activeTab}/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default SectionBooks;