
import React, {useContext, useEffect, useState} from "react";
import FormTag from "../../../util/formTag.jsx";
import Btn from "../../../util/reuseBtn.jsx";
import PathsData from "../../../assets/pathsData.jsx";
import {BookDispatchContext} from "../adminBookComponent.jsx";
import {useAuth} from "../../common/AuthContext.jsx";
import FileUpload from "./fileUpload.jsx";



//전체선택, 개별선택 삭제, 장바구니버튼, 바로구매버튼, 찜목록 버튼 , 리뷰



const AdminBookCreate = () => {

    const {onCreate} = useContext(BookDispatchContext);
    const {userData} = useAuth();
    console.log("userData---------",userData);

    const [createBook, setCreateBook] = useState({

        firstCategory:'',
        secondCategory:'',
        thirdCategory: '',
        bookName: '',
        author:'',
        bookPrice: '0',
        stock: '0',
        stockStatus:'품절',
        writer: userData?.clientName,
        bookDesc: '',
        bookImg: [], // 다중 파일 업로드라면 배열로 설정
       // userId:userData.clientId,
       // role:userData.role,
    })


    // 서버로 전송해야할 데이터를 모아야하는 함수
    const [bookCategory, setBookCategory] = useState(null);  // 데이터를 상태로 관리
    const bookCateList = async ()=>{

            fetch("/api/admin/book/bookCreate", {
                // POST 요청시 header 추가 필요

            })
                .then(response => {
                    if (response.ok) {
                        // 제이슨 객체(Object Prototype)
                        return response.json();
                    } else {
                        console.error('Failed to fetch');
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                }).then(data => {
                //도서 카테고리 목록 받아서 카테고리 상태 관리 함수에 반환,설정
                let resData = data.cateData;
                console.log("resData---------------------",resData);
                console.log("resData[0]---------------------",resData[0].cateDepthLevel);
                setBookCategory(resData);  // 데이터 로딩 완료 후 상태 업데이트
                })
                .catch(err => {
                    console.log("카테고리 데이터가 없습니다", err);
                });


    }// 데이터 fetch 요청

    useEffect(() => {
        bookCateList();  // 컴포넌트가 처음 마운트될 때 실행
    }, []);

    
    // 공통 onChange 핸들러
    const handleChange = (e) => {
    const { name, value } = e.target; // 입력 필드의 name과 value 가져오기

    setCreateBook({
        ...createBook, //기존에 있는 데이터들 스프레드 연산자로 합쳐주기
        [e.target.name]:e.target.value, //  카테고리를 target.name에 따라 추가

        // 재고수량에 따른 재고상태값 변화 조건 , 스프레드 연산자로  객체 항목 추가
        ...(name === 'stock' && {
            stockStatus: value !== '0' && value !== '' ? '재고있음' : '재고없음', // stock 값에 따라 stockStatus 변경
        }),

    })

};

    // 파일목록관리
    const [files, setFiles] = useState([]);
    //files 객체 bookCreate의 bookImg에 배열로 담는 핸들러
    const handleFilesChange = (files) => {
        setCreateBook((prev) => ({
            ...prev,
            bookImg: files, // 파일 목록 갱신
        }));
    };


//전송
    const onSubmit = (e) => {
        e.preventDefault(); // 기본 폼 제출 동작을 막기 위해서 추가
        console.log("onSubmit-----------",createBook);
        // 변수 createBook 폼데이터를 모아 담은 객체를 onCreate로 전달
        onCreate(createBook);
    
        // fetch Post요청으로 컨트롤러로 데이터 전송하기

    }



    return(
        <>
        {/* 도서 등록 구조 작성 */}

            <div className="page bookcreate">
                {/*onSubmit={handleInputChange}*/}
                <form className="bookCreateForm" onSubmit={onSubmit}>
                    {/*카테고리*/}
                    <div className="d-flex align-items-center">
                        <strong className="">도서분류</strong>
                        {/*1차 카테고리만 데이터 */}

                        <label htmlFor="firstCategory" className="visually-hidden">1차 카테고리</label>
                        <select className="form-select" name="firstCategory" onChange={handleChange}>
                            <option value="1차카테고리">1차카테고리</option>
                            {bookCategory && bookCategory
                                .filter(cate => parseInt(cate.cateDepthLevel) === 1)
                                .map(cate => (
                                    <option key={cate.cateId} value={cate.cateName}>
                                        {cate.cateName}
                                    </option>
                                ))}

                        </select>

                        {/*2차 카테고리만 데이터 */}
                        <label htmlFor="secondCategory" className="visually-hidden">2차 카테고리</label>
                        <select className="form-select" name="secondCategory" onChange={handleChange}>
                            <option value="2차카테고리">2차카테고리</option>
                            {bookCategory && bookCategory
                                .filter(cate => parseInt(cate.cateDepthLevel) === 2)
                                .map(cate => (
                                    <option key={cate.cateId} value={cate.cateName}>
                                        {cate.cateName}
                                    </option>
                                ))}
                        </select>

                        {/*3차 카테고리만 데이터 */}
                        <label htmlFor="thirdCategory" className="visually-hidden">3차 카테고리</label>
                        <select className="form-select" name="thirdCategory" onChange={handleChange}>
                            <option value="3차카테고리">3차카테고리</option>
                            {bookCategory && bookCategory
                                .filter(cate => parseInt(cate.cateDepthLevel) === 3)
                                .map(cate => (
                                    <option key={cate.cateId} value={cate.cateName}>
                                        {cate.cateName}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/*도서명*/}
                    <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center">
                            <FormTag label="도서명" className="form-control" name="bookName" type="text"
                                     placeholder="도서명 입력" value={createBook.bookName} onChange={handleChange}/>
                        </div>
                        <div className="d-flex align-items-center">
                            <FormTag label="저자" className="form-control" name="author" type="text"
                                     placeholder="저자입력" value={createBook.author} onChange={handleChange}/>
                        </div>
                    </div>
                    {/*저자*/}

                    {/*재고 & 가격*/}
                    <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center">
                            {/*할인적용할 겨 ? 말겨? */}
                            <FormTag label="도서가격" className="form-control" name="bookPrice" type="text"
                                     placeholder="도서가격입력" value={createBook.bookPrice} onChange={handleChange}/>
                            <span>원</span>
                        </div>
                        <div className="d-flex align-items-center">
                            <FormTag label="재고" className="form-control" name="stock" type="text"
                                     placeholder="재고입력" value={createBook.stock} onChange={handleChange}/>
                            <span>개</span>
                        </div>
                        <div className="d-flex align-items-center">
                            <FormTag label="재고상태" className="form-control" name="stockStatus" type="text"
                                     placeholder="재고상태" value={createBook.stockStatus} readOnly={true}/>
                            <span>개</span>
                        </div>
                    </div>

                    {/*작성자*/}
                    <div className="d-flex align-items-center">
                        {/*get 요청시 로그인한 유저의 이름을 value 로 업데이팅*/}
                        <FormTag label="작성자" className="form-control" name="writer" type="text"
                                 placeholder="작성자"  value={userData?.clientName} readOnly={true}/>
                    </div>
                    {/*도서설명*/}
                    <div className="">
                        <label htmlFor="bookDesc">도서설명</label>
                        <textarea id="bookDesc" className="form-control" name="bookDesc" type="text"
                                  placeholder="도서설명 100글자 이내로 입력" value={createBook.bookDesc} aria-describedby="bookDescHelp" maxLength="100"  required onChange={handleChange}/>
                    {/*100글자 넘어가면 에러메시지 출력 */}
                    </div>

                    {/*도서이미지
                        이미지 파일 업로드 안하면 그냥 기본 이미지로 등록, 필요
                    */}
                    <div className="d-flex align-items-center input-group">
                        {/*갱신값과 초기값을 전달하기 위해서 둘 다
                            부모가 상태관리를 해야 전체적인 데이터 흐름을 제어할 수 있음
                        */}
                        <FileUpload files={files} setFiles={setFiles} handleFilesChange={handleFilesChange}/>
                    </div>
                </form>
                <div className="d-flex align-items-center justify-content-center">
                    <Btn path={PathsData.page.adminBook} className={"login btn btn-secondary"} text={"취소"}/>
                    <Btn className={"signup btn btn-primary"} text={"완료"} type="submit" onClick={onSubmit}/>
                </div>
            </div>


        </>
    )
}

export default AdminBookCreate;

