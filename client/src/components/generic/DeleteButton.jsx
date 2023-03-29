function DeleteButton({ id }) {
	return (
		<button
			type="button"
			data-id={id}
			data-modal-btn="open-modal"
			data-btn-type="del-btn"
			className="rectangle-btn w-36 text-left"
		>
			Delete
		</button>
	);
}

export default DeleteButton;
