import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import modal from "bootstrap/js/src/modal.js";


// 부모로부터 받아올 데이터 파라미터로 가져오고,
const StaticModal =({show, onClose, onConfirm, modalType, errorData })=>{
        console.log("showModal-----------a모달",show);
        console.log("errorData-----------a모달",errorData);
        console.log("modalType-----------a모달",modalType);
        console.log("onConfirm-----------a모달",onConfirm);
        return (
            <Modal show={show} onHide={onClose}>
                <Modal.Dialog>
                    <Modal.Header closeButton>
                        <Modal.Title>알림</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {modalType === "error" && (
                            <p>
                                <span>{errorData.message} :</span>
                                <span>{errorData.error} :</span>
                            </p>
                        )}
                        {modalType === "notFound" && (
                            <p>
                                <span>{errorData.message} :</span>
                                <span>{errorData.missingIds}</span>
                            </p>
                        )}

                        {modalType === "delete" &&(
                          <p>삭제하시겠습니까?</p>
                        )}
                    </Modal.Body>

                    <Modal.Footer>
                        {/*삭제일떄, 확인일때 버튼 나눠서 나오게 처리하기*/}
                        <Button variant="primary" onClick={onConfirm}>확인</Button>
                        <Button variant="secondary" onClick ={onClose}>닫기</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal>
        );

}
export default StaticModal;