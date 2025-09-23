import {useEffect, useRef, useState} from 'react';

import  {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, Navigation, Pagination} from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {Link} from "react-router-dom";


const RecentViewSlide = ({slideData}) =>{

    console.log("RecentViewSlide slideData--------",slideData);

    //서드파트 인스턴스 직접 제어
    const swiperRef = useRef(null);

    //탭이 변경될 때마다 실행
    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(0); // 슬라이드를 첫번째로 이동
           // swiperRef.current.autoplay.start(); // 자동 시작
        }
    },[]);//slideData 가 변경될때마다해줘야 ?

    return (
        <>
            {/*
                Swiper 속성
                1) ref  : DoM요소 참조가 아니라 컴포넌트 자체를 지칭할 수 도 있음
                2) onSwiper : Swiper 인스턴스를 명확하게 가져올 수 있음.
                  - 역할: swiper 컴포넌트를 렌더링 하면 내부적으로 Swiper 클래스 인스턴스가 생성
                        내부에는 autoplay, slideTo, navigation 등 모든 제어 메서드가 담겨잇음
                   **** 중요 ****
                   onSwiper 의 파라미터는 해당 swiper 객체를 의미하며, 이 객체를 swiperRef의 current 에 할당해줌으로써
                   현재 구동되는 swiper 슬라이드 객체에 접근이 가능해짐
            */}


            <Swiper
                ref={swiperRef}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper; // Swiper 인스턴스를 저장
                }}
                modules={[Pagination, Navigation]}
                className="slide-list clearfix"
                slidesPerView={Math.min(4, slideData?.length || 1)}
                // 총 보여지는 슬라이드 개수
                slidesPerGroup={1}//넘어가는 슬라이드 개수
                speed={700}// 슬라이드 속도
                navigation={{ // 각 탭의 슬라이드의 컨트롤을 각각 적용해줘야 기능이 적용됨
                    nextEl: `.custom-next`,
                    prevEl: `.custom-prev`
                }}
                observer={true}
                observeParents={true}
                onSlideChange={() => console.log('recentViewSlide')}
            >
                {slideData?.map((item) => (
                    <SwiperSlide key={`slide-${item.bookId}`}>
                        <Link to={item.detailUrl} title={`${item.bookName}도서 상세페이지 바로가기`}>
                            <div className="img-box">
                                <div className="img-inner">
                                    <img className="img" src={item.bookImgList?.[0]} alt={item.bookName} />
                                </div>
                            </div>
                            <div className="txt-box">
                                <span className="tit bold d-block">{item.bookName}</span>
                                <span className="tit bold d-block">{item.author}</span>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="button-group">
                {/*이전*/}
                <button type="button" className={`swiper-button bordered custom-prev custom-prev`}>
                    <span className="sr-only">이전슬라이드</span>
                </button>
                {/*다음*/}
                <button type="button" className={`swiper-button bordered custom-next custom-next`}>
                    <span className="sr-only">다음슬라이드</span>
                </button>
            </div>
        </>

    );
}

export default RecentViewSlide;