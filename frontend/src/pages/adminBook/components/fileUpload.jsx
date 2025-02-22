import FormTag from "../../../util/formTag.jsx";
import React, {useEffect, useState} from "react";


const FileUpload =({files,setFiles,handleFilesChange})=>{//부모한테 받은 props 객체 기입


    // 파일 선택 핸들러
    const handleImgUpload = (e) => {
        console.log("selectedFiles-------", e.target.files);
        //파일 여러개 지정할 경우 배열객체로 변환필요 
        const selectedFiles = Array.from(e.target.files);
        console.log("selectedFiles-------", selectedFiles);

        //파일 관리 객체에 파일 갱신
        setFiles((prevFiles) => {
            //파일 초기데이터 갱싱
           const updateFiles= [...prevFiles, ...selectedFiles] // 기존파일목록 + 새로운 파일목록
            // 파일 초기 데이터 갱신되면 BookImg에 담는 함수 실행, 파라미터는 갱신된 파일목록들 ==> 부모로전달
            handleFilesChange(updateFiles);  // bookCreate 이미지갱신
            return updateFiles;// 파일 객체의 초기값 갱신 
        });

    };

    // 파일 삭제 핸들러
    const handleRemoveFile = (index) => {
        // ' _ ' 언더스코어는 파일 객체를 사용하지않기 때문에 건너띄기위해서 사용
        //선택된 요소의 인덱스가 아닌 파일 객체들만 반환
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles); // 부모컴포넌트의 상태값 변경점

    };




    return (
        <>
            <FormTag label="도서이미지" labelClass="input-group-text" className="form-control" name="bookImg" type="file"
                     placeholder="도서 이미지 파일업로드"
                     onChange={handleImgUpload}
                     multiple={true}
            />
            {/* 선택된 파일 목록 표시 (파일이 있을 때만) */}
            {files.length > 0 && (
                <ul>
                    {files.map((file, index) => (
                        <li key={index}>
                            {file.name}
                            <button type="button" onClick={() => handleRemoveFile(index)}>삭제</button>
                        </li>
                    ))}
                </ul>
                )
            }

        </>
    )
}

export default FileUpload;