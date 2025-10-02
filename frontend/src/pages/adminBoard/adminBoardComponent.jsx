import { Link, Outlet } from "react-router-dom";
import React, { useEffect, useState, useReducer } from "react";
import LeftMenu from "../../layout/LeftMenu.jsx";
import { useMenu } from "../common/MenuContext.jsx";
import { menuNavi } from "../../util/menuNavi.jsx";
import { useLocation } from "react-router-dom";
import { ModalProvider } from "@pages/common/modal/ModalContext.jsx";
// 3개 카테고리별 상태 관리를 위한 reducer
function boardReducer(state, action) {
  console.log("boardReducer state:", state);
  console.log("boardReducer action:", action);

  switch (action.type) {
    case "INIT_ONE":
      return {
        ...state,
        one: Array.isArray(action.data) ? action.data : [action.data],
      };
    case "INIT_PRODUCT":
      return {
        ...state,
        product: Array.isArray(action.data) ? action.data : [action.data],
      };
    case "INIT_DELIVERY":
      return {
        ...state,
        delivery: Array.isArray(action.data) ? action.data : [action.data],
      };
    case "CREATE_ONE":
      return {
        ...state,
        one: [...state.one, action.data],
      };
    case "CREATE_PRODUCT":
      return {
        ...state,
        product: [...state.product, action.data],
      };
    case "CREATE_DELIVERY":
      return {
        ...state,
        delivery: [...state.delivery, action.data],
      };
    case "DELETE_ONE":
      return {
        ...state,
        one: state.one.filter(
          (item) => !action.data.includes(String(item.qnaOneId))
        ),
      };
    case "DELETE_PRODUCT":
      return {
        ...state,
        product: state.product.filter(
          (item) => !action.data.includes(String(item.productId))
        ),
      };
    case "DELETE_DELIVERY":
      return {
        ...state,
        delivery: state.delivery.filter(
          (item) => !action.data.includes(String(item.deliveryId))
        ),
      };
    case "UPDATE_ONE":
      return {
        ...state,
        one: state.one.map((item) =>
          item.qnaOneId === action.data.qnaOneId ? action.data : item
        ),
      };
    case "UPDATE_PRODUCT":
      return {
        ...state,
        product: state.product.map((item) =>
          item.productId === action.data.productId ? action.data : item
        ),
      };
    case "UPDATE_DELIVERY":
      return {
        ...state,
        delivery: state.delivery.map((item) =>
          item.deliveryId === action.data.deliveryId ? action.data : item
        ),
      };
    default:
      return state;
  }
}

