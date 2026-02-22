import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import React from "react";
import LeftMenu from "../../layout/LeftMenu.jsx";
import { useMenu } from "../common/MenuContext.jsx";
import { menuNavi } from "../../util/menuNavi.jsx";
import {useModal} from "../common/modal/ModalContext.jsx";
import {AdminBookProvider} from "./adminBookProvider.jsx";
//-- 도서관리 리팩토링 전 백업 600219
// 주소에 해당하는 제목 데이터 가져와서 레프트 메뉴 이름과 제목열에 데이터 나열하기

//context 상태관리
export const BookStateContext = React.createContext(); // state 값을 공급하는 context
export const BookDispatchContext = React.createContext(); // 생성, 수정(갱신), 삭제 값을 공급하는 context
export const PaginationContext = React.createContext();

const AdminBook = () => {

  const { menu, currentPath, standardPoint } = useMenu(); // menuProvider에서 데이터를 제공하는 커스텀훅
  //modal
  const {openModal,closeModal} = useModal();
  //네입게이트 리액트훅
  const navigate=useNavigate();
  // adminbook.provider에 객체로 모아서 담아주기
  const modalparams = {openModal,closeModal,navigate};

  //관리자 메뉴들
  let adminMenuTree = menuNavi(menu?.adminList);
  let adminHome = menu?.adminList?.find(
      (item) => item.menuId === "admin"
  )?.menuPath;
  let subNavi = adminMenuTree?.filter((item) =>
      item.menuPath.includes(standardPoint)
  );


  // 상세페지이 클래스 추가기준
  const location = useLocation().pathname;
  const  pageSubClass = (subUrl)=>{
    if (!subUrl) return "";

    const lower = subUrl.toLowerCase();
    if (lower.includes("detail")) return "detail";
    if (lower.includes("modify")) return "modify";

    return "";
  }

  return (
      <>
        <div className={`page adminBook d-flex ${pageSubClass(location)}`}
        >
          <div className="left">
            <LeftMenu />
          </div>

          {/*링크이동할 사이드메뉴 */}
          <div className="right">
            <section className="content custom-border">
              <div className="content-inner">
                {/*현재경로의 페이지명 depth 2 */}
                <h3 className="sub-title current-title title-border">
                  {menu?.adminList?.map((item) => {
                    if (item.menuPath.startsWith(`${currentPath}`)) {
                      return item.menuName;
                    }
                  })}
                </h3>

                {/*depth별 네비주소,현재페이지일 경우 표시필요*/}
                <ol className="menu-navi title-border">
                  {/* 서브페이지 네비게이션 */}
                  <li>
                    <Link to={adminHome} className="home icon">
                      <span className="sr-only">홈</span>
                    </Link>
                  </li>
                  {subNavi?.[0] && (
                      <li>
                        <Link to={subNavi?.[0].menuPath}>
                          {subNavi?.[0].menuName}
                        </Link>
                      </li>
                  )}
                  {subNavi?.[0]?.secondChild?.length > 0 && (
                      <li>
                    <span>
                      {subNavi?.[0]?.secondChild
                          ?.filter(
                              (item) =>
                                  item.menuDepth === "2차메뉴" &&
                                  item.menuPath.includes(currentPath)
                          )
                          .map((item) => item.menuName)}
                    </span>{" "}
                      </li>
                  )}
                </ol>
                {/*adminbook 부모가 provider에 props로 직접적으로 modalparams를 전달
                  Context랑은 상관없는 데이터 전달(Props)로,
                  AdminBookProvider라는 컴포넌트 내부에서만 해당 데이터 사용 가능*/}
                <AdminBookProvider>
                  <Outlet />
                </AdminBookProvider>
              </div>
            </section>
          </div>
        </div>
      </>
  );
};
export default AdminBook;

/*
* 리액트는 성능 최적화를 위해 데이터(state) 와 함수 (dispatch) 를 분리하도록 권장
* 데이터가 변경될 때, 불필요한 리렌더링을 방지하기 위함
* */