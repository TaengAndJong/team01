import { useRef } from "react";
import "@assets/css/board/userBoard.css";
const FileUploadComponent = ({ files = [], handleFileChange, fileRemove }) => {
  console.log("files", files);
  const fileRef = useRef(null);

  const totalSizeMB = (
    files.reduce((acc, file) => acc + file.size, 0) /
    1024 /
    1024
  ).toFixed(2);

  return (
    <>
      <div className="d-flex align-items-center mb-1">
        <span className="form-title attachfiles">첨부 파일</span>
        <div>
          <p className="pb-2">
            이미지 파일만 첨부해 주세요{" "}
            <span className="ms-1">
              &quot;(<b>{files.length}</b>
              <b>/최대 5개</b>,
              <b>
                {totalSizeMB}
                /20MB
              </b>
              )&quot;
            </span>
          </p>
          <input
            type="file"
            multiple
            ref={fileRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="image/*"
          />
          <div className="d-flex justify-content-start align-items-center">
            <a className="btn border" onClick={() => fileRef.current.click()}>
              업로드
            </a>
            <ul className="d-flex ">
              {files.map((file, idx) => (
                <li className="file-item ms-2 p-2 d-flex" key={idx}>
                  <span className="p-2">{file.name}</span>
                  <button className="btn-file" onClick={() => fileRemove(idx)}>
                    <i className="icon icon-cancel "></i>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileUploadComponent;
