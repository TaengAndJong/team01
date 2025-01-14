const pathsData = // 객체 데이터 구조 미완성
    {
        page: {
            home: "/",//  로그인후 메인, 또는 메인
            login: "/login",//로그인
            logout: "/logout",//로그아웃
            signup: "/signup", //회원가입
            cart:  "/cart", //장바구니 ( 에 담긴 상품(도서)데이터들)
            mypage:"/mypage", // 마이페이지
            wishlist:"/wishiList", // 마이페이지
            book: "book",//도서
            delivery: "/delivery",//배송(주소관리, 배송상태, 시작일, 완료일, 배송비 등)
            admin: "/admin",//로그인 후 관리자 메인
            adminAllBoard:"/admin/board", // 관리자 게시판( 전체 데이터)
            adminOneBoard:"/admin/board/one", // 1대1문의
            adminDeliveryBoard:"/admin/board/delivery", // 배송문의
            adminBookBoard:"/admin/board/book", // 상품(도서)문의
            adminBookCreate:"/admin/book/create", // 상품 등록
            adminBookEdit:"/admin/book/edit", // 상품 수정

        },
    }
export default pathsData;
