export const scrollTop = (duration) => {
  // 기본값 600  onClick(()=>scrollTop(800)) 이벤트 숫자를 늘리면 더 느리게, 줄이면 더 빠르게 스크롤 가능
  console.log("스크롤 버튼 실행");
  const durationTime = duration ?? 300 // duration 미 설정시 (undefined)일 경우, 300초

  const start = window.scrollY; // 현재 스크롤 위치
  const startTime = performance.now(); // 애니메이션 시작 시점 (ms) 단위로 알려줍니다.

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime; // 경과 시간
    const progress = Math.min(elapsed / durationTime, 1); // 진행도 (0~1)
    const ease = 1 - Math.pow(1 - progress, 3); // 속도 곡선 easeOutCubic

    window.scrollTo(0, start * (1 - ease)); // 스크롤 위치 이동

    if (progress < 1) {
      requestAnimationFrame(animate); // 다음 프레임에서 다시 실행
    }
  };

  requestAnimationFrame(animate);
};
