export const maskUserId = (userId) => {
  if(!userId) return "";
  const len = userId.length;

    if (len <= 4) {
        return "*".repeat(len);
    }

    // 앞 2글자 + 뒤 2글자만 보여주고 나머지는 * 처리
    const start = userId.slice(0, 2);
    const end = userId.slice(len - 2);
    const masked = "*".repeat(len - 4);

    return start + masked + end;
}