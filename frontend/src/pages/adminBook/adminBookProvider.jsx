import {createContext, useContext, useEffect} from "react";
import {useAdminBookManagement} from "./useAdminBookManagement.jsx";

/*
* useAdminBookManagement 훅을 실행해서 실제데이터를 가져오고, 수정하는 로직을 준비
* 준비된 데이터를 프로바이더 하위자식들({children})에게 전달 value={bookManager}
* */

//컴포넌트들에서 사용할 컨텍스트 생성 (export로 외부 노출은 선택사항, 외부 노출 안할 경우, 하단 캡슐화 필요 )
const AdminBookContext = createContext();

export const AdminBookProvider = ({ children, modalparams }) => {
    console.log("modalparams", modalparams);

    const { openModal, closeModal, navigate } = modalparams;

    const bookManager  = useAdminBookManagement(openModal, closeModal,navigate);

    useEffect(() => {
        bookManager.fetchBookList();
    }, [bookManager.paginationInfo.currentPage, bookManager.searchCondition]);

    return(
        <AdminBookContext.Provider value={bookManager}>
            {children}
        </AdminBookContext.Provider>
    )

}


//한 번더 캡슐화하여 리액트에서 컨텍스트에 대한 검증이 없기때문에 로직 추가
export const useAdminBook = () => {
    const context = useContext(AdminBookContext);
    //if (!context)  provider로 감싸지 않은 것에 대한 에러 처리
    if (!context) throw new Error("useAdminBook은 AdminBookProvider 안에서만 사용 가능합니다.");
    return context; // adminbookContext 반환
};