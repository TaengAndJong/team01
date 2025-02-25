import React, {useEffect, useState} from "react";


const Category=({bookCategory,setBookCategory})=>{

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

    // 컴포넌트가 처음 마운트될 때마다? 실행
    useEffect(() => {
        bookCateList();
    }, []);

    //카테고리별 이름, 아이디 관리 리액트훅?
    let cateName="";
    // 카테고리 onChange핸들라
    const handleCategory= (e) =>{
        const selectedOption = e.target.selectedOptions[0]; // 선택된 option 가져오기
        const dataCateId  = selectedOption.getAttribute('data-cate-id')
        console.log(selectedOption.value,dataCateId );

        // 1. 타겟팅된 카테고리 목록이름을 전부 하나로 묶으려면 ?
        if(dataCateId!=null){
            console.log("selectedOption", selectedOption);
          if(cateName){
              cateName+=","+selectedOption.value;
          }else{
              cateName+=selectedOption.value;
          }

        }
        console.log("cateName------",cateName);
        //2. 카테고리 아이디는 가장 마지막 타겟팅요소의 data-cate-id

        //3. cateName과 cateId
    }


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

                {/*3차 카테고리만 데이터 */}
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
            </div>
        </>
    );

}

export default Category;