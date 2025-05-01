import FormTag from "../../../util/formTag.jsx";
import React, {useEffect, useRef, useState} from "react";


const FileUpload =({bookImg,setBookImg,defualtData,setCreateBook})=>{//부모한테 받은 props 객체 기입

    console.log("--1",bookImg);
    console.log("defualtData--------------imgfile",defualtData);


    // defualtData 가 있으면, bookImg 재설정, 이전데이터를 유지하기위한 prevState 파라미터, defualtData가 변경될때마다 실행해야하니까 의존성배열 추가
    useEffect(() => {
        // 기존 이미지파일이 존재할 경우,( 문자열로 들어오기때문에 타입 검증)
        // .split() 함수를 사용해 문자열을 배열로 반환 ==> 키가 name인 객체로 담아야함
        //existing은 등록을 통해 서버에 존재하는 파일을 담은 객체
      if(defualtData){ // 수정페이지에서 기존 이미지 데이터가 있으면 조건
          setBookImg((prev)=>({
              ...prev,
              existing: typeof defualtData === 'string'? defualtData.split(',').map((fileName) => ({ name: fileName }))
                  : defualtData || [],
          }))
      }

    }, [defualtData]);

    console.log("bookImg--2",bookImg);
    console.log("bookImg--typeof",typeof bookImg.existing); // String 타입
    // 파일 선택 핸들러
    const handleImgUpload = (e) => {
        //이벤트요소로 파일 객체에 접근, 파일 여러개 지정할 경우 배열로 변환필요
        const selectedFiles = Array.from(e.target.files);
        setBookImg((prev)=>({
            ...prev, // ??
            new:[...prev.new,...selectedFiles] // 먼저 등록된 파일 + 새로 등록되는 파일드을
        }));

    };

    //삭제 핸들러
    const handleRemoveFile = (file, type) => {
        setBookImg((prev) => {
            const updated = {
                ...prev,
                [type]: prev[type].filter((f) => f.name !== file.name),
            };

            // 서버에 존재하는 기존 파일만 removed에 추가
            if (type === "existing") {
                updated.removed = [...prev.removed, file];
            }

            return updated;
        });
    };

    console.log("bookImg--3 existing 배열로 반환확인",bookImg);

    // 파일 리스트 출력
    const renderFileList = (files, type) => (
        <ul>
            {files.map((file, index) => (
                <li key={index}>
                    {file.name}
                    <button type="button" onClick={() => handleRemoveFile(file, type)}>
                        삭제
                    </button>
                </li>
            ))}
        </ul>
    );

    return (
        <>
            <FormTag id="bookImgPath" label="도서이미지" labelClass="input-group-text" className="form-control" name="bookImgPath" type="file"
                     placeholder="도서 이미지 파일업로드"
                     onChange={handleImgUpload}
                     multiple={true}
            />
            {/* 기존 이미지 리스트 */}
            {bookImg?.existing?.length > 0 && renderFileList(bookImg.existing, "existing")}
            {/* 새로 추가된 이미지 리스트 */}
            {bookImg?.new?.length > 0 && renderFileList(bookImg.new, "new")}

        </>
    )
}

export default FileUpload;