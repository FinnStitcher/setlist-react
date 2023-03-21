import {useNavigate} from 'react-router-dom';

function Modal({ setModal, modalMsg, handleNavigate }) {
    const navigate = useNavigate();

    function closeModal() {
        const $modal = document.querySelector('#modal');

        $modal.close();
        setModal(false);

        if (modalMsg.includes('Success')) {
            handleNavigate();
        }
    }

    return (
        <dialog className="modal" id="modal">
            <p>{modalMsg}</p>

            <button className="font-semibold mt-0.5" onClick={closeModal}>Close</button>
        </dialog>
    )
}

export default Modal;