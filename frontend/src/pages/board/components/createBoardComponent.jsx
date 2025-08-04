import "@assets/css/board/userBoard.css";
import Btn from "@util/reuseBtn.jsx";
import { useContext } from "react";
import { UserDataContext } from "../boardComponent.jsx";
import { maskUserId } from "@util/maskingID.jsx";
import { useState, useRef } from "react";

const CreateBoardComponent = () => {
  // useContext(UserDataContext)로 root 컴포넌트에 있는 UserDataContext를 사용 가능
  const userData = useContext(UserDataContext);
  const fileRef = useRef(null); // file input 연결할 ref

  // 문의 데이터를 저장 할 state 객체 형식
  const [formData, setFormData] = useState({
    clientId: userData.clientId,
    clientName: userData.clientName,
    category: "",
    title: "",
    content: "",
    files: [],
  });

  // 객체 key name에 맞는 데이터를 넣어 줌
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  console.log("저장되는 데이터", formData);

  // 사용자가 파일을 선택하면, 그 파일 목록을 배열로 변환하여 formData.files에 저장. 파일 다중 선택
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // FileList → 배열
    setFormData((prev) => ({
      ...prev,
      files: files,
    }));
  };

  // 게시물 등록 클릭 시 발생하는 이벤트 폼 객체에 데이터를 넣고 서버로 데이터 전송
  const postHandler = async () => {
    const form = new FormData();
    form.append("clientId", formData.clientId);
    form.append("clientName", formData.clientName);
    form.append("category", formData.category);
    form.append("title", formData.title);
    form.append("content", formData.content);
    formData.files.forEach((file) => form.append("files", file));

    console.log("서버로 전송 할 문의 데이터 ------", formData);
    try {
      if (formData.category === "qnaone") {
        const response = await fetch(`/api/board/oneBoard`, {
          method: "POST",
          body: form,
        });
        if (!response.ok) {
          console.error("전송 실패", response.status);
          return;
        }
        alert("1:1 문의 게시물이 등록되었습니다!");
      } else if (formData.category === "product") {
        const response = await fetch(`/api/board/productBoard`, {
          method: "POST",
          body: form,
        });
        if (!response.ok) {
          console.error("전송 실패", response.status);
          return;
        }
        alert("상품 문의 게시물이 등록되었습니다!");
      } else if (formData.category === "delivery") {
        const response = await fetch(`/api/board/deliveryBoard`, {
          method: "POST",
          body: form,
        });
        if (!response.ok) {
          console.error("전송 실패", response.status);
          return;
        }
        alert("배송 문의 게시물이 등록되었습니다!");
      } else {
        console.log("지원하지 않는 카테고리");
      }
    } catch (e) {
      console.log(e, e.message);
    }
  };
  return (
    <>
      <div>
        <div className="createBoardBox">
          <div className="d-flex">
            <dt className="name">고객명</dt>
            <dd>
              <span>{userData.clientName}</span>
            </dd>
          </div>
          <div className="d-flex">
            <dt className="id">ID</dt>
            <dd>
              <span>{maskUserId(userData.clientId)}</span>
            </dd>
          </div>
          <div className="d-flex">
            <dt>문의 종류</dt>
            <dd>
              <div>
                <select
                  className="inquireOption"
                  name="category"
                  onChange={handleChange}
                >
                  <option value="none">문의 선택</option>
                  <option value="qnaone">1:1 문의</option>
                  <option value="product">상품 문의</option>
                  <option value="delivery">배송 문의</option>
                </select>
              </div>
            </dd>
          </div>
          <div className="d-flex">
            <dt className="inquireTitle">문의 제목</dt>
            <dd>
              <input name="title" onChange={handleChange} />
            </dd>
          </div>

          <div className="d-flex">
            <dt className="inquireContents">문의 내용</dt>
            <dd>
              <textarea name="content" onChange={handleChange} />
            </dd>
          </div>

          <div className="d-flex">
            <dt className="attachfiles">첨부 파일</dt>
            <dd>
              <p>이미지 파일만 첨부해 주세요</p>
              <input
                type="file"
                multiple
                ref={fileRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <a className="btn" onClick={() => fileRef.current.click()}>
                파일 첨부하기
              </a>
              <span>
                &quot;(<b>최대 5개</b>, 10MB)&quot;
              </span>
            </dd>
          </div>
          <div className="createBtnBox">
            <Btn
              className={"Btn postBoard "}
              id={"createBtn"}
              onClick={postHandler}
              text="게시물 등록"
            ></Btn>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateBoardComponent;
