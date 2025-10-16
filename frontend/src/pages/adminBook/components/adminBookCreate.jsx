
import React, {useContext, useEffect, useState} from "react";
import FormTag from "../../../util/formTag.jsx";
import Btn from "../../../util/reuseBtn.jsx";
import PathsData from "../../../assets/pathsData.jsx";
import {BookDispatchContext} from "../adminBookComponent.jsx";
import {useAuth} from "../../common/AuthContext.jsx";
import FileUpload from "./fileUpload.jsx";
import Category from "./category.jsx";
import {useNavigate} from "react-router-dom";
import {formatToDate, getToday} from "../../../util/dateUtils.jsx";
import PriceStock from "./priceStock.jsx";
import {validStock} from "../../../util/validation.jsx";
import ReusableModal from "./modal.jsx";
import PublishDate from "./publishDate.jsx";
import RecomeType from "./recomeType.jsx";

//전체선택, 개별선택 삭제, 장바구니버튼, 바로구매버튼, 찜목록 버튼 , 리뷰

const AdminBookCreate = () => {

    const {onCreate} = useContext(BookDispatchContext);
    const {userData} = useAuth();
    const navigate = useNavigate();



    //리액트는 초기값이 렌더링 되면 상태관리 방식으로인해 값이 고정되어
    // 렌더링될 때마다 렌더링 타이밍과 초기화 방식을 고려해 데이터를 갱신해줘야 함
    const [createBook, setCreateBook] = useState({
        bookName: '',
        bookCateNm:[],
        bookCateDepth:[],
        bookDesc: '',
        author:'',
        bookPrice: '1',
        stock: '1',
        stockStatus:'재고없음',
        publishDate:'', //발행일
        roleId:'',
        cateId:[],
        bookImg: [], // 다중 파일 업로드라면 배열로 설정
        writer: '',
        createDate:formatToDate(new Date()), // 클라이언트에게 보여줄 날짜 ==> 데이터베이스는 자동으로 데이터 넣기
        recomType:'NORMAL'
    })
    //카테고리
    const [categoryList, setCategoryList] = useState([]); // 도서 카테고리 상태관리
   //파일
    const [bookImg, setBookImg] = useState({
        new: [],      // 공통
    });
    // 업로드 파일 상태관리
    //발행일
    const [publishDate, setPublishDate] = useState(new Date()); // 오늘날짜를 초기값으로


    //get 요청서 categoryList 받아오기
    const getCategories = async () => {
      try{
          const response = await  fetch("/api/admin/book/bookCreate",{
              method: "GET",
              headers: {
                  "Content-Type": "application/json"
              }
          });

          if(!response.ok){
              console.log("통신에러",response.status);
              throw  Error(response.statusText);
          }
          // 요청 성공 시 ,응답 제이슨으로 받아오기
          const data = await response.json();
          console.log("data--- createData",data);
          setCategoryList(data);
      }catch(err){
          console.error("getCategories 실패:", err);
      }
    }

    // userData가 변경될 때 roleId와 writer를 업데이트
    useEffect(() => {
        if (userData != null) { // userData가 있을 때만 실행
            //console.log("userData",userData);
            setCreateBook(prevState => ({
                ...prevState,
                roleId: userData?.roles[0],  // 최신 값으로 갱신
                writer: userData?.clientName,
            }));
        }
        getCategories();
    }, [userData]);  // userData가 변경될 때 실행

    useEffect(() => {
        setCreateBook(prev => ({
            ...prev,
            bookImg: bookImg.new,
        }));
    }, [bookImg])

    //모달 상태관리
    const [show, setShow] = useState(false);
    const [errorData, setErrorData] = useState({});
    const handleClose = () => {
       // console.log("close modal");
        setShow(false)}
    const handleShow = () => {
      //  console.log("handleShow");
        setShow(true)}
    const [modalType, setModalType] = useState("confirm");


    //체크박스 전체선택 && 단일 선택 상태관리
    //핸들러 값 변경 시 실행되는 함수
    const handleChange = (e) => {
        // console.log("e type", typeof  e);
        // console.log("e target", e.target);
        // console.log("e target", e.target.value);
        //name이 이벤트 객체로부터 구조분해할당하여 값을 분배
       const { name, value } = e.target;

       //stock 값 숫자인지 검증 , 값이 빈 문자열이 아니고 name이 stock, bookPrice일 경우
        if((name === "stock" || name === "bookPrice") && value.trim() !== ""){
            //검증 유틸 사용
            const result = validStock(value);

            //검증 통과 여부
            // console.log("result.message",result.message)
            // console.log("result.valid",result.valid)
            if(!result.valid){
                // 숫자 검증 false 일 경우, 모달 알림 뜸
                setShow(true);
                setErrorData(result); // result에 담긴 메시지 모달로 보내기
                return; // 종료시키키
            }

        }


        setCreateBook({
            ...createBook,//기존에 있는 데이터들 스프레드 연산자로 합쳐주기
            [name] : value,
            // 재고수량에 따른 재고상태값 변화 조건 , 스프레드 연산자로  객체 항목 추가
            ...(name === 'stock' && {
                stockStatus: value !== '0' && value !== '' ? '재고있음' : '재고없음', // stock 값에 따라 stockStatus 변경
            }),
        })
    }

    console.log("createbook--- stock",createBook);

    const handleSubmit = async () => {

        //  formData 객체에 데이터 담기 및 fetch Post요청으로 컨트롤러로 데이터 전송하기
        const formData = new FormData(); 
        //<form> 요소 없이도 key-value 쌍으로 데이터를 추가할 수 있고 미디어,이미지등을 전송해야할 경우에 사용
        //createBook의 모든 데이터를 formData에 담아서 서버의 컨트롤러로 전송
        Object.entries(createBook).forEach(([key, value]) => {
              // Array.isArray(value) ==> file 객체
            // bookImg가 값이 비어있거나 없을 경우 noImg 파일 가져와서
            // 파일 객체로 만들어 bookImg에 배열로 담아 서버로 넘겨야 함 
            if (key === "bookImg") {
         //       console.log("value---",key);
        //        console.log(" bookImg.new---", Array.isArray(bookImg.new)); // array
                bookImg.new.forEach((img)=>{ // 누적값 저장은 forEach(), 새로운 배열 생성은 map()
                    formData.append("bookImg", img);
                })

            }else if(key==="bookCateDepth"&& Array.isArray(value)){
                value.forEach((depth) => {
                    formData.append("bookCateDepth", depth);
                })
            }else if(key==="bookCateNm"&& Array.isArray(value)){

                value.forEach((name) => {
                    formData.append("bookCateNm", name);
                })
            } else if(key==="cateId"&& Array.isArray(value)){

                value.forEach((id) => {
                    formData.append("cateId", id);
                })
            }else if(key === "createDate") {
           //    console.log("키가 등록일일경우")
                //dateUtils의 getToday() 로 localDateTime형식 맞춰주기
                createBook["createDate"]=getToday(); //서버로 전송할 데이터객체형태로 변경
         //       console.log("문자열인가 ?" ,typeof(createBook["createDate"]));
                formData.append("createDate",  createBook["createDate"]);
            } else {
                // 일반 문자열 데이터 추가
                formData.append(key, value);
            }
        });

        // 디버깅: FormData에 추가된 값 확인
        // ==> iterator 반복 객체는 for ..of 또는 Array.from으로 내부 구조확인 가능, entries는 반복객체를 반환
        for (let [key,val] of formData.entries()) {
           // console.log(`formDate 확인 key : ${key} , val: ${val}`);
        }
        // formData가 전부 채워졌는지 검증 ==> 하나라도 비어있으면 모달로 알림띄기

        //formData를  entries()를 통해 키,값 으로 담긴 순회가 가능한 반복객체를 반환 후 Array.from으로 배열객체로 변환
        const hasEmpty = Array.from(formData.entries())
            .some(([key, value]) => {

                if(typeof(value) === "string"){ //  타입이 문자열인 부분과 
                    return value.trim() === "";
                }

                return !value; // 그렇지 않는 객체 분리해서 검증해야 안전
            });//해당 키값의 값이 null 또는 undefined,빈 문자열일경우

        // true 반환,조건문 진입
        if (hasEmpty) {
          //  console.log(`formDate 확인==== hasEmpty : ${hasEmpty}`);
            setShow(true);
            setErrorData({
                valid: false,
                message: "빈값을 입력해주세요." }
            )
            return; // 종료시키키
        }


        //데이터 검증 후 서버의 컨트롤러로 데이터 전송
        try{
            //console.log("fetch formData ---------------",formData);

            const response =await fetch("/api/admin/book/bookCreate", {
                method: "POST",
                body: formData // 파일 객체 데이터가 있는경우, json.stringify 사용 불가, 서버에서 문자열과 파일 객체를 나눠줘야함
            });

            if (!response.ok) {
                throw new Error(`도서 등록 실패: ${response.status}`);
            }
            //console.log("도서 등록 성공!");
            // 서버로 보내어 저장 완료된 데이터를 다시 json으로 받아서 Context에  새로 반영
            // 생성 완료 후 목록을 조회할 때  새로운 데이터도 반영되어야 하기때문에 ( 데이터를 반환받지 않으면 이전 상태를  유지)
            const newUpdatingData = await response.json();
          //  console.log("newUpdatingData-----------" , newUpdatingData);
            // onCreate를 통해 데이터 클라이언트 데이터 갱신?
            onCreate(newUpdatingData);
            // 목록 페이지로 이동
             navigate("/admin/book/bookList");
        }catch(err){
            console.error("서버 요청 오류 발생",err);
        }

    }
//    console.log("createBook --------------111 " , createBook);
//전송
    const onSubmit = (e) => {
        e.preventDefault(); // 기본 폼 제출 동작을 막기 위해서 추가
        //파일 객체  [] 배열이면 기본으로 이미지 추가하기
     //   console.log("데이터제출 createBook",createBook);
        // file 객체 값 이미지객체 빈값인지 확인하는 함수
      //  console.log("데이터제출  후 createBook.bookImg)",createBook.bookImg);
        handleSubmit();
    }
        //console.log("createBook --------------222 " , createBook); // 여기에는  담겨있음
//return start
    return(
        <>
        {/* 도서 등록 구조 작성 */}

            <div className="bookcreate">
                {/*onSubmit={handleInputChange}*/}
                <form className="bookCreateForm" onSubmit={onSubmit}>
                    {/*등록타입*/}
                    <RecomeType  setCreatebook={setCreateBook}/>
                    {/*카테고리*/}
                    <Category setDefaultData={setCreateBook} defaultData={createBook} categoryList={categoryList}  />
                    {/*도서명*/}
                    <div className="d-flex align-items-center mb-1">
                            <FormTag id="bookName" label="도서명" labelClass="form-title" className="form-control" name="bookName" type="text"
                                     placeholder="도서명 입력" value={createBook.bookName} onChange={handleChange}/>
                    </div>
                    {/*저자명 */}
                    <div className="d-flex align-items-center mb-1">
                            <FormTag id="author" label="저자" labelClass="form-title" className="form-control" name="author" type="text"
                                     placeholder="저자입력" value={createBook.author} onChange={handleChange}/>
                    </div>
                    {/*발행일*/}
                    <PublishDate publishDate={createBook.publishDate} handleChange={handleChange}/>
                    <div className="d-flex align-items-center mb-1">
                    {/*재고 & 가격*/}
                        <PriceStock bookPrice={createBook.bookPrice} stock={createBook.stock} stockStatus={createBook.stockStatus} handleChange={handleChange}/>
                        <div className="d-flex align-items-center">
                            <FormTag id="createDate" label="등록일" labelClass="form-title" className="form-control" name="createDate"
                                     type="text"
                                     placeholder="등록일" value={createBook.createDate} readOnly={true}/>
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
                                  placeholder="도서설명 100글자 이내로 입력" value={createBook.bookDesc}
                                  aria-describedby="bookDescHelp" maxLength="100" required onChange={handleChange}/>
                        {/*100글자 넘어가면 에러메시지 출력 */}
                    </div>

                    {/*도서이미지
                        이미지 파일 업로드 안하면 그냥 기본 이미지로 등록, 필요
                    */}
                    <div className="d-flex align-items-center input-group">
                        {/*갱신값과 초기값을 전달하기 위해서 둘 다
                            부모가 상태관리를 해야 전체적인 데이터 흐름을 제어할 수 있음
                        */}
                        <FileUpload bookImg={bookImg} setBookImg={setBookImg} setCreatebook={setCreateBook}/>
                    </div>
                </form>
                <div className="d-flex align-items-center justify-content-center mt-4">
                    <Btn path={PathsData.page.adminBook} className={"login btn btn-danger mx-1"} text={"취소"}/>
                    <Btn className={"signup btn custom-btn02 mx-1"} text={"완료"} type="submit" onClick={onSubmit}/>
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

export default AdminBookCreate;

