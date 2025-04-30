import React, {useEffect, useState} from "react";


const Category=({setDefaultData,defaultData,categoryList})=>{
    console.log("category --categoryList",categoryList)
    //1번 기본 데이터가 넘어옴
    console.log("category --defaultData",defaultData);

    const [selectedCategory, setSelectedCategory] = useState({
        names: defaultData?.bookCateNm ||  [],
        ids:  defaultData?.cateId || [],
        depth:  defaultData?.bookCateDepth || [],
    });


    console.log("selectedCategory--중간",selectedCategory);

    //useEffect로 초기값 갱신하기
    useEffect(() => {
        console.log("defaultData----- typeOf", typeof defaultData.bookCateNm);
        setSelectedCategory({
            names: typeof defaultData.bookCateNm === 'string' ? defaultData.bookCateNm.split(",") : defaultData.bookCateNm || [],
            ids: typeof defaultData.cateId === 'string' ? defaultData.cateId.split(",") : defaultData.cateId || [],
            depth: typeof defaultData.bookCateDepth === 'string' ? defaultData.bookCateDepth.split(",") : defaultData.bookCateDepth || [],
        });

    }, [defaultData]);


   // 카테고리 onChange핸들러
    const handleCategory= (e) =>{
        const selectedOption = e.target.selectedOptions[0]
        const dataCateId  = selectedOption.getAttribute('data-cate-id')
        const cateName = selectedOption.value; // 선택된 카테고리명

        console.log("selectedOption",selectedOption);
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
                    console.log("catename",updatedCategory.names[index] = cateName)
                    console.log("depth", updatedCategory.depth[index] = `${index+1}차 카테고리`)
                }
                return updatedCategory; // selectCategory 에 갱신할 데이터 반환
            });
        }

        console.log("setSelectedCategory----------마지막",setSelectedCategory);
        // 3. createBook 객체에 데이터 갱신해주기
        setDefaultData(prevState =>({
            ...prevState, // 이전데이터와 병합
            cateId:selectedCategory.ids,
            bookCateNm :selectedCategory.names, // depth에 따른 도서명 배열
            bookCateDepth:selectedCategory.depth // 1차,2차,3차 배열
        }))


    }
    console.log("setSelectedCategory----------마지막",setSelectedCategory);
    console.log("defaultData----------마지막",defaultData);

    return (
        <>
            <div className="d-flex align-items-center mb-1">
                <strong className="form-title">도서분류</strong>
                {/*1차 카테고리만 데이터 */}

                <label htmlFor="firstCategory" className="visually-hidden form-title">1차 카테고리</label>
                <select id="firstCategory" className="form-select w-auto" name="firstCategory" onChange={handleCategory} value={selectedCategory?.names?.[0] || ""} >
                    {categoryList?.firstDepth?.map(cate => (
                            <option key={cate.cateId} value={cate.cateNames} data-cate-id={cate.cateId}>
                                {cate.cateNames}
                            </option>
                        ))}
                </select>

                {/*2차 카테고리만 데이터 */}
                {selectedCategory?.depth?.[0] && (
                    <>
                        <label htmlFor="secondCategory" className="visually-hidden form-title">2차 카테고리</label>
                        <select id="secondCategory" className="form-select w-auto mx-1" name="secondCategory" onChange={handleCategory} value={selectedCategory?.names?.[1] || ""} >
                            {categoryList?.secondDepth?.map(cate => (
                                <option key={cate.cateId} value={cate.cateNames} data-cate-id={cate.cateId}>
                                    {cate.cateNames}
                                </option>
                            ))}
                        </select>
                    </>
                )}
                {/*3차 카테고리만 데이터 */}
                {selectedCategory?.depth?.[1] && (
                    <>
                        <label htmlFor="thirdCategory" className="visually-hidden form-title">3차 카테고리</label>
                        <select id="thirdCategory" className="form-select w-auto" name="thirdCategory"
                                onChange={handleCategory} value={selectedCategory?.names?.[2] || ""} >
                            {categoryList?.thirdDepth?.map(cate => (
                                <option key={cate.cateId} value={cate.cateNames} data-cate-id={cate.cateId}>
                                    {cate.cateNames}
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