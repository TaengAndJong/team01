import {useEffect, useState} from "react";
import axios from "axios";
import PopularBookSlide from "./popularBookSlide.jsx";
import RecomBookSlide from "./recomBookSlide.jsx";

const SectionCuration = ({popularData,recomData}) => {

    return (
        <>
            <section className="section curation">
                <div className="sc-inner">
                    <div className="sc-content">
                        <div className="book popular">
                            <h3 className="sc-title s-tit"><span>인기도서</span></h3>
                            <PopularBookSlide slideData={popularData ?? []}/>
                        </div>
                        <div className="book recommend">
                            <h3 className="sc-title s-tit"><span>추천도서</span></h3>
                            <RecomBookSlide slideData={recomData ?? []}/>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default SectionCuration;