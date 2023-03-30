import { useState, useEffect, useContext } from "react";
import UserContext from "../../UserContext";
import ModalContext from "../../ModalContext";

import Song from "../../components/songs/Song";
import AuthFailed from "../error_pages/AuthFailed";

function NewSong() {
	const [formState, setFormState] = useState({
		title: "",
		artist: "",
		album: "",
		year: ""
	});
    const [suggestions, setSuggestions] = useState([]);
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

					throw new Error(message);
				}

                setSuggestions([...json]);

				// setFormState({
                //     ...formState,
				// 	suggestions: [...json]
				// });
			}

			if (formState.title) {
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

		const { title, artist, album, year } = formState;
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
            const songObj = {
                title: title,
                artist: artist,
                album: album,
                year: parseInt(year)
            };

			// make database call
			const response = await fetch("/api/songs", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json"
				},
				body: JSON.stringify(songObj)
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

            setFormState({
                title: "",
                artist: "",
                album: "",
                year: "",
                //suggestions: []
            });

            setSuggestions([]);
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
			<div className="page-title">
				<h2>Submit a Song</h2>
			</div>

			<form onSubmit={onSubmitHandler}>
				<label htmlFor="title" className="block text-lg mb-0.5">
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

				<label htmlFor="artist" className="block text-lg mb-0.5">
					Artist{" "}
					<span className="required" title="Required">
						*
					</span>
				</label>
				<input
					id="artist"
					name="artist"
					className="form-control"
					value={formState.artist}
					onChange={onChangeHandler}
				/>

				<label htmlFor="album" className="block text-lg mb-0.5">
					Album
				</label>
				<input
					id="album"
					name="album"
					className="form-control"
					value={formState.album}
					onChange={onChangeHandler}
				/>

				<label htmlFor="year" className="block text-lg mb-0.5">
					Year
				</label>
				<input
					id="year"
					name="year"
					type="number"
					className="form-control"
					value={formState.year}
					onChange={onChangeHandler}
				/>

				<hr className="border-stone-400/50" />

				<button type="submit" className="rectangle-btn">
					Submit
				</button>
			</form>

			<hr />

			<div>
				<h3 className="text-lg">Are you thinking of...?</h3>

				<ul className="form-song-list">
					{suggestions[0] &&
						suggestions.map((element) => (
							<Song key={element._id} song={element} />
						))}
				</ul>
			</div>
		</>
	);
}

export default NewSong;
