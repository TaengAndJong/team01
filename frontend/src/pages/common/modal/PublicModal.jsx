import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';



// 부모로부터 받아올 데이터 파라미터(props)로 가져 옴,

//함수형 구성객체 : 함수를 담은 객체를 의미 , 모달 속성 설정 객체
const modalConfig = {
    noSelection: ({ data, onClose }) => ({
        body: <p>{data?.message || "선택된 데이터가 없습니다."}</p>,
        footer: <Button onClick={onClose}>확인</Button>,
    }),
    notFound: ({ data, onClose }) => ({
        body: (
            <>
                <p>{data?.message}</p>
                <p>{data?.missingIds?.join(", ")}</p>
            </>
        ),
        footer: <Button onClick={onClose}>확인</Button>,
    }),
    error: ({ data, onClose }) => ({
        body: (
            <>
                <p>{data?.message}</p>
                <p>{data?.error}</p>
            </>
        ),
        footer: <Button onClick={onClose}>닫기</Button>,
    }),
    login: ({ data, onClose ,onConfirm}) => ({
        body: (
            <>
                <p>{data?.message}</p>
                <p>{data?.error}</p>
            </>
        ),
        footer: (
            <>
                <Button variant="danger" onClick={onConfirm}>확인</Button>
                <Button variant="secondary" onClick={onClose}>취소</Button>
            </>
        ),
    }),
    confirm: ({ data,onClose, onConfirm }) => ({
        body: <p>{data.message}</p>,
        footer: (
            <>
                <Button variant="danger" onClick={onConfirm}>확인</Button>
            </>
        ),
    }),

    delete: ({ onClose, onConfirm }) => ({
        body: <p>삭제하시겠습니까?</p>,
        footer: (
            <>
                <Button variant="danger" onClick={onConfirm}>확인</Button>
                <Button variant="secondary" onClick={onClose}>취소</Button>
            </>
        ),
    }),
    modify: ({ onClose, onConfirm }) => ({
        body: <p>수정하시겠습니까?</p>,
        footer: (
            <>
                <Button variant="danger" onClick={onConfirm}>확인</Button>
                <Button variant="secondary" onClick={onClose}>취소</Button>
            </>
        ),
    }),
    create: ({ onClose, onConfirm }) => ({
        body: <p>생성하시겠습니까?</p>,
        footer: (
            <>
                <Button variant="danger" onClick={onConfirm}>확인</Button>
                <Button variant="secondary" onClick={onClose}>취소</Button>
            </>
        ),
    }),
};

// 재사용 가능한 모달 컴포넌트
const publicModal = ({ show, onClose, onConfirm, modalType, data }) => {
    console.log(`show-----------  ${show}, onClose ${onClose}`);
    console.log(`modalType ${modalType}, onConfirm ${onConfirm}`);
    console.log(` errorData ${data}`);


    const current = modalConfig[modalType]
        ? modalConfig[modalType]({ data, onClose, onConfirm })
        : {
            body: <p>알 수 없는 모달 유형입니다.</p>,
            footer: <Button onClick={onClose}>닫기</Button>,
        };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>알림</Modal.Title>
                </Modal.Header>
                <Modal.Body>{current.body}</Modal.Body>
                <Modal.Footer>{current.footer}</Modal.Footer>
            </Modal.Dialog>
        </Modal>
    );
};

export default publicModal;