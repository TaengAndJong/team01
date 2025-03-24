
import {Routes, Route, Navigate} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

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
import AdminBook from "./pages/adminBook/adminBookComponent.jsx";
import WishList from "./pages/wishList/wishListComponent.jsx";
import Book from "./pages/book/bookComponent.jsx";
import Board from "./pages/board/boardComponent.jsx";
import Layout from "./layout/Layout.jsx";
import AdminBookModify from "./pages/adminBook/components/adminBookModify.jsx";
import AdminBookCreate from "./pages/adminBook/components/adminBookCreate.jsx";
import AdminBookDetail from "./pages/adminBook/components/adminBookDetail.jsx";
import AdminBookList from "./pages/adminBook/components/adminBookList.jsx";
import LeftMenu from "./layout/LeftMenu.jsx";



function App() {


    return (
        <div className="App">
            <Routes>
                {/* Index 컴포넌트 */}
                <Route path={PathData.page.index} element={<Index/>}/>

                {/* 공통 Layout */}
                <Route path="/" element={<Layout/>}>
                    {/* 공통 컴포넌트 */}
                    <Route path={PathData.page.login} element={<Login/>}/>
                    <Route path={PathData.page.logout} element={<Logout/>}/>
                    <Route path={PathData.page.myPage} element={<Mypage/>}/>
                    <Route path={PathData.page.cart} element={<Cart/>}/>
                    <Route path={PathData.page.wishList} element={<WishList/>}/>
                    <Route path={PathData.page.signup} element={<SignUp/>}/>

                    {/* 클라이언트 전용 라우트 */}
                    <Route index path={PathData.page.main} element={<Main/>}/>
                    <Route path={PathData.page.book} element={<Book/>}/>
                    <Route path={PathData.page.board} element={<Board/>}/>

                    {/* 관리자 전용 라우트 , 중첩라우트는 상대경로 사용함*/}
                    <Route path="/admin" element={<Admin/>}/>
                    <Route index path="dashboard" element={<AdminDashboard/>}/>

                    <Route path={PathData.page.adminBoard} element={<AdminBoard/>}>
                        {/*<Route index element={<Navigate to="oneBoard" replace/>}/>  /!* 첫 페이지를 특정 경로로 이동 *!/*/}
                        <Route path="deliveryBoard" element={<AdminDeliveryBoard/>}/>
                        <Route path="productBoard" element={<AdminProductBoard/>}/>
                        <Route path="oneBoard" element={<AdminOneBoard/>}/>
                    </Route>


                    <Route path={PathData.page.adminBook} element={<AdminBook/>}>
                        <Route path="bookList" element={<AdminBookList/>}/>
                        <Route path="bookCreate" element={<AdminBookCreate/>}/>
                        <Route path="bookDetail/:bookId" element={<AdminBookDetail/>}/>
                        <Route path="bookModify/:bookId" element={<AdminBookModify/>}/>
                    </Route>

                </Route>
            </Routes>
        </div>
    );

}

export default App;
