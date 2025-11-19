import {useEffect, useRef, useState} from 'react';

import  {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, Navigation, Pagination} from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {Link} from "react-router-dom";


const  PopularBookSlide= ({slideData}) =>{

    console.log("slideData --------PopularBookSlide",slideData);

    //서드파트 인스턴스 직접 제어
    const swiperRef = useRef(null);
    // 보여주는 슬라이드 개수
    const ctrlViewCount = swiperRef?.current?.params.slidesPerView;
    //재생,정지 상태관리 변수
    const [play,setPlay] = useState(true);// 기본값은 재생(true)

    //정지,재생 컨트롤 메서드
    const playAndPause=()=>{
        console.log("pause----- 슬라이드 정지");
        if (!swiperRef.current) return; // 현재 슬라이드가 아니면 코드 종료

        if(swiperRef.current.autoplay.running){ // 자동재생중이면 == true
            console.log("swiperRef.current---- pause",play);
            swiperRef.current.autoplay.stop();// 정지
        }else { // false
            console.log("swiperRef.current---- play",play);
            swiperRef.current.autoplay.start();//재생
        }
        //상태값을 재생상태관리 변수에 반영;
        setPlay((prev) => !prev);
        //이전값을 기반으로 초기값 변경해야 안전
        // 재생이면 !ture == false , 정지이면 !false == true // 로 상태관리 재설정
    }


    return (
        <>

            <Swiper
                ref={swiperRef}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper; // Swiper 인스턴스를 저장
                }}
                modules={[Pagination, Navigation, Autoplay]}
                className="slide-list clearfix"
                direction="vertical"
                //pagination={activeTab === naviId ? customPagination : false}
                loop={ctrlViewCount+1}
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                navigation={{ // 각 탭의 슬라이드의 컨트롤을 각각 적용해줘야 기능이 적용됨
                    nextEl: `.custom-next-popular`,
                    prevEl: `.custom-prev-popular`
                }}
                slidesPerView={2} // 총 보여지는 슬라이드 개수
                slidesPerGroup={1}//넘어가는 슬라이드 개수
                speed={700}// 슬라이드 속도
                observer={true}
                observeParents={true}
                // onSlideChange={() => console.log('popularSlide')}
            >

                {slideData?.length > 0 ? (
                    slideData?.map((item) => (
                        <SwiperSlide key={`slide-${item.bookId}`}>
                            <Link className="slide-link" to={item.detailUrl} title={`${item.bookName}도서 상세페이지 바로가기`}>
                                <span className="cateName">{item.bookCateNm}</span>
                                <strong className="tit">
                                    <em>{item.bookName}</em>
                                </strong>
                                <span className="author">
                                {item.author}
                            </span>
                                <div className="img-box">
                                    <div className="img-inner">
                                        <img className="img" src={item.bookImgList?.[0]} alt={item.bookName}/>
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))
                ) : (
                    <SwiperSlide>
                        <div className="nodata-slide">
                            <p>해당 도서 데이터가 없습니다.</p>
                        </div>
                    </SwiperSlide>
                )}

            </Swiper>

            {slideData?.length >  ctrlViewCount && (
                <div className="button-group">
                    {/*이전*/}
                    <button type="button" className={`swiper-button bordered custom-prev custom-prev-popular`}>
                        <span className="sr-only">이전슬라이드</span>
                    </button>
                    {/*재생 & 정지 */}
                    <button type="button"
                            className={`swiper-button bordered ${play ? `swiper-button-stop` : `swiper-button-start`}`}
                            onClick={() => {
                                playAndPause()
                            }}>
                        <span className="sr-only"> {play ? '정지' : '재생'}</span>
                    </button>
                    {/*다음*/}
                    <button type="button" className={`swiper-button bordered custom-next custom-next-popular`}>
                        <span className="sr-only">다음슬라이드</span>
                    </button>
                </div>
            )}

        </>

    );
}

export default PopularBookSlide;