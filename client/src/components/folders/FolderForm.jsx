import { useEffect } from "react";

import {useUserContext, useModalContext, useFetch} from '../../hooks';

import PlaylistList from "../playlists/PlaylistList.jsx";

function FolderForm({ flData, formState, setFormState }) {
	const { user } = useUserContext();
	const { modal, setModal } = useModalContext();

	// get data and set state
	useEffect(() => {
		async function getUnsortedPlaylists() {
			const { user_id } = user;

			try {
                const json = await useFetch(`/api/users/${user_id}/playlists/unsorted`, "GET");

				// include any data received from the parent component
				setFormState({
					...formState,
					...flData,
					deselected: [...json.playlists]
				});
			} catch (err) {
				setModal({
					...modal,
					active: "modal",
					msg: `${err.name}: ${err.message}`
				});

				console.log(err);
			}
		}

		getUnsortedPlaylists();
	}, [flData]);

	function onChangeHandler(event) {
		const { name, value } = event.target;

		setFormState({
			...formState,
			[name]: value
		});
	}

	async function onSubmitHandler(event) {
		event.preventDefault();

		// validate form state
		if (!formState.name) {
			setModal({
				...modal,
				active: "modal",
				msg: "Your folder needs a name.",
				navTo: ""
			});

			return;
		}

		// create object to send to db
		const folderObj = {
			name: formState.name,
			playlists: formState.selected.map((el) => el._id)
		};

		// check - are we making an edit or a new folder?
		const editingBoolean = window.location.pathname.includes("edit");

		let json = null;

		try {
			if (editingBoolean) {
				const folderId = window.location.pathname.split("/").pop();

                json = await useFetch(`/api/folders/${folderId}`, "PUT", folderObj, user.token);
			} else {

                json = await useFetch("/api/folders", "POST", folderObj, user.token);
			}

            // update this user's unsorted folder to contain any deselected playlists
            
            // get id of unsorted folder
            const {_id: unsortedFolderId} = await useFetch(`/api/users/${user.user_id}/playlists/unsorted`, "GET");
            const deselectedIds = {playlists: formState.deselected.map((el) => el._id)};

            // update it
            await useFetch(`/api/folders/${unsortedFolderId}`, "PUT", deselectedIds, user.token);

			setModal({
				...modal,
				active: "modal",
				msg: `Success! Your folder has been ${editingBoolean ? "updated" : "created"}. Redirecting...`,
				navTo: "/folders"
			});
		} catch (err) {
			setModal({
				...modal,
				active: "modal",
				msg: `${err.name}: ${err.message}`
			});

			console.log(err);
		}
	}

	return (
		<form id="pl-form" onSubmit={onSubmitHandler}>
			<div>
				<label htmlFor="name" className="form-label">
					Name{" "}
					<span className="required" title="Required">
						*
					</span>
				</label>
				<input id="name" name="name" className="form-control" value={formState.name} onChange={onChangeHandler} />
			</div>

			<hr />

			<div>
				<label className="form-label">Playlists</label>

				<p>Click and drag to sort playlists, and move them in and out of this folder.</p>

				<PlaylistList id="selected" items={formState.selected} />

				<hr />

				<PlaylistList id="deselected" items={formState.deselected} />
			</div>

			<hr />

			<button type="submit" className="rectangle-btn">
				Submit
			</button>
		</form>
	);
}

export default FolderForm;
