import React, {useEffect, useRef, useState} from "react";
import {useModal} from "../../common/modal/ModalContext.jsx";


const Category=({mode,setDefaultData,defaultData,categoryList})=>{

    console.log(`mode ${mode} , categoryList = ${categoryList}`);
    //1번 기본 데이터가 넘어옴
    //카테고리 선택박스 초기상태
    const [selectedCategory, setSelectedCategory] = useState({
        names: [],
        ids:  [],
        depth: [],
    });

    const {openModal,closeModal} = useModal();

    const isInitialized = useRef(false); // 카테고리값 초기화 상태관리변수

    //useEffect로 초기값 갱신하기
    useEffect(() => {

        if(mode !== "modify") return; // 수정모드라면 상태값 갱신 코드 실행되지않게 코드실행 종료
        if (isInitialized.current) return; // 초기화가 되었으면 재초기화 금지
        if (!defaultData?.bookCateNm?.length) return;// 수정 데이터가 아직 안 왔으면 대기


        setSelectedCategory({
            names: Array.isArray(defaultData.bookCateNm)
                ? defaultData.bookCateNm
                : defaultData.bookCateNm.split(","),
            ids: Array.isArray(defaultData.cateId)
                ? defaultData.cateId
                : defaultData.cateId.split(","),
            depth: Array.isArray(defaultData.bookCateDepth)
                ? defaultData.bookCateDepth
                : defaultData.bookCateDepth.split(","),
        });
        isInitialized.current = true; // 초기화 잠금?

    }, [mode,defaultData]);

    //카테고리 변경시 실행
    useEffect(() => {
        setDefaultData(prev => ({
            ...prev,
            cateId: selectedCategory.ids,
            bookCateNm: selectedCategory.names,
            bookCateDepth: selectedCategory.depth,
        }));

    }, [selectedCategory]);



    // 카테고리 onChange핸들러
    const handleCategory = (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const dataCateId = selectedOption.getAttribute("data-cate-id");
        const cateName = selectedOption.value.trim();

        let index = e.target.name === "firstCategory" ? 0
                : e.target.name === "secondCategory" ? 1
                : null; // 3차 카테고리 사용 안함 , 사용하면 2로 변경,
        if(index === null){ return;}//방어코드 삭제

        const isPlaceholder = dataCateId.startsWith("cate"); // 기본값 false
      
        //  placeholder 카테고리 ㅁㅣ선택 시
        if (isPlaceholder) {
            openModal({
                modalType: "error",
                content: <>
                    <p>{`${index + 1}차 카테고리를 선택해주세요`}</p>
                </>,
                onConfirm: () => {
                    closeModal();
                }
            })
        }
            setSelectedCategory(prev => {
                const updated = {
                    names: [...prev.names],
                    ids: [...prev.ids],
                    depth: [...prev.depth],
                };

                if (isPlaceholder) {
                    updated.names.splice(index);
                    updated.ids.splice(index);
                    updated.depth.splice(index);
                } else {
                    updated.names[index] = cateName;
                    updated.ids[index] = dataCateId;
                    updated.depth[index] = `${index + 1}차 카테고리`;
                }

                return updated;
            });
     };


    return (
        <>
            <div className="row col-12 align-items-center  mb-1">
                <strong className="form-title col-3">도서분류</strong>
                {/*1차 카테고리만 데이터 */}

                <label htmlFor="firstCategory" className="visually-hidden form-title">1차 카테고리</label>
                <select id="firstCategory" className="form-select" name="firstCategory" onChange={handleCategory}
                        value={selectedCategory?.names?.[0] || ""} >

                    {categoryList?.firstDepth?.map(cate => (
                            <option key={cate.cateId} value={cate.cateNames.trim()} data-cate-id={cate.cateId}>
                                {cate.cateNames.trim()}
                            </option>
                        ))}
                </select>

                {/*2차 카테고리만 데이터 */}
                {selectedCategory?.depth?.[0] && (
                    <>
                        <label htmlFor="secondCategory" className="visually-hidden form-title">2차 카테고리</label>
                        <select id="secondCategory" className="form-select mx-1" name="secondCategory" onChange={handleCategory} value={selectedCategory?.names?.[1] || ""} >
                            {categoryList?.secondDepth?.map(cate => (
                                <option key={cate.cateId} value={cate.cateNames.trim()} data-cate-id={cate.cateId}>
                                    {cate.cateNames.trim()}
                                </option>
                            ))}
                        </select>
                    </>
                )}
                {/*/!*3차 카테고리만 데이터 *!/*/}
                {/*{selectedCategory?.depth?.[1] && (*/}
                {/*    <>*/}
                {/*        <label htmlFor="thirdCategory" className="visually-hidden form-title">3차 카테고리</label>*/}
                {/*        <select id="thirdCategory" className="form-select w-auto" name="thirdCategory"*/}
                {/*                onChange={handleCategory} value={selectedCategory?.names?.[2] || ""} >*/}
                {/*            {categoryList?.thirdDepth?.map(cate => (*/}
                {/*                <option key={cate.cateId} value={cate.cateNames.trim()} data-cate-id={cate.cateId}>*/}
                {/*                    {cate.cateNames.trim()}*/}
                {/*                </option>*/}
                {/*            ))}*/}
                {/*        </select>*/}
                {/*    </>*/}
                {/*)}*/}

            </div>
        </>
    );

}

export default Category;