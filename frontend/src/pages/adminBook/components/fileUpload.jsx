import FormTag from "../../../util/formTag.jsx";
import React, {useEffect, useRef, useState} from "react";
import {useModal} from "../../common/modal/ModalContext.jsx";


const FileUpload =({bookImg,setBookImg,defaultData,setDefaultData})=>{//부모한테 받은 props 객체 기입


    //모달
    const {openModal,closeModal} = useModal();

    //최대 파일 사이즈, 총함 파일사이즈
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const maxTotalSize = 20 * 1024 * 1024; // 총합 20MB 제한 (옵션)

    // defaultData 가 있으면, bookImg 재설정, 이전데이터를 유지하기위한 prevState 파라미터, defaultData가 변경될때마다 실행해야하니까 의존성배열 추가
    useEffect(() => {

        console.log("--1",bookImg);
        console.log("defaultData-------------",defaultData);
        console.log("defaultData bookImg : newImg-------------",defaultData?.bookImg);

        // 기존 이미지파일이 존재할 경우,( 문자열로 들어오기때문에 타입 검증)
        // .split() 함수를 사용해 문자열을 배열로 반환 ==> 키가 name인 객체로 담아야함
        //existing은 등록을 통해 서버에 존재하는 파일을 담은 객체
      if(defaultData?.bookImgPath){ // 수정페이지에서 기존 이미지 데이터가 있으면 조건
          setBookImg((prev)=>({
              ...prev,
              existing: typeof defaultData.bookImgPath === 'string'? defaultData.bookImgPath.split(',').map((fileName) => ({ name: fileName }))
                  : defaultData.bookImgPath || [],
          }))
      }

    }, [defaultData]);

    console.log("bookImg--2",bookImg);
    console.log("bookImg--typeof",typeof bookImg.existing); // String 타입
    // 파일 선택 핸들러
    const handleImgUpload = (e) => {
        //이벤트요소로 파일 객체에 접근, 파일 여러개 지정할 경우 배열로 변환필요
        const selectedFiles = Array.from(e.target.files);

        //파일 용량 크기 제한
        const oversizedFiles = selectedFiles.filter(f => f.size > maxFileSize);
        if (oversizedFiles.length > 0) {
            openModal({
                data:{message : `업로드 실패: ${oversizedFiles.map(f => f.name).join(", ")}\n(각 파일은 5MB 이하만 업로드 가능합니다.)`}
            })
            e.target.value = ""; // 선택 초기화
            return;
        }

        const totalSize =
            [...(bookImg.new || []), ...selectedFiles].reduce((sum, f) => sum + (f.size || 0), 0);
        if (totalSize > maxTotalSize) {
            openModal({
                data:{message : `총 업로드 용량 초과 (${(totalSize / 1024 / 1024).toFixed(2)}MB).\n전체 파일 크기는 20MB 이하여야 합니다.`}
            })
            e.target.value = "";
            return;
        }
        
        // 파일 목록 갱신
        setBookImg((prev)=>({
            ...prev, // ??
            new:[...prev.new,...selectedFiles] // 먼저 등록된 파일 + 새로 등록되는 파일드을
        }));

    };

    //삭제 핸들러
    const handleRemoveFile = (file, type) => {
        console.log("파일 삭제중 ", file, type);

        setBookImg(prev => {
            //등록했을 경우, 이미지가 새로 생겼을 때
            const updatedNew = type === "new"
                ? prev.new.filter(f => f.name !== file.name)
                : prev.new;
            //수정했을경우 이미지가 존재할때
            const updatedExisting = type === "existing"
                ? prev.existing.filter(f => f.name !== file.name)
                : prev.existing;
            //이미 존재한 파일들을 삭제할 경우
            const updatedRemoved = type === "existing"
                ? [...prev.removed, file]
                : prev.removed;

            console.log("updatedExisting", updatedExisting);
            console.log("updatedRemoved", updatedRemoved);
            console.log("updatedNew", updatedNew);

            // 최종데이터객체에 반영
            // setDefaultData(prevData => ({
            //     ...prevData,
            //     bookImgPath: (updatedExisting?.map(f => f.name).join(",")) || ""
            // }));


            return {
                ...prev,
                existing: updatedExisting,
                removed: updatedRemoved,
                new: updatedNew,
            };
        });
    };

    useEffect(() => {
        // 기존 bookImg.existing이 바뀌었을 때만 실행
        const newBookImgPath = bookImg.existing.map(f => f.name).join(",");
        setDefaultData(prevData => {
            if (prevData.bookImgPath === newBookImgPath) return prevData; // 변경 없으면 업데이트 X
            return {
                ...prevData,
                bookImgPath: newBookImgPath
            };
        });
    }, [bookImg.existing]);

    // 파일 리스트 출력
    const renderFileList = (files, type) => (
            <>
                {files.map((file, index) => (
                    <div key={`${file.name}`}
                        className="file-row d-flex justify-content-start align-items-center w-100 mt-1 py-1 border-bottom">
                        <label className="form-title" htmlFor={`file${index+ 1}`}>업로드목록.{index + 1}</label>
                        <span className="d-inline-block" id={`file${index+ 1}`}>{file.name}</span>
                        <button type="button" className={"btn btn-danger ms-auto"}
                                onClick={() => handleRemoveFile(file, type)}>
                            삭제
                        </button>
                    </div>
                ))}
            </>
    );


    useEffect(() => {
        console.log("bookImg-- 목록 삭제 확인",defaultData);
    }, []);



    return (
        <>
            <FormTag id="bookImgPath" label="도서이미지" labelClass="form-title" className="form-control w-75"
                     name="bookImgPath" type="file"
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