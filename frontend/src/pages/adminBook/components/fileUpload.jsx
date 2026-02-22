import FormTag from "../../../util/form/formTag.jsx";
import React, {useEffect, useRef, useState} from "react";
import {useModal} from "../../common/modal/ModalContext.jsx";


const FileUpload =({bookImg,setBookImg})=>{//부모한테 받은 props 객체 기입


    //파일객체 조작관리
    const fileInitRef = useRef(null);
    //모달
    const {openModal,closeModal} = useModal();

    //최대 파일 사이즈, 총함 파일사이즈
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const maxTotalSize = 20 * 1024 * 1024; // 총합 20MB 제한 (옵션)


    //업로드된 파일크기 관리변수
    const [totalFileSize, setTotalFileSize] = useState(0);
    const bytesToMB = (bytes) => (bytes / 1024 / 1024).toFixed(2); // 바이트를 메가바이트로 변환하는함수
    //bookImg 객체가 갱신될 때마다 계산
    useEffect(() => {
        // 기존 + 새로 추가된 파일 크기 합산
        const existingSize = (bookImg.existing || []).reduce((sum, f) => sum + (f.size || 0), 0);
        const newSize = (bookImg.new || []).reduce((sum, f) => sum + (f.size || 0), 0);

        setTotalFileSize(existingSize + newSize);
    }, [bookImg]);


    // 파일 선택 핸들러
    const handleImgUpload = (e) => {
        //이벤트요소로 파일 객체에 접근, 파일 여러개 지정할 경우 배열로 변환필요
        const selectedFiles = Array.from(e.target.files);
        // 이미지 파일 확장자만 배열로
        const fileMimeType = ["image/png", "image/jpeg", "image/jpg", "image/gif","image/svg"]
        // 이미지 확장자 파일 파입이 아닌경우 filter 함수로 필터링
        const invalidFiles = selectedFiles.filter(file => !fileMimeType.includes(file.type));

        if (invalidFiles.length > 0) {

            openModal({
                modalType:"error",
                content: <>
                            <span>이미지 파일만 업로드 가능합니다.</span>
                            <span>({`${invalidFiles.map(f => f.name).join(",")}`})</span>
                        </>,
                onConfirm:()=>{closeModal()}
            });

            e.target.value = ""; // 선택 초기화
            return;
        }


        // 중복 파일 검사 (기존 new + existing 모두 포함)
        const existingFileNames = [
            ...(bookImg.existing?.map(f => f.name) || []),
            ...(bookImg.new?.map(f => f.name) || [])
        ];

        const duplicateFiles = selectedFiles.filter(f => existingFileNames.includes(f.name));
        if (duplicateFiles.length > 0) {

            openModal({
                modalType:"error",
                content: <>
                    <span>이미 추가된 파일입니다.</span>
                </>,
                onConfirm:()=>{closeModal()}
            })

            e.target.value = "";
            return;
        }

        //파일 용량 크기 제한
        const oversizedFiles = selectedFiles.filter(f => f.size > maxFileSize);
        if (oversizedFiles.length > 0) {

            openModal({
                modalType:"error",
                content: <>
                            <span>`업로드 실패: ${oversizedFiles.map(f => f.name).join(", ")}`</span>
                            <span>(각 파일은 5MB 이하만 업로드 가능합니다.)</span>
                        </>,
                onConfirm:()=>{closeModal()}
            })
            e.target.value = ""; // 선택 초기화
            return;
        }

        const totalSize =
            [...(bookImg.new || []), ...selectedFiles].reduce((sum, f) => sum + (f.size || 0), 0);
        if (totalSize > maxTotalSize) {

            openModal({
                modalType:"error",
                content:
                    <>
                        <span>총 업로드 용량 초과 (${(totalSize / 1024 / 1024).toFixed(2)}MB)</span>
                        <span>(전체 파일 크기는 20MB 이하여야 합니다.)</span>
                    </>,
                onConfirm:()=>{closeModal()}
            })
            e.target.value = "";
            return;
        }
        
        // 파일 목록 갱신 (등록 폼에서 에러 유발)
        setBookImg((prev)=>({
            ...prev, // 수정, 등록 둘 다 사용하기떄문에 수정일 경우 이전 데이터 필요
            new:[...(prev?.new || []),...selectedFiles] // 먼저 등록된 파일 + 새로 등록되는 파일드을
        }));
        //prev?.new || [] ==> prev?.new 값이 없으면 undefined 반환해서 에러 발생, [] 빈 배열로 에러 방지
    };

    //삭제 핸들러
    const handleRemoveFile = (file, type) => {

        console.log("파일 삭제 핸들러 ",file , type)
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


            //갱신된 이미지 배열이 빈 배열이면  ref로 참조한 돔 객체 값 초기화
            if (updatedExisting.length === 0 && fileInitRef.current) {
                console.log(" :갱신된 이미지 객체 돔조작중 이미지개수 ",updatedExisting.length);
                fileInitRef.current.value = ""; // 실제 DOM input value 비우기
            }



            return {
                ...prev,
                existing: updatedExisting,
                removed: updatedRemoved,
                new: updatedNew,
            };
        });
    };


    // 파일 리스트 출력 ==> noimg가 넘어오면 목록에 출력 x
    const renderFileList = (files, type) => (
            <>
                {files.map((file, index) => (
                    <div  key={`${file.name || file}`}
                        className="file-row d-flex justify-content-start align-items-center w-100 mt-1 py-1 border-bottom">
                        <label className="form-title col-3" htmlFor={`file${index+ 1}`}>업로드목록.{index + 1}</label>
                        <span className="d-inline-block" id={`file${index+ 1}`}> {file.name || file}</span>
                        <button type="button" className={"btn btn-danger ms-auto"}
                                onClick={() => handleRemoveFile(file, type)}>
                            삭제
                        </button>
                    </div>
                ))}
            </>
    );


    return (
        <>
            <div className="d-flex align-items-center w-100">
                <FormTag id="bookImgPath" label="도서이미지" labelClass="form-title" className="form-control w-75"
                         name="bookImgPath" type="file"
                         placeholder="도서 이미지 파일업로드"
                         onChange={handleImgUpload}
                         multiple={true}
                         ref={fileInitRef}
                />
                <em className="totalfilesize ms-2">{`(${bytesToMB(totalFileSize)}/20MB)`}</em>
            </div>

            {/* 기존 이미지 리스트 */}
            {bookImg?.existing?.length > 0 && renderFileList(bookImg.existing, "existing")}
            {/* 새로 추가된 이미지 리스트 */}
            {bookImg?.new?.length > 0 && renderFileList(bookImg.new, "new")}

        </>
    )
}

export default FileUpload;