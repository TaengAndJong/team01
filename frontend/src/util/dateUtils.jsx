/**
 * 옵션 리스트 생성 함수
 * @param {number} start - 시작 값
 * @param {number} end - 끝 값
 * @param {string} suffix - 옵션 라벨에 붙을 문자열 (ex. "년", "월", "일")
 * @param {boolean} pad - 값에 0을 패딩할지 여부 (true일 경우 두 자리로 맞춤) == 빈자리 0으로 채움
 * @returns {Array} 옵션 리스트
 */
//회원가입 날짜선택
export const generateOptions = (start, end, suffix = "", pad = false) => {
    return Array.from({ length: end - start + 1 }, (_, i) => {
        const value = start + i;
        // console.log("test generateOption",`${pad ? String(value).padStart(2, "0") : value}${suffix}`);
        return {
            value,
            label: `${pad ? String(value).padStart(2, "0") : value}${suffix}`,
        };
    });
};

//재사용성과 가독성을 위한 보편적인 날짜 유틸

// 오늘 날짜 반환 (서버로 보내는 date객체 타입 날짜로 데이터베이스의 시간형식은  LocalDateTime으로 년,월,일, 시, 분, 초 까지 전송해야함)
export const getToday = (separator = ".") => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const hh = String(today.getHours()).padStart(2, "0");
    const min = String(today.getMinutes()).padStart(2, "0");
    const ss = String(today.getSeconds()).padStart(2, "0");

    return `${yyyy}${separator}${mm}${separator}${dd} ${hh}:${min}:${ss}`;
};


// 한국식 날짜로 변환 ==> 클라이언트에게 보여줄 날짜형식
export const formatToDate = (toDate) => { // new Date() 객체를 파라미터로 넘겨 줌
    if (!toDate) return ""; // 객체가 없다면  "" (빈 문자열로) 반환
    //있다면 형식 변경
    const yyyy = toDate.getFullYear();
    const mm = String(toDate.getMonth() + 1).padStart(2, "0");
    const dd = String(toDate.getDate()).padStart(2, "0");
    //최종반환 날짜형식
    return `${yyyy}.${mm}.${dd}`;
};

