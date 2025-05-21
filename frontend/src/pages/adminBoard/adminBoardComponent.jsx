
import {Link, Outlet} from "react-router-dom";
import React, {useEffect, useState} from "react";
import LeftMenu from "../../layout/LeftMenu.jsx";
import {useMenu} from "../common/MenuContext.jsx";
import {menuNavi} from "../../util/menuNavi.jsx";


//context 상태관리
export const BookBoardStateContext = React.createContext();// state 값을 공급하는 context
export const  BookBoardDispatchContext = React.createContext();// 생성, 수정(갱신), 삭제 값을 공급하는 context
export const PaginationContext = React.createContext()

const AdminBoard = () => {

    const {menu,currentPath,standardPoint}  = useMenu(); // menuProvider에서 데이터를 제공하는 커스텀훅
    const [qnaOneData, setQnaOneData] = useState([]); // 1:1 문의 데이터가 들어갈 State
    // const [isLoading,setIsLoading] = useState(true);

    let adminMenuTree = menuNavi(menu?.adminList);
    let adminHome = menu?.adminList?.find(item => item.menuId === "admin")?.menuPath;
    let subNavi = adminMenuTree?.filter(item => item.menuPath.includes(standardPoint));

    const [paginationInfo, setPaginationInfo] = useState({
        currentPage: 1,
        totalPages: 0,
        totalRecord: 0,
        pageSize: 6
    });


    const initFetch = async () => {
        try {
            //page, pageSize
            const params = new URLSearchParams({
                currentPage: paginationInfo.currentPage, // 클라이언트가 결정하는 현재페이지, 기본값은 1
                pageSize:  paginationInfo.pageSize, // 보여줄 페이지 개수 10로 고정
            });

            console.log("params.toString()",params.toString());

            // 서버로 응답 요청
            const response = await fetch(`/api/admin/board/qnaOneList`, {
                method: "GET",
            });
            // 돌아온 응답 상태
            if (!response.ok) { // 응답 상태가 200아니면
                console.log(response.status)
                throw new Error("서버 응답 에러");
            }
            // 응답 성공시
            const data = await response.json(); // 프라미스객체 (resolve) JSON형태로 파싱
            console.log("-------------------- 1:1문의 데이터 -----", data);// 있음
            setQnaOneData(data);
        } catch (err) {
            console.log("도서 데이터 불러오기 실패", err); // 오류 처리
        }
    }//fetch end


    useEffect(() => {
        console.log("adminBoard------------------")
        initFetch();
    }, []);

    //페이지버튼 클릭시 실행되는 핸들러
    const onChangePageHandler = (page) => {
        console.log("changePage----",page);
        //pagination의 currentPage 값 갱신
        setPaginationInfo((prev) =>({
            ...prev,
            currentPage: page
        }))

    }


    // if (isLoading) {
    //     return <div>로딩 중...</div>;
    // }






    return(
        <>
            <div className="page d-flex">
                <div className="left">
                    <LeftMenu menu={menu}/>
                </div>


                {/*링크이동할 사이드메뉴 */}
                <div className="right">
                    <section className="content">
                        <div className="content-inner">
                            {/*현재경로의 메뉴명출력 */}
                            {subNavi?.[0].secondChild?.filter(item => (item.menuDepth === "2차메뉴" && item.menuPath === currentPath))
                                .map((item) =>{
                                        return (
                                            <h3 className="sub-title current-title title-border">{item.menuName}</h3>
                                        )
                                    }
                                )}

                            
                            {/*브레드 크럼 출력*/}
                            <ol className="menu-navi d-flex">
                                {/* 서브페이지 네비게이션 */}
                                <li><Link to={adminHome}>홈</Link></li>
                                {subNavi?.[0].menuId !== "adminBoard" && (
                                    <li><Link to={subNavi?.[0].menuPath}>{subNavi?.[0].menuName}</Link></li>
                                )}
                                {subNavi?.[0]?.secondChild && (
                                  subNavi?.[0].secondChild?.filter(item => (item.menuDepth === "2차메뉴" && item.menuPath === currentPath))
                                        .map((item) => {
                                            return (
                                                <li key={item.menuName}> <Link to={item.menuPath}>{item.menuName}</Link></li>
                                            )
                                        })
                                    )
                                }
                            </ol>

                            {/*  문의관리  1차메뉴일 경우  컨텐츠*/}
                            <BookBoardStateContext.Provider value={qnaOneData}>
                                <BookBoardDispatchContext.Provider value={null}>
                                    <PaginationContext.Provider  value={{paginationInfo, onChangePageHandler}}>
                                    <Outlet />
                                    </PaginationContext.Provider>
                                </BookBoardDispatchContext.Provider>
                            </BookBoardStateContext.Provider>

                            {/*  문의관리 2차메뉴일경우 컨텐츠 */}

                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}

export default AdminBoard;