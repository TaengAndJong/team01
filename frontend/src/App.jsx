import {useEffect, useState} from 'react'
import {Routes, Route } from "react-router-dom";


import './App.css'
import { AuthProvider } from "./pages/common/AuthContext.jsx";
import Header from "./layout/Header.jsx";
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
import AdminProductBoard from "./pages/adminBoard/components/productBoard.jsx"
import AdminOneBoard from "./pages/adminBoard/components/qnaOneBoard.jsx"
import WishList from "./pages/wishList/wishListComponent.jsx";
import Book from "./pages/book/bookComponent.jsx";
import Board from "./pages/board/boardComponent.jsx";




function App() {
    const [data, setData] = useState('');
    const [url,setUrl] = useState('/api'); // 기본 URL 설정



    useEffect(() => {
        // navigation fetch 경로 동적기능 필요
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    console.log("???",response.text())
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // 응답의 Content-Type을 확인하여 처리
                const contentType = response.headers.get("Content-Type");

                if (contentType && contentType.includes("application/json")) {
                    // JSON 응답일 경우
                    return response.json();
                } else {
                    // 텍스트 응답일 경우
                    return response.text();
                }

            })
            .then((data) => {
                setData(data); // 받은 문자열 상태에 저장
            })
            .catch((error) => console.error('Fetch error:', error));
    }, [url]);



    return (
        <div className="App">
            <AuthProvider>
                 <Header />
                <Routes>
                    {/* <Index/>  컴포넌트
                        @react-refresh:160 No routes matched location "/admin/book"  Error Component Stack 경고 방지
                    */}
                    <Route path={PathData.page.index} element={<Index />}/>
                    {/*공통컴포넌트*/}
                    <Route path={PathData.page.login} element={<Login />} />  {/*로그인*/}
                    <Route path={PathData.page.logout} element={<Logout data={data}/>} />{/*로그아웃*/}
                    <Route path={PathData.page.myPage} element={<Mypage />} />{/*마이페이지*/}
                    <Route path={PathData.page.cart} element={<Cart />} />{/*장바구니*/}
                    <Route path={PathData.page.wishList}element={<WishList />} />{/*위시리스트*/}
                    <Route path={PathData.page.signup} element={<SignUp/>} />{/*회원가입*/}


                     {/* 클라이언트 전용 라우트 */}
                    <Route path={PathData.page.main} element={<Main/>} />{/*메인*/}
                    <Route path={PathData.page.book} element={<Book />} />{/*도서판매*/}
                    <Route path={PathData.page.board} element={<Board />} />{/*게시판 - 자식: 문의게시판 추가하기*/}

                        {/*<Route path="/test/qnaList" element={<Qna/>} />*/}
                        {/*<Route path="/create" element={<QnaCreate/>} />*/}
                        {/*<Route path="/post/:id" element={<QnaDetail/>} />*/}
                        {/*<Route path="/edit/:id" element={<QnaEdit/>} />*/}


                    {/* 관리자 전용 라우트 */}
                    <Route path="/admin" element={<Admin />}>
                        <Route index path={PathData.page.adminBoard} element={<AdminDashboard />} />
                        {/* 자식 라우트 */}
                        <Route path={PathData.page.adminDeliveryBoard} element={<AdminDeliveryBoard />} />
                        <Route path={PathData.page.adminProductBoard} element={<AdminProductBoard />} />
                        <Route path={PathData.page.adminOneBoard} element={<AdminOneBoard />} />
                    </Route>

                </Routes>
            </AuthProvider>
        </div>
    );

}

export default App
