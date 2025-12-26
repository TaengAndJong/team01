import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';



// 부모로부터 받아올 데이터 파라미터(props)로 가져 옴,

//함수형 구성객체 : 함수를 담은 객체를 의미 , 모달 속성 설정 객체
const modalConfig = {
    //로그인
    login: ({ data, onClose ,onConfirm}) => ({
        body: (
            <>
                <p>{data?.message}</p>
                <p>{data?.error}</p>
            </>
        ),
        footer: (
            <>
                <Button variant="primary" onClick={onConfirm}>확인</Button>
                <Button variant="danger" onClick={onClose}>취소</Button>
            </>
        ),
    }),
    //오류
    error: ({ content, onClose }) => ({
        body: content,
        footer: <Button variant="primary" onClick={onClose}>확인</Button>,
    }),
    // 수정, 생성, 삭제 , 등록
    confirm: ({ content,onClose, onConfirm }) => ({
        body: content,
        footer: (
            <>
                <Button variant="primary" onClick={onConfirm}>확인</Button>
                <Button variant="danger" onClick={onClose}>취소</Button>
            </>
        ),
    }),

    // jsx 문법 태그 사용할때 content
    default: ({content,onConfirm,onClose }) => (
        {
        body: content,
        footer: (
            <>
                <Button variant="danger" onClick={onConfirm}>확인</Button>
                <Button variant="secondary" onClick={onClose}>닫기</Button>
            </>
        ),
    }),
};

// 재사용 가능한 모달 컴포넌트
const publicModal = ({ show, onClose, onConfirm, modalType, data,content }) => {

    console.log(`content 퍼블릭모달-----------  ${content}`);
    console.log(`content 퍼블릭모달-----------data ", ${data}`);
    const current = modalConfig[modalType]
        ? modalConfig[modalType]({ data, onClose, onConfirm,content })
        : {
            body: <p>알 수 없는 모달 유형입니다.</p>,
            footer: <Button onClick={onClose}>닫기</Button>,
        };

    return (
        <Modal show={show} onHide={onClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>알림</Modal.Title>
                </Modal.Header>
                <Modal.Body> {(current && current.body) || <p>내용이 없습니다.</p>}</Modal.Body>
                <Modal.Footer> {current && current.footer ? current.footer : <Button onClick={onClose}>닫기</Button>}</Modal.Footer>
        </Modal>
    );
};

export default publicModal;