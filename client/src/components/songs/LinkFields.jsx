function LinkFields({ index, formState, setFormState }) {
	function onChangeHandler(event) {
		const { name, value } = event.target;
        const nameArr = name.split('-');

        const namePlain = nameArr[0]; // e.g. source
        const targetIndex = nameArr[1];

        // create new instance of the links array with the modified object swapped in
        const newLinkObj = {
            ...formState.links[targetIndex],
            [namePlain]: value
        };

        const newLinksArr = [...formState.links];
        newLinksArr[targetIndex] = newLinkObj;

        setFormState({
            ...formState,
            links: [...newLinksArr]
        });
	}

	function deleteHandler(event) {
		const $div = event.target.closest("div");
		const targetIndex = $div.id;

        // create new instance of the links array with this object removed
        const newLinksArr = [...formState.links];
        newLinksArr.splice(targetIndex, 1);

        setFormState({
            ...formState,
            links: [...newLinksArr]
        });
	}

	return (
		<div id={index} className="pb-4 mb-1 border-b border-stone-400/50 w-1/2">
			<label htmlFor={"source-" + index} className="form-label">
				Source {index + 1}{" "}
				<button type="button" className="btn-small bg-stone-300/75" onClick={deleteHandler}>
					<span>-</span>
				</button>
			</label>
			<input
				id={"source-" + index}
				name={"source-" + index}
				className="form-control"
                value={formState.links[index].source}
				onChange={onChangeHandler}
			/>

			<label htmlFor={"href-" + index} className="form-label">
				Link {index + 1}
			</label>
			<input
				id={"href-" + index}
				name={"href-" + index}
				className="form-control"
                value={formState.links[index].href}
				onChange={onChangeHandler}
			/>
		</div>
	);
}

export default LinkFields;
