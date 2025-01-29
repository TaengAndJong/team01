
import React, {useEffect, useState} from "react";
import FormTag from "../../../util/formTag.jsx";
import Btn from "../../../util/reuseBtn.jsx";



//전체선택, 개별선택 삭제, 장바구니버튼, 바로구매버튼, 찜목록 버튼 , 리뷰



const AdminBookCreate = () => {

    const [bookData, setBookData] = useState(null);  // 데이터를 상태로 관리

    useEffect( () => {
        // 데이터 fetch 요청
         fetch("/api/admin/book/bookCreate", {
            // POST 요청시 header 추가 필요
        })
            .then(response => {
                if (response.ok) {
                    // 제이슨 객체(Object Prototype)
                   return response.json();
                } else {
                    console.error('Failed to fetch');
                    throw new Error('Failed to fetch');
                }
            }).then(data => {

              let resData = data;
                setBookData(resData);  // 데이터 로딩 완료 후 상태 업데이트
            })
            .catch(err => {
                console.log("err------", err);
            });
    }, []);  // 컴포넌트가 처음 렌더링될 때만 호출됨


    //setData이후에 새로 반영해야하기때문에, 재사용 data가 업데이트될 때마다 확인하는 useEffect 추가
    // 데이터가 갱신될 때마다 확인하는 useEffect
    useEffect(() => {

        if(bookData){ //  null , undefined 에러 방지

            console.log("bookData",bookData);
            console.log("bookData--444",bookData.data);
           // console.log("bookData--444",bookData.data.A.children.secondLevelId,bookData.data.A.children.secondLevelName);
        }

    }, [bookData]); // data가 변경될 때마다 실행됨



    if (!bookData) {
        return <div>Loading...</div>;  // 데이터가 없을 때 로딩 화면
    }




    return(
        <>
        {/* 도서 등록 구조 작성 */}

            <div className="page bookcreate">
                {/*onSubmit={handleInputChange}*/}
                <form className="bookCreateForm">
                    {/*카테고리*/}
                    <div className="d-flex align-items-center">
                        <strong className="">도서분류</strong>
                        {/*1차 카테고리만 데이터 */}
                        {/*{data[0]?.depthTreeList?.[0]?.cateName}*/}
                        {/*data의 49개 리스트에서 depthTreeList의 0번째의 cateName */}


                        <label htmlFor="category1" className="visually-hidden">1차 카테고리</label>
                        <select className="form-select" name="category1">
                            <option value="1차카테고리">1차카테고리</option>
                            {bookData.data
                                .filter(book => book.cateDepthLevel.trim() === "1") // cateDepthLevel이 "1"인 항목만 필터링
                                .map(book => (
                                    <option key={book.cateId} value={book.cateName}>{book.cateName}</option>
                                ))}
                        </select>

                        {/*2차 카테고리만 데이터 */}
                        <label htmlFor="category2" className="visually-hidden">2차 카테고리</label>
                        <select className="form-select" name="category2">
                            <option value="2차카테고리">2차카테고리</option>
                            {bookData.data
                                .filter(book => book.cateDepthLevel.trim() === "2") // cateDepthLevel이 "1"인 항목만 필터링
                                .map(book => (
                                    <option key={book.cateId} value={book.cateName}>{book.cateName}</option>
                                ))}
                        </select>

                        {/*3차 카테고리만 데이터 */}
                        <label htmlFor="category3" className="visually-hidden">3차 카테고리</label>
                        <select className="form-select" name="category3">
                            <option value="3차카테고리">3차카테고리</option>
                            {bookData.data
                                .filter(book => book.cateDepthLevel.trim() === "3") // cateDepthLevel이 "1"인 항목만 필터링
                                .map(book => (
                                    <option key={book.cateId} value={book.cateName}>{book.cateName}</option>
                                ))}
                        </select>
                    </div>

                    {/*도서명*/}
                    <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center">
                            <FormTag label="도서명" className="form-control" name="bookName" type="text"
                                     placeholder="도서명 입력"/>
                        </div>
                        <div className="d-flex align-items-center">
                            <FormTag label="저자" className="form-control" name="author" type="text"
                                     placeholder="저자입력"/>
                        </div>
                    </div>
                    {/*저자*/}

                    {/*재고 & 가격*/}
                    <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center">
                            {/*할인적용할 겨 ? 말겨? */}
                            <FormTag label="도서가격"  className="form-control" name="bookPrice" type="text"
                                     placeholder="도서가격입력"/>
                            <span>원</span>
                        </div>
                        <div className="d-flex align-items-center">
                            <label htmlFor="stockStatus">재고</label>
                            <select id="stockStatus" className="form-select" name="stockStatus">
                                <option value="0">0</option>
                                <option value="10">10</option>
                            </select>
                        </div>
                    </div>

                    {/*작성자*/}
                    <div className="d-flex align-items-center">
                        {/*get 요청시 로그인한 유저의 이름을 value 로 업데이팅*/}
                        <FormTag label="작성자"  className="form-control" name="writer" type="text"
                                 placeholder="저자입력" readOnly={true}/>
                    </div>
                    {/*도서설명*/}
                    <div className="">
                        <label htmlFor="bookDesc">도서설명</label>
                        <textarea id="bookDesc" className="form-control" name="bookDesc" type="text"
                                  placeholder="도서설명 100글자 이내로 입력" aria-describedby="bookDescHelp" maxLength="100"  required/>
                    {/*100글자 넘어가면 에러메시지 출력 */}
                    </div>

                    {/*도서이미지
                        이미지 파일 업로드 안하면 그냥 기본 이미지로 등록
                    */}
                    <div className="d-flex align-items-center input-group">
                        <FormTag label="도서이미지" labelClass="input-group-text"  className="form-control" name="bookImg" type="file"
                                 placeholder="도서 이미지 파일업로드" multiple/>
                    </div>
                </form>
                <div className="d-flex align-items-center justify-content-center">
                    <Btn className={"login btn btn-secondary"} text={"취소"}/>
                    <Btn className={"signup btn btn-primary"} text={"완료"} type="submit"/>
                </div>
            </div>


        </>
    )
}

export default AdminBookCreate;