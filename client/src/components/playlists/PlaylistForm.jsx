import { useEffect } from "react";

import { useUserContext, useModalContext, useFetch } from "../../hooks";

import SongList from "../songs/SongList.jsx";

function PlaylistForm({ plData, formState, setFormState }) {
	const { modal, setModal } = useModalContext();
	const { user } = useUserContext();

	// if we got data from the parent component, update state
	useEffect(() => {
		if (plData) {
			setFormState({
				...formState,
				...plData
			});
		}
	}, [plData]);

	// make searches when the search bar contents update
	useEffect(() => {
		try {
			async function getSearchResults() {
				// create query param with the search value
				const query = `?title=${formState.search}`;
                const url = "/api/songs/search/title" + query;

                const json = await useFetch(url, "GET"); // no body or token

				setFormState({
					...formState,
					deselected: [...json]
				});
			}

			if (formState.search) {
				getSearchResults();
			}
		} catch (err) {
			// TODO: Better error handling
			setModal({
				...modal,
				active: "modal",
				msg: `Something went wrong with this search. ${err.name}: ${err.message}`
			});

			console.log(err);
		}
	}, [formState.search]);

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
		if (!formState.title) {
			setModal({
				...modal,
				active: "modal",
				msg: "Your playlist needs a title.",
				navTo: ""
			});

			return;
		}

		// create object to send to db
		// timestamps handled on backend
		const playlistObj = {
			title: formState.title,
			songs: formState.selected.map((el) => el._id)
		};

		// check - are we making an edit or a new playlist?
		const editingBoolean = window.location.pathname.includes("edit");

		try {
			if (editingBoolean) {
				const playlistId = window.location.pathname.split("/").pop();
                const url = "/api/playlists/" + playlistId;

                await useFetch(url, "PUT", playlistObj, user.token);
			} else {
                await useFetch("/api/playlists", "POST", playlistObj, user.token);
			}

            // no errors, moves forward

			setModal({
				...modal,
				active: "modal",
				msg: `Success! Your playlist has been ${
					editingBoolean ? "updated" : "created"
				}. Redirecting...`,
				navTo: "/playlists"
			});
		} catch (err) {
			setModal({
				...modal,
				active: "modal",
				msg: `${err.name}: ${err.message}`,
				navTo: ""
			});

			console.log(err);
		}
	}
	return (
		<form onSubmit={onSubmitHandler}>
			<div>
				<label htmlFor="title" className="form-label">
					Title{" "}
					<span className="required" title="Required">
						*
					</span>
				</label>
				<input
					id="title"
					name="title"
					className="form-control"
					value={formState.title}
					onChange={onChangeHandler}
				/>
			</div>

			<hr />

			<div>
				<label className="form-label">Songs</label>

				<p>Click and drag to sort and move songs in and out of your playlist.</p>

				<SongList id="selected" items={formState.selected} />

				<label htmlFor="search" className="block mb-0.5">
					Search:
				</label>
				<input
					id="search"
					name="search"
					className="form-control"
					autoComplete="off"
					value={formState.search}
					onChange={onChangeHandler}
				/>

				<SongList id="deselected" items={formState.deselected} />
			</div>

			<hr />

			<button type="submit" className="rectangle-btn">
				Submit
			</button>
		</form>
	);
}

export default PlaylistForm;