//context 상태관리
export const BookBoardStateContext = React.createContext(); // state 값을 공급하는 context
export const BookBoardDispatchContext = React.createContext(); // 생성, 수정(갱신), 삭제 값을 공급하는 context
export const PaginationContext = React.createContext();
export const CheckboxContext = React.createContext(); // 체크박스 상태관리 context
const AdminBoard = () => {
  const { menu, currentPath, standardPoint } = useMenu(); // menuProvider에서 데이터를 제공하는 커스텀훅

  // 3개 카테고리별 초기 상태
  const initialState = {
    one: [],
    product: [],
    delivery: [],
  };

  const [state, dispatch] = useReducer(boardReducer, initialState);

  let adminMenuTree = menuNavi(menu?.adminList);
  let adminHome = menu?.adminList?.find(
    (item) => item.menuId === "admin"
  )?.menuPath;
  let subNavi = adminMenuTree?.filter((item) =>
    item.menuPath.includes(standardPoint)
  );

  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    totalPages: 0,
    totalRecord: 0,
    pageSize: 6,
  });

  const initFetch = async () => {
    try {
      //page, pageSize
      const params = new URLSearchParams({
        currentPage: paginationInfo.currentPage, // 클라이언트가 결정하는 현재페이지, 기본값은 1
        pageSize: paginationInfo.pageSize, // 보여줄 페이지 개수 10로 고정
      });

      console.log("params.toString()", params.toString());

      // 서버로 응답 요청 - 3개 API 동시 호출
      const [oneListRes, productListRes, deliveryListRes] = await Promise.all([
        fetch(`/api/admin/board/qnaOneList?${params.toString()}`),
        fetch(`/api/admin/board/qnaProductList?${params.toString()}`),
        fetch(`/api/admin/board/qnaDeliveryList?${params.toString()}`),
      ]);

      // 각 응답의 상태 확인
      console.log("API 응답 상태:", {
        oneListRes: oneListRes.status,
        productListRes: productListRes.status,
        deliveryListRes: deliveryListRes.status,
      });

      // 응답이 성공인지 확인
      if (!oneListRes.ok) {
        throw new Error(`oneBoardList API 오류: ${oneListRes.status}`);
      }
      if (!productListRes.ok) {
        throw new Error(`productBoardList API 오류: ${productListRes.status}`);
      }
      if (!deliveryListRes.ok) {
        throw new Error(
          `deliveryBoardList API 오류: ${deliveryListRes.status}`
        );
      }

      // 응답 성공시 각각 JSON 파싱
      const [oneData, productData, deliveryData] = await Promise.all([
        oneListRes.json(),
        productListRes.json(),
        deliveryListRes.json(),
      ]);

      console.log("API 응답 데이터:", { oneData, productData, deliveryData });

      // 각 카테고리별로 상태 초기화
      dispatch({ type: "INIT_ONE", data: oneData });
      dispatch({ type: "INIT_PRODUCT", data: productData });
      dispatch({ type: "INIT_DELIVERY", data: deliveryData });

      // 페이지네이션 정보 업데이트 (첫 번째 응답의 페이지네이션 정보 사용)
      if (oneData && oneData.currentPage) {
        setPaginationInfo({
          currentPage: oneData.currentPage,
          pageSize: oneData.pageSize || paginationInfo.pageSize,
          totalPages: oneData.totalPages,
          totalRecord: oneData.totalRecord,
        });
      }
    } catch (err) {
      console.log("문의 게시판 데이터 불러오기 실패", err); // 오류 처리
      console.log("에러 상세 정보:", err.message);
    }
  }; //fetch end

  useEffect(() => {
    console.log("adminBoard------------------");
    initFetch();
  }, [paginationInfo.currentPage]);

  // 각 카테고리별 초기화 함수
  const onInitOne = (data) => {
    console.log("onInitOne", data);
    dispatch({
      type: "INIT_ONE",
      data: data,
    });
  };

  const onInitProduct = (data) => {
    console.log("onInitProduct", data);
    dispatch({
      type: "INIT_PRODUCT",
      data: data,
    });
  };

  const onInitDelivery = (data) => {
    console.log("onInitDelivery", data);
    dispatch({
      type: "INIT_DELIVERY",
      data: data,
    });
  };

  // 각 카테고리별 생성 함수
  const onCreateOne = (createData) => {
    console.log("createOne", createData);
    dispatch({
      type: "CREATE_ONE",
      data: createData,
    });
  };

  const onCreateProduct = (createData) => {
    console.log("createProduct", createData);
    dispatch({
      type: "CREATE_PRODUCT",
      data: createData,
    });
  };

  const onCreateDelivery = (createData) => {
    console.log("createDelivery", createData);
    dispatch({
      type: "CREATE_DELIVERY",
      data: createData,
    });
  };

  // 각 카테고리별 삭제 함수
  const onDeleteOne = (deleteIds) => {
    console.log("deleteOne", deleteIds);
    dispatch({
      type: "DELETE_ONE",
      data: deleteIds,
    });
  };

  const onDeleteProduct = (deleteIds) => {
    console.log("deleteProduct", deleteIds);
    dispatch({
      type: "DELETE_PRODUCT",
      data: deleteIds,
    });
  };

  const onDeleteDelivery = (deleteIds) => {
    console.log("deleteDelivery", deleteIds);
    dispatch({
      type: "DELETE_DELIVERY",
      data: deleteIds,
    });
  };

  // 각 카테고리별 수정 함수
  const onUpdateOne = (updateData) => {
    console.log("updateOne", updateData);
    dispatch({
      type: "UPDATE_ONE",
      data: updateData,
    });
  };

  const onUpdateProduct = (updateData) => {
    console.log("updateProduct", updateData);
    dispatch({
      type: "UPDATE_PRODUCT",
      data: updateData,
    });
  };

  const onUpdateDelivery = (updateData) => {
    console.log("updateDelivery", updateData);
    dispatch({
      type: "UPDATE_DELIVERY",
      data: updateData,
    });
  };

  //페이지버튼 클릭시 실행되는 핸들러
  const onChangePageHandler = (page) => {
    console.log("changePage----", page);
    //pagination의 currentPage 값 갱신
    setPaginationInfo((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  return (
    <>
      <div className="page admin board-detail d-flex">
        <div className="left">
          <LeftMenu menu={menu} />
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
                {subNavi?.[0]?.secondChild && (
                  <li>
                    <span>
                      {subNavi?.[0].secondChild
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

              {/*  문의관리  1차메뉴일 경우  컨텐츠*/}
              <BookBoardStateContext.Provider value={state}>
                <BookBoardDispatchContext.Provider
                  value={{
                    onInitOne,
                    onInitProduct,
                    onInitDelivery,
                    onCreateOne,
                    onCreateProduct,
                    onCreateDelivery,
                    onDeleteOne,
                    onDeleteProduct,
                    onDeleteDelivery,
                    onUpdateOne,
                    onUpdateProduct,
                    onUpdateDelivery,
                  }}
                >
                  <PaginationContext.Provider
                    value={{
                      paginationInfo,
                      onChangePageHandler,
                      setPaginationInfo,
                    }}
                  >
                    <ModalProvider>
                      <Outlet />
                    </ModalProvider>
                  </PaginationContext.Provider>
                </BookBoardDispatchContext.Provider>
              </BookBoardStateContext.Provider>

              {/*  문의관리 2차메뉴일경우 컨텐츠 */}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default AdminBoard;
