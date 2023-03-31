import { useState, useEffect } from "react";

function LinkFields({ index, formState, setFormState }) {
	function onChangeHandler(event) {
		const { name, value } = event.target;

		// modify name
		const nameRoot = name.split("-")[0];

		const key = "link-" + index;

		// update form state
		setFormState({
			...formState,
			links: {
				...formState.links,
				[key]: {
					...formState.links[key],
					[nameRoot]: value
				}
			}
		});
	}

	return (
		<div>
			<label htmlFor={"source-" + index} className="form-label">
				Source {index + 1}
			</label>
			<input
				id={"source-" + index}
				name={"source-" + index}
				className="form-control"
				onChange={onChangeHandler}
			/>

			<label htmlFor={"href-" + index} className="form-label">
				Link {index + 1}
			</label>
			<input
				id={"href-" + index}
				name={"href-" + index}
				className="form-control"
				onChange={onChangeHandler}
			/>
		</div>
	);
}

export default LinkFields;
