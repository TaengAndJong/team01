import {createContext, useContext, useEffect, useMemo, useReducer, useState} from "react";
import {useAdminListBook} from "./hook/useAdminListBook.jsx";
import {formatToDate} from "../../util/date/dateUtils.jsx";

/*
* useAdminListBook 훅을 실행해서 실제데이터를 가져오고, 수정하는 로직을 준비
* 준비된 데이터를 프로바이더 하위자식들({children})에게 전달 value={bookManager}
* */

//컴포넌트들에서 사용할 컨텍스트 생성 (export로 외부 노출은 선택사항, 외부 노출 안할 경우, 하단 캡슐화 필요 )
const AdminBookContext = createContext();





export const AdminBookProvider = ({ children }) => {


    // 실제 조회 조건 (서버로 보내는 값으로 확정된 검색값 상태관리)
    // 프로바이더에서 관리하는 이유는  페이지 이동을 해도 검색 상태를 유지하기 위함
    const [searchCondition, setSearchCondition] = useState(null);


    // adminContext value에 담아 줄 객체로 스프레드 연산자를 사용해서 바로 훅 내부 요소들에 접근
    const value = {
        searchCondition,
        setSearchCondition
    }


    return(
        <AdminBookContext.Provider value={value}>
            {children}
        </AdminBookContext.Provider>
    )

}


//한 번더 캡슐화하여 리액트에서 컨텍스트에 대한 검증이 없기때문에 로직 추가
export const useAdminBook = () => {
    const context = useContext(AdminBookContext);
    console.log("useAdminBook context",context);
    //if (!context)  provider로 감싸지 않은 것에 대한 에러 처리
    if (!context) throw new Error("useAdminBook은 AdminBookProvider 안에서만 사용 가능합니다.");
    return context; // adminbookContext 반환
};

