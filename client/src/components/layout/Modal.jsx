import { useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ModalContext from "../../ModalContext.jsx";

function Modal({ children, id }) {
	const { modal, setModal } = useContext(ModalContext);
	const modalRef = useRef();

	const navigate = useNavigate();

	let redirTimeout = null;
	let validRedir = modal?.navTo && modal?.navTo !== "/";

	useEffect(() => {
		modal.active === id && modalRef.current.open === false
			? modalRef.current.showModal()
			: modalRef.current.close();
	}, [modal]);

	useEffect(() => {
		if (validRedir) {
			redirTimeout = setTimeout(() => {
				setModal({
					...modal,
					active: "",
					msg: "",
					navTo: ""
				});

				navigate(modal.navTo);
			}, 2000);
		}
	}, [modal.navTo]);

	// if message includes "redirect" - i might change this to use a boolean property on the object -
	// set a timeout and assign it to a variable so we can cancel it
	// if the user clicks the close button, it will stop the timeout and do the redirection anyway
	function closeHandler() {
		setModal({
			...modal,
			active: "",
			msg: "",
			navTo: ""
		});

		if (validRedir) {
			clearTimeout(redirTimeout);
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
