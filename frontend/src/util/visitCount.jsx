export const recordVisit = async (pageUrl) => {
  const payload = {
    pageUrl,
    userAgent: navigator.userAgent,
  };

  try {
    await fetch("/api/check/visit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // JSON 형식임을 서버에 알림
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("방문 기록 통신 실패", err);
  }
};
