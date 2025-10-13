// 파일 확장자 탐지 함수
const detectFileType = (base64String) => {
  const signatures = {
    "/9j/": "jpg",
    iVBORw0KGgo: "png",
    R0lGOD: "gif",
    Qk: "bmp",
    UklGR: "webp",
    AAABAAEA: "ico",
    JVBERi0: "pdf",
    UEsDB: "zip",
    SUQz: "mp3",
  };
  // 반복문 사용하여 파일 확장자 탐지
  for (const [signature, type] of Object.entries(signatures)) {
    if (base64String.startsWith(signature)) {
      return type;
    }
  }

  return "unknown";
};

// 파일 다운로드 함수
export const handleFileDownload = (fileName, fileData) => {
  try {
    const fileType = detectFileType(fileData);

    // base64 디코딩
    const binaryString = atob(fileData);

    // 바이트 배열로 변환
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i); // 각 문자를 바이트로
    }

    const blob = new Blob([bytes], { type: `application/${fileType}` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);

      alert("파일 다운로드 를 완료했습니다");
    }, 800);
  } catch (error) {
    console.error("파일 다운로드 오류:", error);
  }
};
