/* context 작성
    1) Context 선언
    2) provider 작성 : 상태관리변수, 필요한 함수, 반환할 컴포넌트 
    3) 커스텀리액트 훅
 */

/*
*   1) 전역모달 사용 할 곳에 provider를 통해 전달된 props작성
*       => const {openModal,closeModal}=useModal();
* */


import {createContext, useContext, useState} from "react";
import PublicModal from "./PublicModal.jsx";

//Context 선언
const ModalContext = createContext();

//Provider(제공자)
/* children 은 provider의 자식들을 전부 담아올 수 잇음 ! */
export const ModalProvider = ({children}) => { //children을 통해 provider 자식들을 전부 받아와 렌더링
    //컨텍스트로 관리할 객체 상태관리변수
    const [state, setState] = useState({
        show:false,
        modalType:"confirm",// 기본 : confirm //기본 모달 타입, 모달 타입은 publicModal 참조
        data:{}, // 받아올 데이터 메시지
        onConfirm:null, //확인
        onClose: null,//닫기
        content: null,//내용 추가
    });
    //state end
    console.log("content =-=--------------",state.content);

    //필요한 파라미터
    //모달 열기
    const openModal = ({show=true, onClose, modalType, onConfirm, data,content}) => {
        console.log("openModal-----------------content ", content);

        setState({
            show,// 모달열림 불린값
            modalType:modalType, // 모달 타입 : error,delete, modify,create 등등
            data: data || {}, //erroData가 있으면 , 없으면
            onConfirm:onConfirm || null, // 확인 버튼
            onClose:onClose || null , // 닫기, 취소버튼
            content:content || null, // 컨텐츠
        });
    }

    // 모달 닫기
    const closeModal = () => {
        console.log("closeModal-----------------");
        setState((prev) => ({ ...prev, show: false }));
    };



    //반환
    return (

        <ModalContext.Provider value={{ openModal, closeModal}}>
            {children}
            {state.show && (
                <PublicModal
                    show={state.show}
                    onClose={closeModal}
                    onConfirm={state.onConfirm}
                    modalType={state.modalType}
                    data={state.data}
                    content={state.content}>
                </PublicModal>
            )}
        </ModalContext.Provider>

    )
//end
}

//context 커스텀 훅 내보내기
export const useModal = () => useContext(ModalContext);