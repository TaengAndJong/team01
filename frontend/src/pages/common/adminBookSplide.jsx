import { React } from 'react';

import  {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, Navigation, Pagination} from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import 'swiper/scss';
// import 'swiper/scss/navigation';
// import 'swiper/scss/pagination';

const AdminBookSplide = ({bookDetail}) =>{
    // 받아온 props의 값을 왼쪽의 변수에 구조분해할당해주기( 데이터 분해 방향은 오른쪽에서 왼쪽)
    const {bookImgList,bookCateNm} = bookDetail;

    return (
        <>
            {/*
             AutoPlay도 module에서  import 하고  옵션에 담아줘야함 
             loop value true로 하면 pagenation 에러 및 loop length not enough 에러 발생 */}
            <Swiper
                modules={[Pagination, Navigation,Autoplay]}
                slidesPerView={1}
                slidesPerGroup={1}
                spaceBetween={20}
                onSlideChange={() => console.log('slide change')}
                navigation={true}
                pagination={{
                    type: 'fraction',//숫자
                }}
                loop={bookImgList?.length>=0}
                centeredSlides={true}
               autoplay={{ delay: 2000, disableOnInteraction: false }}
                speed={700}
            >
                {/*객체를 할당 받으면 반드시 데이터 null || undefined 체크하기위해 옵셔널체이닝 사용하기*/}

                {bookImgList?.map((item,index)=>{

                return (
                    <SwiperSlide  key={`slide-${index}`}>
                        <div className="imgCard">
                            <div className="imgCardInner">
                                <img src={`http://localhost:8081/uploads/book/${item}`} alt="도서이미지" />
                            </div>
                        </div>
                    </SwiperSlide>
                );
            })}

            </Swiper>
        </>
    );
}

export default AdminBookSplide;