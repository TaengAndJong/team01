const PathsData = // 객체 데이터 구조 미완성
    {
        page: {
            index:"*",//클라이언트 페이지 하위 자식 전부 라우팅허용 ( 클라이언트, 관리자 분리시 최상위 선언 필요)
            main: "/",//  로그인후 메인, 또는 메인
            login: "/login",//로그인
            logout: "/logout",//로그아웃
            signup: "/signup", //회원가입
            cart:  "/cart", //장바구니 ( 에 담긴 상품(도서)데이터들)
            myPage:"/mypage", // 마이페이지
            wishList:"/wishList", // 마이페이지
            book: "/book",//도서
            delivery: "/delivery",//배송(주소관리, 배송상태, 시작일, 완료일, 배송비 등)
            board: "/board",//게시판


            //adminAll:"/admin/*", // App.jsx에서 admin 하위 자식 전부 라우팅 허용
            //관리자 컴포넌트에서 사용할 URL
            admin: "/admin",//로그인 후 관리자 메인
            adminDashboard: "/admin/Dashboard",// 대시보드
            adminBoard: "/admin/board",
            // 게시판 주소 동적 구현 가능?
            adminBook:"/admin/book", // 관리자 등록된 도서 목록게시판
            adminBookCreate:"/admin/book/bookCreate",
            adminBookModify:"/admin/book/bookModify",
            adminBookList:"/admin/book/bookList",
            adminBookDetail:"/admin/book/bookDetail",
        },
    }
export default PathsData;
