import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

/* modalType

*
*/

// 부모로부터 받아올 데이터 파라미터(props)로 가져 옴,


//함수형 구성객체 : 함수를 담은 객체를 의미 , 모달 속성 설정 객체
const modalConfig = {
    noSelection: ({ errorData, onClose }) => ({
        body: <p>{errorData?.message || "선택된 데이터가 없습니다."}</p>,
        footer: <Button onClick={onClose}>확인</Button>,
    }),
    notFound: ({ errorData, onClose }) => ({
        body: (
            <>
                <p>{errorData?.message}</p>
                <p>{errorData?.missingIds?.join(", ")}</p>
            </>
        ),
        footer: <Button onClick={onClose}>확인</Button>,
    }),
    error: ({ errorData, onClose }) => ({
        body: (
            <>
                <p>{errorData?.message}</p>
                <p>{errorData?.error}</p>
            </>
        ),
        footer: <Button onClick={onClose}>닫기</Button>,
    }),
    delete: ({ onClose, onConfirm }) => ({
        body: <p>정말 삭제하시겠습니까?</p>,
        footer: (
            <>
                <Button variant="danger" onClick={onConfirm}>확인</Button>
                <Button variant="secondary" onClick={onClose}>취소</Button>
            </>
        ),
    }),
    confirm: ({onClose,confirmData}) => ({
        body: <>
            <p>{confirmData.obj}</p>
            <p>{confirmData.message}</p>
        </>,
        footer: (
            <>
                <Button variant="danger" onClick={onClose}>확인</Button>
            </>
        ),
    }),
};

// 재사용 가능한 모달 컴포넌트
const ReusableModal = ({ show, onClose, onConfirm, modalType, errorData,confirmData }) => {
    const current = modalConfig[modalType]
        ? modalConfig[modalType]({ errorData,confirmData , onClose, onConfirm})
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

export default ReusableModal;