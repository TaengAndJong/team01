import React, {useState} from "react";

const WishBtn = ({wishIds,setWishIds,bookId}) =>{

    //서버에서 클라이언트까지 응답이 도달할 때까지의 상태관리
    const [isLoading, setIsLoading] = useState(false);

    //찜목록 비동기 fetch 요청
    const wishFetch = async(bookId) =>{

        // bookId는 쿼리스트링보다 body 에 담아주는게 더 나음
        const UrlSearchParams = new URLSearchParams();
        UrlSearchParams.append("bookId", bookId);
        console.log("bookId wishList",bookId);
        //경로에 bookId 담아서 보내기
        const response = await fetch(`/api/mypage/wishlist/save?${UrlSearchParams.toString()}`, {
            method: "POST"
        });

        if(!response.ok){
            console.log("비동기 요청 실패")
            throw Error(response.statusText);
        }

        // wishIds 값 재설정할 때에 이전 상태값에 대해서 bookId가 있는 지 확인후 동일한 bookId 이면 필터링해서 새배열반환, 없으면 기존배열을 복사 후 bookId 추가
        setWishIds((prev) =>
            prev.includes(bookId) //bookId를 포함하고 있다면
                ? prev.filter((id) => id !== bookId) // 제거
                : [...prev, bookId] // 없으면 추가
        );
    }

    //찜목록 핸들러
    const wishHandler=(bookId)=>{
        // 클릭하면 selected 클래스 추가,
        //찜버튼 누르면 전송 되기 전까지 disable 되게  해야하나?
        if (isLoading) return;      // 클라이언트가 서버로 정보 요청 중이면 중단
        setIsLoading(true);         // 클라이언트가 서버로 요청 중

        //bookId를 받아서 비동기요청, 컨트롤러로 전송
        try{
            console.log("찜목록 페치요청 보내는 듕")
            wishFetch(bookId);

        }catch(e){
            console.error("찜 토글 실패", e);
        } finally {
            setIsLoading(false);      // 응답 완료되면 다시 클릭 가능하게 설정
        }
    }


    return (
        <>
            <button type="button"
                    className={`submit btn me-2 icon wish ${wishIds.includes(bookId) ? "selected" : ""}`}
                    onClick={() => wishHandler(bookId)}>
                <span className="sr-only">위시리스트에 담기</span>
            </button>
        </>
    )
}

export default WishBtn;