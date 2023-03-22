import {useRef} from 'react';

function TestModal({modal, closeFn, id, msg}) {
    const modalRef = useRef();

	return (
		<dialog className="modal" id={id} open={modal === id}>
			<p>{msg}</p>

			<button className="font-semibold mt-0.5" onClick={closeFn}>Close</button>
		</dialog>
	);
}

export default TestModal;
