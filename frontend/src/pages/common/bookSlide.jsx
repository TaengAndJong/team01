import {useEffect, useRef} from 'react';

import  {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, Navigation, Pagination} from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ImgBaseUrl from "@/util/imgBaseUrl";

const BookSlide = ({slideData}) =>{
    // 받아온 props의 값을 왼쪽의 변수에 구조분해할당해주기( 데이터 분해 방향은 오른쪽에서 왼쪽)
    const imgList = slideData.bookImgList; // 배열로 넘어오면 변수에 저장하면 됨!
    const swiperRef = useRef(null);

    console.log("imgList---------------",imgList);


    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.update(); // 슬라이드 상태 갱신, 정지상태
            swiperRef.current.slideNext(); // 슬라이드 초기값이 다음으로 이동
        }
    }, [imgList]);



    return (
        <>
            {
                /*
AutoPlay도 module에서  import 하고  옵션에 담아줘야함
loop value true로 하면 pagenation 에러 및 loop length not enough 에러 발생 */}
            <Swiper
                ref={swiperRef}
                modules={[Pagination, Navigation, Autoplay]}
                slidesPerView={1}
                slidesPerGroup={1}
                spaceBetween={20}
                onSlideChange={() => console.log('slide change')}
                pagination={{
                    type: 'fraction',//숫자
                }}
                navigation={{
                    nextEl: '.custom-next',
                    prevEl: '.custom-prev',
                }}
                loop={imgList?.length > 1}
                centeredSlides={true}
                autoplay={{delay: 2000, disableOnInteraction: false}}
                speed={700}
                observer={true}
                observeParents={true}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper; // Swiper 인스턴스를 저장
                }}
            >
                {/*객체를 할당 받으면 반드시 데이터 null || undefined 체크하기위해 옵셔널체이닝 사용하기*/}
                {imgList?.map((item, index) => {

                    return (
                        <SwiperSlide key={`slide-${index}`}>
                            <div className="img-box">
                                <div className="img-inner">
                                    {/*<img className="img" src={ImgBaseUrl(item.bookImgList)} alt="도서이미지"/>*/}
                                    <img className="img" src={ImgBaseUrl(item)} alt="도서이미지"/>
                                </div>
                            </div>
                        </SwiperSlide>

                    );
                })}

            </Swiper>

            <button type="button" className="swiper-button custom-prev" aria-label="이전 슬라이드">
                <span className="sr-only">이전슬라이드</span>
            </button>
            <button type="button" className="swiper-button custom-next" aria-label="다음 슬라이드">
                <span className="sr-only">다음슬라이드</span>
            </button>

        </>
    );
}

export default BookSlide;