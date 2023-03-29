import { useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalContext from '../../ModalContext.jsx';

function Modal({ children, id }) {
	const { modal, setModal } = useContext(ModalContext);
	const modalRef = useRef();

	const navigate = useNavigate();

	useEffect(() => {
		modal.active === id && modalRef.current.open === false
			? modalRef.current.showModal()
			: modalRef.current.close();
	}, [modal]);

	function closeHandler() {
        const {msg} = modal;

		setModal({
			...modal,
			active: '',
			msg: '',
			navTo: '/'
		});

		if (msg.toLowerCase().includes('redirect')) {
			navigate(modal.navTo);
		}
	}

	return (
		<dialog className="modal" id={id} ref={modalRef}>
			<p>{modal.msg}</p>

			{children}

			<button className="font-semibold mt-0.5" onClick={closeHandler}>
				Close
			</button>
		</dialog>
	);
}

export default Modal;
