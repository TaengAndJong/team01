import {useEffect, useRef, useState} from 'react';

import  {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, Navigation, Pagination} from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {Link} from "react-router-dom";


const MainBookSlide = ({slideData,naviId,activeTab}) =>{

    console.log("slideData --------mainbookS",slideData);
    console.log("slideData --------naviId",naviId);
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

    const customPagination = {
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '">' +'<i class="sr-only">'+ (naviId)+'의'+ (index + 1) + '번째 슬라이드</i></span>';
        },
    }

    //탭이 변경될 때마다 실행
    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(0); // 슬라이드를 첫번째로 이동
            swiperRef.current.autoplay.start(); // 자동 시작
        }
    }, [naviId]); // naviId 가 변경되는 탭도 변경되기때문에 , 변경될 때마다 슬라이드 초기화 및 자동 시작

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
                modules={[//Pagination,
                    Navigation, Autoplay]}
                pagination={activeTab === naviId ? customPagination : false}
                loop={ctrlViewCount+1}//
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                slidesPerView={Math.min(5, slideData?.length || 1)}
                // 총 보여지는 슬라이드 개수
                slidesPerGroup={1}//넘어가는 슬라이드 개수
                spaceBetween={20}
                speed={700}// 슬라이드 속도
                navigation={{ // 각 탭의 슬라이드의 컨트롤을 각각 적용해줘야 기능이 적용됨
                    nextEl: `.custom-next-${naviId}`,
                    prevEl: `.custom-prev-${naviId}`
                }}
                observer={true}
                observeParents={true}
                onSlideChange={() => console.log('mainbookSlide')}
            >
                {slideData?.length >0 ? (
                    slideData?.map((item) => (
                        <SwiperSlide key={`slide-${item.bookId}`}>
                            <Link to={item.detailUrl} className={"book-link"} title={`${item.bookName}도서 상세페이지 바로가기`}>
                                <div className="img-box">
                                    <div className="img-inner">
                                        <img className="img" src={item.bookImgList?.[0]} alt={item.bookName} />
                                    </div>
                                </div>
                                <div className="txt-box">
                                    <strong className="tit bold d-block">
                                        <em>{item.bookName}</em>
                                    </strong>
                                    <span className="tit bold d-block">{item.author}</span>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))
                ):(
                    <SwiperSlide>
                        <div className="nodata-slide">
                            <p>해당 도서 데이터가 없습니다.</p>
                        </div>
                    </SwiperSlide>
                )

                }
            </Swiper>

            {slideData?.length > ctrlViewCount && (
                <div className="button-group">
                    {/*이전*/}
                    <button type="button" className={`swiper-button bordered custom-prev custom-prev-${naviId}`}>
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
                    <button type="button" className={`swiper-button bordered custom-next custom-next-${naviId}`}>
                        <span className="sr-only">다음슬라이드</span>
                    </button>
                </div>
            )}

        </>

    );
}

export default MainBookSlide;