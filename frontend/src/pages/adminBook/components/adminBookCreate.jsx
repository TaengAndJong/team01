
import React, {useContext, useEffect, useState} from "react";
import FormTag from "../../../util/formTag.jsx";
import Btn from "../../../util/reuseBtn.jsx";
import PathsData from "../../../assets/pathsData.jsx";
import {BookDispatchContext} from "../adminBookComponent.jsx";
import {useAuth} from "../../common/AuthContext.jsx";
import FileUpload from "./fileUpload.jsx";
import Category from "./category.jsx";
import {useNavigate} from "react-router-dom";



//전체선택, 개별선택 삭제, 장바구니버튼, 바로구매버튼, 찜목록 버튼 , 리뷰

const AdminBookCreate = () => {

    const {onCreate} = useContext(BookDispatchContext);
    const {userData} = useAuth();
    const navigate = useNavigate();

    //리액트는 초기값이 렌더링 되면 상태관리 방식으로인해 값이 고정되어
    // 렌더링될 때마다 렌더링 타이밍과 초기화 방식을 고려해 데이터를 갱신해줘야 함
    const [createBook, setCreateBook] = useState({
        bookName: '',
        bookCateNm:'',
        bookCateDepth:'',
        bookDesc: '',
        author:'',
        bookPrice: '0',
        stock: '0',
        stockStatus:'재고없음',
        publishDate:'', //발행일
        roleId:'',
        cateId:'',
        bookImg: [], // 다중 파일 업로드라면 배열로 설정
        writer: '',

    })

    // userData가 변경될 때 roleId와 writer를 업데이트
    useEffect(() => {
        if (userData != null) { // userData가 있을 때만 실행
            setCreateBook(prevState => ({
                ...prevState,
                roleId: userData.roles[0],  // 최신 값으로 갱신
                writer: userData.clientName,
            }));
        }
    }, [userData]);  // userData가 변경될 때 실행


    //체크박스 전체선택 && 단일 선택 상태관리

    //핸들러 값 변경 시 실행되는 함수
    const handleChange = (e) => {
       const { name, value } = e.target;
        setCreateBook({
            ...createBook,//기존에 있는 데이터들 스프레드 연산자로 합쳐주기
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
        Object.entries(createBook).forEach(([key, value]) => {
               // Array.isArray(value) ==> file 객체
            // bookImg가 값이 비어있거나 없을 경우 noImg 파일 가져와서
            // 파일 객체로 만들어 bookImg에 배열로 담아 서버로 넘겨야 함 
            if (key === "bookImg" && Array.isArray(value)) {
                value.forEach((file) => {
                    formData.append("bookImg", file);
                });
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
            const response =await fetch("/api/admin/book/bookCreate", {
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
            console.log("newUpdatingData" , newUpdatingData);
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
        console.log("데이터 제출하겠따")
        console.log("데이터제출 createBook",createBook);
        console.log("데이터제출 createBook.bookImg)",createBook.bookImg);
        // file 객체 값 이미지객체 빈값인지 확인하는 함수
        console.log("데이터제출  후 createBook.bookImg)",createBook.bookImg);
        handleSubmit();
    }
        console.log("createBook --------------222 " , createBook); // 여기에는  담겨있음
//return start
    return(
        <>
        {/* 도서 등록 구조 작성 */}

            <div className="page bookcreate">
                {/*onSubmit={handleInputChange}*/}
                <form className="bookCreateForm" onSubmit={onSubmit}>
                    {/*카테고리*/}
                    <Category setCreateBook={setCreateBook}/>
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
                    <div className="d-flex align-items-center mb-1">
                        <FormTag id="publishDate" label="발행일" labelClass="form-title" className="form-control" name="publishDate" type="text"
                                 placeholder="발행일" value={createBook.publishDate} onChange={handleChange}/>
                    </div>
                    {/*재고 & 가격*/}
                    <div className="d-flex align-items-center mb-1">
                        <div className="d-flex align-items-center">
                            {/* 숫자만 입력되게 검증필요 */}
                            <FormTag id="bookPrice" label="도서가격" labelClass="form-title" className="form-control" name="bookPrice" type="text"
                                     placeholder="도서가격입력" value={createBook.bookPrice} onChange={handleChange}/>
                            <span>원</span>
                        </div>
                        <div className="d-flex align-items-center mx-2">
                            {/* 100개 이상 입력되면 경고문? 아니면 선택박스로 바꾸기*/}
                            <FormTag id="stock" label="재고" labelClass="form-title" className="form-control" name="stock" type="text"
                                     placeholder="재고입력" value={createBook.stock} onChange={handleChange}/>
                            <span>개</span>
                        </div>
                        <div className="d-flex align-items-center">
                            {/*재고도 셀렉트박스로 바꾸기*/}
                            <FormTag id="stockStatus" label="재고상태" labelClass="form-title" className="form-control" name="stockStatus"
                                     type="text"
                                     placeholder="재고상태" value={createBook.stockStatus} readOnly={true}/>
                            <span>개</span>
                        </div>
                    </div>

                    {/*작성자*/}
                    <div className="d-flex align-items-center mb-1">
                        {/*get 요청시 로그인한 유저의 이름을 value 로 업데이팅*/}
                        <FormTag id="writer" label="작성자" labelClass="form-title" className="form-control" name="writer" type="text"
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
                        <FileUpload createBook={createBook} setCreateBook={setCreateBook}/>
                    </div>
                </form>
                <div className="d-flex align-items-center justify-content-center mt-4">
                    <Btn path={PathsData.page.adminBook} className={"login btn btn-secondary mx-1"} text={"취소"}/>
                    <Btn className={"signup btn btn-primary mx-1"} text={"완료"} type="submit" onClick={onSubmit}/>
                </div>
            </div>

        </>
    )
}

export default AdminBookCreate;

