import { useRef, useEffect } from "react";

import {useModalContext} from '../../hooks';

function Iframe() {
	const { modal, setModal } = useModalContext();
	const modalRef = useRef();

	useEffect(() => {
		modal.active === "yt-frame" && modalRef.current.open === false
			? modalRef.current.showModal()
			: modalRef.current.close();
	}, [modal]);

	function closeHandler() {
		setModal({
			...modal,
			active: "",
			msg: "",
			navTo: "",
            iframe: ""
		});
	}

	return (
		<dialog className="modal" id="yt-frame" ref={modalRef}>
            <iframe className="w-full h-48" src={modal.iframe}></iframe>

			<button className="font-semibold mt-1" onClick={closeHandler}>
				Close
			</button>
		</dialog>
	);
}

export default Iframe;
