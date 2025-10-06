import "@assets/css/board/userBoard.css";
import Btn from "@util/reuseBtn.jsx";
import { maskUserId } from "@util/maskingID.jsx";
import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@pages/common/AuthContext.jsx";
import PropTypes from "prop-types";
import { BoardRefreshTriggerContext } from "@pages/board/boardComponent.jsx";
import { useContext } from "react";
const CreateBoardComponent = () => {
  // useContext(UserDataContext)로 root 컴포넌트에 있는 UserDataContext를 사용 가능
  // const userData = useContext(UserDataContext);
  const refreshTrigger = useContext(BoardRefreshTriggerContext);
  const { userData } = useAuth();
  console.log("userData사용자----", userData);
  const fileRef = useRef(null); // file input 연결할 ref
  const navigate = useNavigate();
  const { category } = useParams();
  console.log("게시물 생성 카테고리 넘어 왔니? ", category);

  const [formData, setFormData] = useState({
    clientId: "",
    clientName: "",
    category: "",
    title: "",
    content: "",
    files: [],
  });

  // // category가 변경될 때 formData 업데이트
  // useEffect(() => {
  //   if (category) {
  //     const categoryData = categorySwitch(category);
  //     setFormData((prev) => ({
  //       ...prev,
  //       category: categoryData.value,
  //     }));
  //   }
  // }, [category]);

  // const categorySwitch = (category) => {
  //   switch (category) {
  //     case "one":
  //       return {
  //         text: "1:1 문의",
  //         value: "qnaone",
  //       };
  //     case "product":
  //       return {
  //         text: "상품 문의",
  //         value: "product",
  //       };
  //     case "delivery":
  //       return {
  //         text: "배송 문의",
  //         value: "delivery",
  //       };
  //   }
  // };

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
    console.log("postHandler 클릭");
    const form = new FormData();
    form.append("clientId", userData.clientId);
    form.append("clientName", userData.clientName);
    form.append("category", formData.category);
    form.append("title", formData.title);
    form.append("content", formData.content);
    formData.files.forEach((file) => form.append("files", file));

    console.log("서버로 전송 할 문의 데이터 ------", formData);

    if (!formData.title.trim()) {
      alert("문의 제목을 입력해 주세요");
      return;
    } else if (!formData.content.trim()) {
      alert("문의 내용을 입력해 주세요");
      return;
    } else if (!formData.category.trim()) {
      alert("문의 종류를 선택해 주세요");
      return;
    }

    try {
      let response;
      let successMessage;
      let redirectPath;

      if (formData.category === "qnaone") {
        response = await fetch(`/api/board/oneBoard`, {
          method: "POST",
          body: form,
        });
        successMessage = "1:1 문의 게시물이 등록되었습니다!";
        redirectPath = "/board";
      } else if (formData.category === "product") {
        response = await fetch(`/api/board/productBoard`, {
          method: "POST",
          body: form,
        });
        successMessage = "상품 문의 게시물이 등록되었습니다!";
        redirectPath = "/board";
      } else if (formData.category === "delivery") {
        response = await fetch(`/api/board/deliveryBoard`, {
          method: "POST",
          body: form,
        });
        successMessage = "배송 문의 게시물이 등록되었습니다!";
        redirectPath = "/board";
      } else {
        console.log("지원하지 않는 카테고리");
        return;
      }

      // 응답 상태 확인
      if (!response.ok) {
        console.error("전송 실패", response.status);
        alert("게시물 등록에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      // 성공 시에만 이동 및 알림 새로고침
      alert(successMessage);
      refreshTrigger();
      navigate(redirectPath);
    } catch (e) {
      console.log(e, e.message);
      alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };
  return (
    <>
      <div className="bardcrate">
        <from className="createFrom">
          <div className="d-flex align-items-center mb-1">
            <span className="form-title name">고객명</span>

            <span className="form-control">{userData.clientName}</span>
          </div>
          <div className="d-flex align-items-center mb-1">
            <span className=" form-title id">ID</span>

            <span className="form-control">
              {maskUserId(userData.clientId)}
            </span>
          </div>
          <div className="d-flex align-items-center mb-1">
            <span className=" form-title ">문의 종류</span>

            {/* <div>{categorySwitch(category).text}</div> */}
            <select name="category" onChange={handleChange}>
              <option value="">문의 선택</option>
              <option value="qnaone">1:1 문의</option>
              <option value="product">상품 문의</option>
              <option value="delivery">배송 문의</option>
            </select>
          </div>
          <div className="d-flex align-items-center mb-1">
            <span className="form-title inquireTitle">문의 제목</span>

            <input
              className="form-control"
              name="title"
              onChange={handleChange}
            />
          </div>

          <div className="d-flex align-items-center mb-1">
            <span className="form-title inquireContents">문의 내용</span>

            <textarea
              className="form-control"
              placeholder="문의 내용을 입력해 주세요."
              name="content"
              onChange={handleChange}
            />
          </div>

          <div className="d-flex align-items-center mb-1">
            <span className="form-title attachfiles">첨부 파일</span>
            <div>
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
            </div>
          </div>
          <div className="createBtnBox">
            <Btn
              className={"Btn postBoard btn-danger mx-1 "}
              id={"createBtn"}
              onClick={history.back}
              text="취소"
            />
            <Btn
              className={"Btn postBoard custom-btn02 mx-1 "}
              id={"createBtn"}
              onClick={postHandler}
              text="등록"
            />
          </div>
        </from>
      </div>
    </>
  );
};

export default CreateBoardComponent;

CreateBoardComponent.propTypes = {
  category: PropTypes.string.isRequired,
};
