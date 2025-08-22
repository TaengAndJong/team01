import {useNavigate, useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import Btn from "../../../util/reuseBtn.jsx";
import pathsData from "../../../assets/pathsData.jsx";
import Category from "./category.jsx";
import FormTag from "../../../util/formTag.jsx";
import PublishDate from "./publishDate.jsx";
import PriceStock from "./priceStock.jsx";
import FileUpload from "./fileUpload.jsx";
import ReusableModal from "./modal.jsx";
import {useAuth} from "../../common/AuthContext.jsx";
import {validStock} from "../../../util/validation.jsx";
import {formatToDate, getToday} from "../../../util/dateUtils.jsx";
import {BookDispatchContext} from "../adminBookComponent.jsx";
import "@assets/css/book/adminbookModify.css";

const AdminBookModify = () => {

    /*
    * 0. URL을 통해서 해당 데이터의 ID값을 가져오기,
    * 1. 렌더링 될 때, useEffect fetch  요청을  통해 해당 ID의 기존 정보 조회해서 가져오기
    *  ==> 상태관리의 초기값이 됨
    * 2. 수정 가능한 부분과 불가능한 부분 나누기
    * 3. 다시 서버로 제출 (post 요청) 및 클라이언트 상태업데이트(onUpdate) 해주기
    * */
    const {bookId} = useParams(); // URL에서 bookId 값 받아오기
    const {userData} = useAuth();// 로그인한 사용자 데이터
    const {onUpdate} = useContext(BookDispatchContext);
    const navigate = useNavigate();
    console.log("bookId modify", bookId);
    console.log("bookId modify",  typeof bookId);

    //도서 정보데이터
    const [modifyBookData, setModifyBookData] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    //파일
    const [bookImg, setBookImg] = useState({
        existing: modifyBookData.bookImgPath || [],
        new: [],
        removed: [],   // 삭제한 기존 파일
    });

    //발행일
    //fetch 함수 작성하기
    const fetchModify = async()=>{
        try{
            //fetch 요청 보내기
            const response = await fetch(`/api/admin/book/bookModify/${bookId}`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            // 응답 에러
            if(!response.ok){
                console.log(response.status);
                throw new Error("서버응답에러");
            }
            //응답 정상이면 받아 온 응답데이터 bookData에 갱신

            const bookData = await response.json();
            console.log("bookData",bookData);
            const {book,cateData} = bookData; // 객체형으로 구조분해할당하기
            setModifyBookData(book);
            setCategoryList(cateData);

        }catch(err){
            console.log("catch-Error", err);
        }
    }

    console.log("modifyBookData----",modifyBookData);

    useEffect(() => {
        fetchModify();
        if (userData != null) { // userData가 있을 때만 실행
            setModifyBookData(prevState => ({
                ...prevState,
                roleId: userData.roles[0],  // 최신 값으로 갱신
                writer: userData.clientName,
            }));
        }

    }, [bookId,userData]); //bookId가 변경될 때마다 데이터 변경



    //발행일
    const [publishDate, setPublishDate] = useState(new Date()); // 오늘날짜를 초기값으로

    //핸들러 값 변경 시 실행되는 함수
    const handleChange = (e) => {
        //name이 이벤트 객체로부터 구조분해할당하여 값을 분배
        const { name, value } = e.target;
        console.log("handleChange===========", name, value);
        //stock 값 숫자인지 검증
        if(name === "stock" || name === "bookPrice"){
            //검증 유틸 사용
            const result = validStock(value);
            console.log("재고 검증 결과 ----",result)
            //검증 통과 여부
            console.log("result.message",result.message)
            console.log("result.valid",result.valid)
            if(!result.valid){
                // 숫자 검증 false 일 경우, 모달 알림 뜸
                setShow(true);
                setErrorData(result); // result에 담긴 메시지 모달로 보내기
            }

        }
        setModifyBookData({
            ...modifyBookData,//기존에 있는 데이터들 스프레드 연산자로 합쳐주기
            [name] : value,
            // 재고수량에 따른 재고상태값 변화 조건 , 스프레드 연산자로  객체 항목 추가
            ...(name === 'stock' && {
                stockStatus: value !== '0' && value !== '' ? '재고있음' : '재고없음', // stock 값에 따라 stockStatus 변경
            }),
        })
    }

    const handleSubmit = async () => {
        //  formData 객체에 데이터 담기 및 fetch Post요청으로 컨트롤러로 데이터 전송하기
        const formData = new FormData(); //<form> 요소 없이도 key-value 쌍으로 데이터를 추가할 수 있음
        //createBook의 모든 데이터를 formData에 담아서 서버의 컨트롤러로 전송
        Object.entries(modifyBookData).forEach(([key, value]) => {
            // Array.isArray(value) ==> file 객체
            // bookImg가 값이 비어있거나 없을 경우 noImg 파일 가져와서
            // 파일 객체로 만들어 bookImg에 배열로 담아 서버로 넘겨야 함
            if (key === "bookImg") {
                //bookImg.new 는 newFiles라는 새 변수명으로 할당함
                const { new: newFiles, existing, removed } = bookImg;
                // 1. 새 파일이 있다면 추가
                if (Array.isArray(newFiles) && newFiles.length > 0) {
                    newFiles.forEach((file) => {
                        formData.append("bookImg", file);
                    });
                }
                // 2. 삭제할 기존 파일이 있다면 추가
                if (Array.isArray(removed) && removed.length > 0) {

                    removed.forEach((file) => {
                        formData.append("removedBookImg", file.name); // 또는 file이 string이면 그대로
                    });
                }
            }else if(key==="bookCateDepth"&& Array.isArray(value)){
                value.forEach((depth) => {
                    formData.append("bookCateDepth", depth);
                })
            }else if(key==="bookCateNm"&& Array.isArray(value)){
                value.forEach((name) => {
                    formData.append("bookCateNm", name);
                })
            }else if(key==="cateId"&& Array.isArray(value)){

                value.forEach((id) => {
                    formData.append("cateId", id);
                })
            } else if(key === "createDate") {
                //수정완료시 데이터를 서버로 전송하면 오늘날짜로 변경해서 데이터베이스에 넣어주기
                modifyBookData["createDate"]=getToday(); //서버로 전송할 데이터객체형태로 변경
                formData.append("createDate",  modifyBookData["createDate"]);

            } else {
                // 일반 문자열 데이터 추가
                formData.append(key, value);
            }
        });

        // 디버깅: FormData에 추가된 값 확인
        for (let pair of formData.entries()) {
            console.log("FormData 확인:", pair[0], pair[1]);
        }
        //서버 컨트롤러로 전송
        try{
            const response =await fetch(`/api/admin/book/bookModify/${bookId}`, {
                method: "POST",
                body: formData // 파일 객체 데이터가 있는경우, json.stringify 사용 불가, 서버에서 문자열과 파일 객체를 나눠줘야함
            });

            if (!response.ok) {
                throw new Error(`도서 등록 실패: ${response.status}`);
            }
            console.log("도서 등록 성공!");
            // 서버로 보내어 저장 완료된 데이터를 다시 json으로 받아서 Context에  새로 반영
            // 생성 완료 후 목록을 조회할 때  새로운 데이터도 반영되어야 하기때문에 ( 데이터를 반환받지 않으면 이전 상태를  유지)
            const newUpdatingData = await response.json();

            // onUpdate를 통해 데이터 클라이언트 데이터 갱신?
            onUpdate(newUpdatingData);
            // 목록 페이지로 이동
            navigate("/admin/book/bookList");
        }catch(err){
            console.error("서버 요청 오류 발생",err);
        }

    }

    //전송
    const onSubmit = (e) => {
        e.preventDefault(); // 기본 폼 제출 동작을 막기 위해서 추가
        //파일 객체  [] 배열이면 기본으로 이미지 추가하기
        console.log("데이터 제출하겠따")
        console.log("데이터제출 modifyBookData",modifyBookData);
        handleSubmit();
    }


    //모달 상태관리
    const [show, setShow] = useState(false);
    const [errorData, setErrorData] = useState({});
    const handleClose = () => {
        console.log("close modal");
        setShow(false)}
    const handleShow = () => {
        console.log("handleShow");
        setShow(true)}
    const [modalType, setModalType] = useState("confirm");

    console.log("modifyBookData",modifyBookData);

    return(
        <>
            {/* 도서 등록 구조 작성 */}

            <div className="page modifybook">
                {/*onSubmit={handleInputChange}*/}
                <form className="bookModifyForm" onSubmit={onSubmit}>
                    {/*카테고리*/}
                   <Category setDefaultData={setModifyBookData} defaultData={modifyBookData} categoryList={categoryList} />
                    {/*도서명*/}
                    <div className="d-flex align-items-center mb-1">
                        <FormTag id="bookName" label="도서명" labelClass="form-title" className="form-control"
                                 name="bookName" type="text"
                                 placeholder="도서명 입력" value={modifyBookData.bookName} onChange={handleChange}/>
                    </div>
                    {/*저자명 */}
                    <div className="d-flex align-items-center mb-1">
                        <FormTag id="author" label="저자" labelClass="form-title" className="form-control" name="author"
                                 type="text"
                                 placeholder="저자입력" value={modifyBookData.author} onChange={handleChange}/>
                    </div>
                    {/*발행일*/}
                    <PublishDate publishDate={modifyBookData.publishDate} handleChange={handleChange}/>
                    <div className="d-flex align-items-center mb-1">
                        {/*재고 & 가격*/}
                        <PriceStock bookPrice={String(modifyBookData?.bookPrice || 0)} stock={String(modifyBookData?.stock || 0)}
                                    stockStatus={modifyBookData?.stockStatus || '재고없음'} handleChange={handleChange}/>
                        <div className="d-flex align-items-center">
                            <FormTag id="createDate" label="등록일" labelClass="form-title" className="form-control"
                                     name="createDate"
                                     type="text"
                                     placeholder="등록일" value={formatToDate(new Date(modifyBookData.createDate))} readOnly={true}/>
                        </div>
                    </div>

                    {/*작성자*/}
                    <div className="d-flex align-items-center mb-1">
                        {/*get 요청시 로그인한 유저의 이름을 value 로 업데이팅*/}
                        <FormTag id="writer" label="작성자" labelClass="form-title" className="form-control" name="writer"
                                 type="text"
                                 placeholder="작성자" value={userData?.clientName} readOnly={true}/>
                    </div>
                    {/*도서설명*/}
                    <div className="d-flex align-items-center mb-1">
                        <label htmlFor="bookDesc" className="form-title">도서설명</label>
                        <textarea id="bookDesc" className="form-control" name="bookDesc" type="text"
                                  placeholder="도서설명 100글자 이내로 입력" value={modifyBookData.bookDesc}
                                  aria-describedby="bookDescHelp" maxLength="100" required onChange={handleChange}/>
                        {/*100글자 넘어가면 에러메시지 출력 */}
                    </div>

                    {/*도서이미지
                        이미지 파일 업로드 안하면 그냥 기본 이미지로 등록, 필요
                    */}
                    <div className="align-items-center input-group flex-wrap">
                        {/*갱신값과 초기값을 전달하기 위해서 둘 다
                            부모가 상태관리를 해야 전체적인 데이터 흐름을 제어할 수 있음
                        */}
                        <FileUpload bookImg={bookImg} setBookImg={setBookImg} defualtData={modifyBookData.bookImgPath}/>
                    </div>
                </form>
                <div className="d-grid gap-2 d-md-flex justify-content-md-between mt-4">
                    <Btn className={"modify btn custom-btn00"} type={"button"}
                         path={`${pathsData.page.adminBookDetail}/${bookId}`}
                         text="뒤로"/>
                    <Btn className={"modify btn btn-dark"} type="submit" onClick={onSubmit}
                         text="확인"/>
                </div>
            </div>

            {show && (
                <ReusableModal show={show}
                               onClose={handleClose}
                               errorData={errorData}
                               modalType="error"/>
            )}
        </>

    )
}

export default AdminBookModify;