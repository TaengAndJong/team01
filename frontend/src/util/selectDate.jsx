

/**
 * 옵션 리스트 생성 함수
 * @param {number} start - 시작 값
 * @param {number} end - 끝 값
 * @param {string} suffix - 옵션 라벨에 붙을 문자열 (ex. "년", "월", "일")
 * @param {boolean} pad - 값에 0을 패딩할지 여부 (true일 경우 두 자리로 맞춤) == 빈자리 0으로 채움
 * @returns {Array} 옵션 리스트
 */
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
