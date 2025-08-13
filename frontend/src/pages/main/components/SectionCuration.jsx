import {useEffect, useState} from "react";
import axios from "axios";

const SectionCuration = () => {

    return (
        <>
            <section className="section curation">
                <div className="sc-inner">
                    <div className="d-flex align-items-start w-50">
                        <h3>인기도서</h3>
                        <ul>
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                        </ul>
                    </div>
                    <div className="d-flex align-items-start w-50">
                        <h3>추천도서</h3>
                        <ul>
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                        </ul>
                    </div>
                </div>
            </section>

        </>
    )
}

export default SectionCuration;