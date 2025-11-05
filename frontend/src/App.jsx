import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
// main.jsx 또는 App.jsx에서 추가
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { MenuProvider } from "@pages/common/MenuContext.jsx";
import Layout from "./layout/Layout.jsx";

import SignUp from "@pages/signUp/signUpComponent.jsx";
import PathData from "./assets/pathsData.jsx";
import Index from "./index.jsx";
import Main from "@pages/main/mainComponent.jsx";
import Login from "@pages/login/loginComponent.jsx";
import Logout from "@pages/logout/logoutComponent.jsx";
import Mypage from "@pages/myPage/mypageCompoenet.jsx";
import Cart from "@pages/cart/cartComponent.jsx";

import Admin from "@pages/admin/adminCoponent.jsx";
import AdminDashboard from "@pages/adminBoard/components/adminDashboard.jsx";
import AdminDeliveryBoard from "@pages/adminBoard/components/deliveryBoard.jsx";
import AdminProductBoard from "@pages/adminBoard/components/productBoard.jsx";
import AdminOneBoard from "@pages/adminBoard/components/OneBoard.jsx";
import AdminBoard from "@pages/adminBoard/adminBoardComponent.jsx";
import AdminBook from "@pages/adminBook/adminBookComponent.jsx";
import AdminDetailBoard from "@pages/adminBoard/components/adminDetailBoard.jsx";
import Book from "@pages/book/bookComponent.jsx";

import AdminBookModify from "@pages/adminBook/components/adminBookModify.jsx";
import AdminBookCreate from "@pages/adminBook/components/adminBookCreate.jsx";
import AdminBookDetail from "@pages/adminBook/components/adminBookDetail.jsx";
import AdminBookList from "@pages/adminBook/components/adminBookList.jsx";

//board
import Board from "@pages/board/boardComponent.jsx";
import CreateBoard from "@pages/board/components/createBoardComponent.jsx";
import BoardTemplateComponent from "@pages/board/components/boardTemplateComponent.jsx";
import DetailBoard from "@pages/board/components/BoardDetail.jsx";
import BoardDashboard from "@pages/board/components/boardDashboard.jsx";

import BookList from "@pages/book/components/bookList.jsx";
import BookDetail from "@pages/book/components/bookDetail.jsx";
import CartList from "@pages/cart/components/cartList.jsx";

// mypage
import AddressComponent from "@pages/myPage/delivery/AddressComponent.jsx";
import WishComponent from "@pages/myPage/wish/WishComponent.jsx";
import MyPageMain from "@pages/myPage/myPage/MyPageMain.jsx";
import PersonalInfo from "@pages/myPage/personal/PersonalInfo.jsx";
import WishList from "@pages/myPage/wish/WishList.jsx";
import PaymentHistory from "@pages/myPage/payment/PaymentHistory.jsx";
//payment
import PaymentComponent from "@pages/pay/paymentComponent.jsx";
//aixos  로그인 여부확인용 js ==> 전역처리할경우 사용, 각 컴포넌트에서 로그인여부 사용할경우 필요없음
//import "@js/AxiosInterceptor";

//log
import VisitRecorder from "./pages/common/VisitRecorder.jsx";

function App() {
  let location = useLocation();
  const headerName = () => {
    if (location.pathname.startsWith("/admin")) {
      return "admin";
    }
    return "client";
  };

  return (
    <div className={`App ${headerName()}`}>
      <MenuProvider>
        <VisitRecorder />
        <Routes>
          {/* Index 컴포넌트 */}
          <Route path={PathData.page.index} element={<Index />} />

          {/* 공통 Layout */}
          <Route path="/" element={<Layout />}>
            {/* 공통 컴포넌트 */}
            <Route path={PathData.page.login} element={<Login />} />
            <Route path={PathData.page.logout} element={<Logout />} />
            <Route path={PathData.page.myPage} element={<Mypage />}>
              <Route index element={<MyPageMain />} />
              <Route path="personal" element={<PersonalInfo />} />
              <Route path="address" element={<AddressComponent />} />
              <Route path="payHistory" element={<PaymentHistory />} />
              <Route path="wishlist" element={<WishComponent />}>
                <Route index element={<WishList />} />
              </Route>
            </Route>
            <Route path={PathData.page.cart} element={<Cart />}>
              <Route index path="" element={<CartList />} />
            </Route>
            <Route
              path={PathData.page.payment}
              element={<PaymentComponent />}
            />
            {/*<Route path="paySuccess/:payId" element={<PaymentSuccess/>}/>  /!*중첩라우팅사용하려면 최상위 부모 컴포넌트에 <Outlet/>을 사용해야 함!*!/*/}
            <Route path={PathData.page.signup} element={<SignUp />} />

            {/* 클라이언트 전용 라우트 */}
            <Route index path={PathData.page.main} element={<Main />} />
            <Route path={PathData.page.book} element={<Book />}>
              <Route index path="" element={<BookList />} />
              <Route path="bookDetail/:bookId" element={<BookDetail />} />
              {/*<Route index element={<Navigate to="bookList" replace/>}/>*/}
              {/*<Route path="bookList" element={<BookList/>} />*/}
            </Route>

            <Route path={PathData.page.board} element={<Board />}>
              {/*클라이언트 게시물 생성 수정*/}
              <Route index element={<BoardDashboard />} />
              <Route path="createBoard" element={<CreateBoard />} />
              <Route
                path="oneBoard"
                element={<BoardTemplateComponent category="one" />}
              />
              <Route
                path="productBoard"
                element={<BoardTemplateComponent category="product" />}
              />
              <Route
                path="deliveryBoard"
                element={<BoardTemplateComponent category="delivery" />}
              />

              <Route
                path="/board/detailBoard/:category/:boardId/"
                element={<DetailBoard userType="client" />}
              />
            </Route>

            {/* 관리자 전용 라우트 , 중첩라우트는 상대경로 사용함*/}
            <Route path="/admin" element={<Admin />} />
            {/* <Route index path="dashboard" element={<AdminDashboard />} /> */}
            <Route path={PathData.page.adminBoard} element={<AdminBoard />}>
              {/*첫페이지 설정*/}
              <Route index element={<Navigate to="oneBoard" />} />
              <Route
                path="deliveryBoard"
                element={<AdminDeliveryBoard category="delivery" />}
              />
              <Route
                path="productBoard"
                element={<AdminProductBoard category="product" />}
              />
              <Route
                path="oneBoard"
                element={<AdminOneBoard category="one" />}
              />

              <Route
                path="detail/:category/:boardId"
                element={<AdminDetailBoard userType="admin" />}
              />
            </Route>

            <Route path={PathData.page.adminBook} element={<AdminBook />}>
              <Route index element={<Navigate to="bookList" replace />} />
              <Route path="bookList" element={<AdminBookList />} />
              <Route path="bookCreate" element={<AdminBookCreate />} />
              <Route path="bookDetail/:bookId" element={<AdminBookDetail />} />
              <Route path="bookModify/:bookId" element={<AdminBookModify />} />
            </Route>
          </Route>
        </Routes>
      </MenuProvider>
    </div>
  );
}

export default App;
