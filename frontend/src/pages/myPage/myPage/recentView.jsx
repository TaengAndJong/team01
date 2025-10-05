import {useEffect, useRef, useState} from 'react';

import  {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, Navigation, Pagination} from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {Link} from "react-router-dom";


const RecentView = ({data}) =>{

    console.log("RecentView--------",data);
    return (
        <ul className="recent-slide box-list">
            {data.map((item, index) => (
                <li key={index} className="li">
                    {/*link에서는 상대경로만 전달*/}
                    <Link className="link" to={item.book.detailUrl} title={`${item.book.bookName}도서 상세페이지 바로가기`}>
                        <div className="img-box">
                            <div className="img-inner">
                                <img className="img" src={item.book.bookImgList?.[0]} alt={item.book.bookName} />
                            </div>
                        </div>
                        <div className="txt-box">
                            <span className="tit bold d-block">{item.book.bookName}</span>
                            <span className="tit bold d-block">{item.book.author}</span>
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    )
}

export default RecentView;