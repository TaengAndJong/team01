import "@assets/css/board/userBoard.css"
import Btn from "@util/reuseBtn.jsx";
import {useContext} from "react";
import {UserDataContext} from "../boardComponent.jsx";
import {maskUserId} from "@util/maskingID.jsx";
import {useState} from "react";

const CreateBoardComponent = ()=> {
    const userData = useContext(UserDataContext); // context 사용

    const [formData, setFormData] = useState({
        category: "",
        title:"",
        content: "",
        files:[],
    }); // 문의 데이터 저장 할 state

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };
    console.log("저장되는 데이터" , formData);

    const postHandler = async () => { // 게시물 등록 버튼

    }

    return(
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
                                <select className="inquireOption" name="category" onChange={handleChange}>
                                    <option value="">문의 선택</option>
                                    <option value="">1:1 문의</option>
                                    <option value="">상품 문의</option>
                                    <option value="">배송 문의</option>
                                </select>
                            </div>
                        </dd>

                    </div>
                    <div className="d-flex">
                        <dt className="inquireTitle" >문의 제목</dt>
                        <dd><input name="title" onChange={handleChange}/></dd>

                    </div>

                    <div className="d-flex">
                        <dt className="inquireContents">문의 내용</dt>
                        <dd><textarea name="content" onChange={handleChange}/></dd>
                    </div>

                    <div className="d-flex">
                        <dt className="attachfiles">첨부 파일</dt>
                        <dd>
                            <p>이미지 파일만 첨부해 주세요</p>
                            <a className="btn" onClick={() => fileRef.current.click()}>파일 첨부하기</a>
                            <span>"(<b>최대 10개</b>, 30MB)"</span>
                        </dd>
                    </div>
                    <div className="createBtnBox">
                        <Btn className={"Btn postBoard "} id={"createBtn"} text="게시물 등록"></Btn>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateBoardComponent;