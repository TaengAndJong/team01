import {useEffect, useRef, useState} from 'react';

import  {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, Navigation, Pagination} from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {Link} from "react-router-dom";
import ImgBaseUrl from "@/util/imgBaseUrl";

/*
* 자동플레이를 하지않을경우 ,커스텀 버튼은 ref 리액트 훅으로
* 상태관리를 직접 관리해 스와이퍼의 초기화 시점을 맞추어야 작동함
* */

const RecentView = ({slideData}) =>{


    //서드파트 인스턴스( 스와이퍼 슬라이드 ) 직접 제어
    const swiperRef = useRef(null);
    //슬라이드 버튼 제어
    const prevRef = useRef(null); 
    const nextRef = useRef(null);
    //탭이 변경될 때마다 실행
    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(0); // 슬라이드를 첫번째로 이동
        //    swiperRef.current.autoplay.start(); // 자동 시작
        }
    },[slideData]);//slideData 가 변경될때마다해줘야 ?

    //슬라이드 데이터가 없을 경우 분기
    let slides = slideData ? [...slideData] : []; //데이터가 있으면 기존 데이터 복사, 아니면 빈배열
    
    //데이터가 없을경우 , 조건을 분기해줄 플래그 선언
    if (slides.length === 0) {

        slides.push({ noData: true }); // slide 데이터에 noData 속성이 true 이면 데이터 없음 컴포넌트 출력
    }

    const totalSlid = 4;
    while(slides.length < totalSlid){
        slides.push({ noData: true });
    }


    return (
        <>
            <Swiper
                ref={swiperRef}
                onSwiper={(swiper) => {
                swiperRef.current = swiper; // Swiper 인스턴스를 저장
                }}
                modules={[Pagination, Navigation]}
                className="recent-slide clearfix mt-5"
                slidesPerView={4}  // 총 보여지는 슬라이드 개수
                slidesPerGroup={1}//넘어가는 슬라이드 개수
                spaceBetween={15}
                speed={700}// 슬라이드 속도
                navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                }}
                loop={slideData?.length>4? true:false}//
                observer={true}
                observeParents={true}
                onBeforeInit={(swiper) => {
                    // 버튼 ref를 Swiper에 연결
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                }}
                // onSlideChange={() => console.log('recent-slide')}
            >
                {slides?.map((item,index) => (
                    <SwiperSlide key={`slide-${item?.book?.bookId} || nodata-${index}`} className="li">
                        {item.noData? (
                            <>
                                <div className="link" >
                                    <div className="txt-box">
                                        <span className="tit bold d-block">최근 본 도서 없음</span>
                                    </div>
                                </div>
                            </>
                        ):(
                            <Link className="link" to={item.book.detailUrl} title={`${item.book.bookName}도서 상세페이지 바로가기`}>
                                <div className="img-box">
                                    <div className="img-inner">
                                        <img className="img" src={ImgBaseUrl(item.book.bookImgList?.[0])} alt={item.book.bookName}/>
                                    </div>
                                </div>
                                <div className="txt-box">
                                    <span className="tit bold d-block">{item.book.bookName}</span>
                                    <span className="tit bold d-block">{item.book.author}</span>
                                </div>
                            </Link>
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="button-group">
                {/*이전*/}
                <button type="button" ref={prevRef} className={`swiper-button bordered custom-prev custom-prev-recent`}>
                    <span className="sr-only">이전슬라이드</span>
                </button>
                {/*다음*/}
                <button type="button" ref={nextRef} className={`swiper-button bordered custom-next custom-next-recent`}>
                    <span className="sr-only">다음슬라이드</span>
                </button>
            </div>
        </>


)
}

export default RecentView;