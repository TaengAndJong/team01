import FormTag from "../../../util/formTag.jsx";
import React, {useEffect, useRef, useState} from "react";


const FileUpload =({bookImg,setBookImg})=>{//부모한테 받은 props 객체 기입

    // //files 객체 bookCreate의 bookImg에 배열로 담는 핸들러
    // const handleFilesChange = (files) => {
    //     console.log("handelfilesChang 객체확인",files);
    //     setBookImg((prev) => ({
    //         ...prev,
    //         bookImg: files, // 파일 목록 갱신
    //     }));
    // };

    // 파일 선택 핸들러
    const handleImgUpload = (e) => {
        console.log("selectedFiles-------", e.target.files);
        //파일 여러개 지정할 경우 배열객체로 변환필요 
        const selectedFiles = Array.from(e.target.files);
        console.log("selectedFiles-------", selectedFiles);
        const updateFiles= [...bookImg, ...selectedFiles] // 기존파일목록 + 새로운 파일목록
        setBookImg(updateFiles);// 변경된 파일도 반영해서 데이터 갱신

    };

    // 파일 삭제 핸들러
    const handleRemoveFile = (file) => {

        console.log("file-------",file);
        console.log("file.name-------",file.name);
        // ' _ ' 언더스코어는 파일 객체를 사용하지않기 때문에 건너띄기위해서 사용
        //선택된 요소의 인덱스가 아닌 파일 객체들만 반환
        const updatedFiles = bookImg.filter((item) => item.name !== file.name);
        console.log("updatedFiles11 ------",updatedFiles); // 여기까지코드는 삭제한 이후 파일 목록만 남아있음
        //삭제한 파일제외한 객체들 갱신 === 비동기 상태 업데이트라서 바로 갱신된 값확인 안되며,  
        //확인하고 싶을 경우, useEffect 사용하기
        setBookImg(updatedFiles);
        console.log("삭제후 파일들 ------",bookImg);

    };


    return (
        <>
            <FormTag id="bookImgPath" label="도서이미지" labelClass="input-group-text" className="form-control" name="bookImgPath" type="file"
                     placeholder="도서 이미지 파일업로드"
                     onChange={handleImgUpload}
                     multiple={true}
            />
            {/* 선택된 파일 목록 표시 (파일이 있을 때만) */}
            {bookImg.length > 0 && (
                <ul>
                    {bookImg.map((file, index) => (
                        <li key={index}>
                            {file?.name}
                            <button type="button" onClick={() => handleRemoveFile(file)}>삭제</button>
                        </li>
                    ))}
                </ul>
                )
            }

        </>
    )
}

export default FileUpload;