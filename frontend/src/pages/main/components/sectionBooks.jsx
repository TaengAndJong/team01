import MainBookSlide from "./mainBookSlide.jsx";
import {useEffect, useRef, useState} from "react";



const SectionBooks= ({slideData})=>{
    console.log("SectionBooks  slideData",slideData);
    // 목표 : 현재탭일 경우에 해당 데이터만 슬라이드에 보여주기
    //slideData에 담긴 객체 구조분해 할당하기
    const {national,foreigner,ebook} = slideData ?? {}; // slideData가 있으면 구조분해 할당 없으면 빈 객체

    console.log("SectionBooks  national",national);
    console.log("SectionBooks  foreigner",foreigner);


    // 현재 활성탭 제어 상태관리 변수 ==> 부트스트랩 제어 말고 리액트로 active 제어
    const [activeTab, setActiveTab] = useState("national"); // 처음 보여줄 탭은 국내도서
    console.log("activeTab",activeTab);

    //
    useEffect(() => {

    },[])
    
    return (
        <>
            <section className="section books">
                <div className="sc-inner">
                    <h2 className="sc-tit">
                        <span className="text-dot">오</span>
                        <span className="text-dot">늘</span>
                        <span className="text-dot">의</span>
                        <span className="text-dot">책</span>
                    </h2>
                    <p className="desc">하루의 끝, 당신에게 닿을 한 권의 이야기</p>
                    {/*도서 슬라이드*/}

                    <div className="sc-content">
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