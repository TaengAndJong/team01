import React, {useEffect, useState} from "react";


const Category=({bookCategory,setBookCategory,setCreateBook})=>{

    const [selectedCategory, setSelectedCategory] = useState({
        names: [], // 1차, 2차, 3차 카테고리 이름
        ids: [], // 1차, 2차, 3차 카테고리 ID
        depth:[],
    });

    //get 요청 카테고리 목록 데이터 받아오기
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

    // 컴포넌트가 처음 마운트될 한 번 실행
    useEffect(() => {
        bookCateList();
    }, []);

        // 카테고리 onChange핸들라
    const handleCategory= (e) =>{
       console.log("e--",e.target);
        const selectedOption = e.target.selectedOptions[0]
        const dataCateId  = selectedOption.getAttribute('data-cate-id')
        const cateName = selectedOption.value; // 선택된 카테고리명

        console.log("dataCateId",dataCateId);
        console.log("cateName",cateName);
        // 1. 타겟팅된 카테고리 목록이름을 전부 하나로 묶으려면 ?
        if(dataCateId!=null){
            //selectCategory 데이터 갱신 함수
            setSelectedCategory(prev =>{ // 기존값 받아올 파라미터

                let updatedCategory = { ...prev }; // 기존 객체 복사 

                let index = -1;  // 선택한 카테고리의 인덱스로 구별 (1차, 2차, 3차), 초기값 -1(어떤것도 선택안됨)
                // 현재 선택된 select 요소의 name 값을 기반으로 위치 지정 (1차, 2차, 3차)
                if (e.target.name === "firstCategory") {
                    index = 0;
                } else if (e.target.name === "secondCategory") {
                    index =1;
                } else if (e.target.name === "thirdCategory") {
                    index = 2;
                }

                if (index !== -1) { // index 가 0부터 ~.. 하면 실행될 코드
                    updatedCategory.names[index] = cateName;
                    updatedCategory.ids[index] = dataCateId;
                    updatedCategory.depth[index] = `${index+1}차 카테고리`;
                    console.log("updatedCategory---111--",updatedCategory);
                }
                console.log("updatedCategory----22-",updatedCategory);
                return updatedCategory; // selectCategory 에 갱신할 데이터 반환
            });
        }

        // 3. createBook 객체에 데이터 갱신해주기
        setCreateBook(prevState =>({
            ...prevState,
            cateId:selectedCategory.ids,
            bookCateName :selectedCategory.names,
            bookCateDepth:selectedCategory.depth[selectedCategory.depth.length - 1]
        }))
    }
    console.log("selectedCategory---333--",selectedCategory);
    console.log("selectedCategory---333--",selectedCategory.depth);
    console.log("selectedCategory---333--",selectedCategory.depth[0]);

    return (
        <>
            <div className="d-flex align-items-center">
                <strong className="">도서분류</strong>
                {/*1차 카테고리만 데이터 */}

                <label htmlFor="firstCategory" className="visually-hidden">1차 카테고리</label>
                <select className="form-select" name="firstCategory" onChange={handleCategory}>
                    <option value="1차카테고리">1차카테고리</option>
                    {bookCategory && bookCategory
                        .filter(cate => parseInt(cate.cateDepthLevel) === 1)
                        .map(cate => (
                            <option key={cate.cateId} value={cate.cateName} data-cate-id={cate.cateId}>
                                {cate.cateName}
                            </option>
                        ))}
                </select>

                {/*2차 카테고리만 데이터 */}

                {selectedCategory?.depth?.[0]?.includes("1차") && (
                    <>
                        <label htmlFor="secondCategory" className="visually-hidden">2차 카테고리</label>
                        <select className="form-select" name="secondCategory" onChange={handleCategory}>
                            <option value="2차카테고리">2차카테고리</option>
                            {bookCategory && bookCategory
                                .filter(cate => parseInt(cate.cateDepthLevel) === 2)
                                .map(cate => (
                                    <option key={cate.cateId} value={cate.cateName} data-cate-id={cate.cateId}>
                                        {cate.cateName}
                                    </option>
                                ))}
                        </select>
                    </>
                )}
                {/*3차 카테고리만 데이터 */}
                {selectedCategory?.depth?.[1]?.includes("2차") && (
                    <>
                        <label htmlFor="thirdCategory" className="visually-hidden">3차 카테고리</label>
                        <select className="form-select" name="thirdCategory" onChange={handleCategory}>
                            <option value="3차카테고리">3차카테고리</option>
                            {bookCategory && bookCategory
                                .filter(cate => parseInt(cate.cateDepthLevel) === 3)
                                .map(cate => (
                                    <option key={cate.cateId} value={cate.cateName} data-cate-id={cate.cateId}>
                                        {cate.cateName}
                                    </option>
                                ))}
                        </select>
                    </>
                )}
            </div>
        </>
    );

}

export default Category;