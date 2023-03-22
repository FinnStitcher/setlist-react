import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Modal({ children, id, state, setState, modalMsg, navTo }) {
	const modalRef = useRef();

	const navigate = useNavigate();

	useEffect(() => {
		state ? modalRef.current.showModal() : modalRef.current.close();
	}, [state]);

	function closeHandler() {
		setState(false);

		if (modalMsg.toLowerCase().includes('success')) {
			navigate(navTo);
            setState(false);
		}
	}

	return (
		<dialog className="modal" id={id} ref={modalRef}>
			<p>{modalMsg}</p>

			{children}

			<button className="font-semibold mt-0.5" onClick={closeHandler}>
				Close
			</button>
		</dialog>
	);
}

export default Modal;
