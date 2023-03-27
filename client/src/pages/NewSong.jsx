import { useState, useEffect, useContext } from "react";
import UserContext from "../UserContext";
import ModalContext from "../ModalContext";

import Song from "../components/Song";
import AuthFailed from "./AuthFailed";

function NewSong() {
	const [formState, setFormState] = useState({
		title: "",
		artist: "",
		album: "",
		year: "",
		suggestions: []
	});
	const { user } = useContext(UserContext);
	const { modal, setModal } = useContext(ModalContext);

	// make searches as the user interacts with the form
	useEffect(() => {
		try {
			async function getSearchResults() {
				// create query string
				const query = `?title=${formState.title}&artist=${formState.artist}`;

				const response = await fetch(
					"/api/songs/search/title/artist" + query
				);
				const json = await response.json();

				if (!response.ok) {
					const { message } = json;

					throw Error(message);
				}

				setFormState({
                    ...formState,
					suggestions: [...json]
				});
			}

			if (formState.title) {
				getSearchResults();
			}
		} catch (err) {
			setModal({
				...modal,
				active: "modal",
				msg: `${err.name}: ${err.message}`
			});

			console.log(err);
		}
	}, [formState.title, formState.artist]);

	function onChangeHandler(event) {
		const { name, value } = event.target;

		setFormState({
			...formState,
			[name]: value
		});
	}

	async function onSubmitHandler(event) {
		event.preventDefault();

		const { title, artist, year } = formState;
		const today = new Date();

		// validate
		if (!title || !artist) {
			setModal({
				...modal,
				active: "modal",
				msg: "You need to include a title and artist, at minimum."
			});

			return;
		}

		if (year > today.getFullYear() || year < 0) {
			setModal({
				...modal,
				active: "modal",
				msg: "The year you input is invalid. Make sure it's not negative or in the future."
			});

			return;
		}

		try {
			// make database call
			const response = await fetch("/api/songs", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json"
				},
				body: JSON.stringify(formState)
			});
			const json = await response.json();

			if (!response.ok) {
				const { message } = json;

				throw Error(message);
			}

			setModal({
				...modal,
				active: "modal",
				msg: "Your submission was a success!"
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

	if (!user) {
		return <AuthFailed />;
	}

	return (
		<>
			<div class="mb-4">
				<h2 class="page-title">Submit a Song</h2>
			</div>

			<form onSubmit={onSubmitHandler}>
				<label for="title" class="block text-lg mb-0.5">
					Title{" "}
					<span class="required" title="Required">
						*
					</span>
				</label>
				<input
					id="title"
					name="title"
					class="form-control"
					value={formState.title}
					onChange={onChangeHandler}
				/>

				<label for="artist" class="block text-lg mb-0.5">
					Artist{" "}
					<span class="required" title="Required">
						*
					</span>
				</label>
				<input
					id="artist"
					name="artist"
					class="form-control"
					value={formState.artist}
					onChange={onChangeHandler}
				/>

				<label for="album" class="block text-lg mb-0.5">
					Album
				</label>
				<input
					id="album"
					name="album"
					class="form-control"
					value={formState.album}
					onChange={onChangeHandler}
				/>

				<label for="year" class="block text-lg mb-0.5">
					Year
				</label>
				<input
					id="year"
					name="year"
					type="number"
					class="form-control"
					value={formState.year}
					onChange={onChangeHandler}
				/>

				<hr class="border-stone-400/50" />

				<button type="submit" class="rectangle-btn">
					Submit
				</button>
			</form>

			<hr />

			<div>
				<h3 class="text-lg">Are you thinking of...?</h3>

				<ul class="form-song-list">
					{formState.suggestions[0] &&
						formState.suggestions.map((element) => (
							<Song key={element._id} song={element} />
						))}
				</ul>
			</div>
		</>
	);
}

export default NewSong;
