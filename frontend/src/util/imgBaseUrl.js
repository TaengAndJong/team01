// src/util/imgBaseUrl.js

const BASE_URL = import.meta.env.VITE_BASE_URL;
console.log("BASE_URL",BASE_URL)

const ImgBaseUrl=((fileName)=>{

    // 파일명이 없으면 기본 이미지
    if (!fileName) {
        return `${BASE_URL}images/noImg.png`;
    }

    // noimg 처리
    if (fileName.toLowerCase() === "noimg.png") {
        return `${BASE_URL}images/noImg.png`;
    }
    return `${BASE_URL}uploads/book/${fileName}`;
})

export default ImgBaseUrl;
