
import {Routes, Route } from "react-router-dom";
import './App.css'

import SignUp from "./pages/singUp/signUpComponent.jsx";
import PathData from "./assets/pathsData.jsx";
import Index from "./index.jsx";
import Main from "./pages/main/mainComponent.jsx";
import Login from "./pages/login/loginComponent.jsx";
import Logout from "./pages/logout/logoutComponent.jsx";
import Mypage from "./pages/myPage/mypageCompoenet.jsx";
import Cart from "./pages/cart/cartComponent.jsx";

import Admin from "./pages/admin/adminCoponent.jsx";
import AdminDashboard from "./pages/adminBoard/components/adminDashboard.jsx";
import AdminDeliveryBoard from "./pages/adminBoard/components/deliveryBoard.jsx"
import AdminProductBoard from "./pages/adminBoard/components/productBoard.jsx";
import AdminOneBoard from "./pages/adminBoard/components/qnaOneBoard.jsx";
import AdminBoard from "./pages/adminBoard/adminBoardComponent.jsx";
import AdminBook from "./pages/adminBook/boardComponent.jsx";
import WishList from "./pages/wishList/wishListComponent.jsx";
import Book from "./pages/book/bookComponent.jsx";
import Board from "./pages/board/boardComponent.jsx";
import Layout from "./layout/Layout.jsx";



function App() {



    return (
        <div className="App">

                <Routes>
                    {/* <Index/>  컴포넌트
                        @react-refresh:160 No routes matched location "/admin/book"  Error Component Stack 경고 방지
                    */}
                    <Route path={PathData.page.index} element={<Index />}/>
                    <Route path="/" element={<Layout />}>
                        {/*공통컴포넌트*/}
                        <Route path={PathData.page.login} element={<Login />} />  {/*로그인*/}
                        <Route path={PathData.page.logout} element={<Logout/>} />{/*로그아웃*/}
                        <Route path={PathData.page.myPage} element={<Mypage />} />{/*마이페이지*/}
                        <Route path={PathData.page.cart} element={<Cart />} />{/*장바구니*/}
                        <Route path={PathData.page.wishList}element={<WishList />} />{/*위시리스트*/}
                        <Route path={PathData.page.signup} element={<SignUp/>} />{/*회원가입*/}


                         {/* 클라이언트 전용 라우트 */}
                        <Route index path={PathData.page.main} element={<Main/>} />{/*메인*/}
                        <Route path={PathData.page.book} element={<Book />} />{/*도서판매*/}
                        <Route path={PathData.page.board} element={<Board />} />{/*게시판 - 자식: 문의게시판 추가하기*/}

                            {/*<Route path="/test/qnaList" element={<Qna/>} />*/}
                            {/*<Route path="/create" element={<QnaCreate/>} />*/}
                            {/*<Route path="/post/:id" element={<QnaDetail/>} />*/}
                            {/*<Route path="/edit/:id" element={<QnaEdit/>} />*/}


                        {/* 관리자 전용 라우트 */}
                        <Route path="/admin" element={<Admin />}/>
                        <Route path={PathData.page.adminBook} element={<AdminBook />} />
                        <Route path={PathData.page.adminBoard} element={<AdminBoard/>} />
                        <Route path={PathData.page.adminDashboard} element={<AdminDashboard />} />
                        <Route path={PathData.page.adminDeliveryBoard} element={<AdminDeliveryBoard />} />
                        <Route path={PathData.page.adminProductBoard} element={<AdminProductBoard />} />
                        <Route path={PathData.page.adminOneBoard} element={<AdminOneBoard />} />
                    </Route>
                </Routes>
        </div>
      );

}

export default App;
