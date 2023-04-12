import { useState, useEffect, useRef } from "react";

import { useUserContext, useModalContext } from "../../hooks";

import Song from "../../components/songs/Song";
import SongForm from "../../components/songs/SongForm";
import AuthFailed from "../error_pages/AuthFailed";

function EditSong() {
	const [formState, setFormState] = useState({
		title: "",
		artist: "",
		album: "",
		year: "",
		links: []
	});
	const [search, setSearch] = useState("");
	const [suggestions, setSuggestions] = useState([]);

	const { user } = useUserContext();
	const { modal, setModal } = useModalContext();

	const formRef = useRef();
	const clickedSongRef = useRef();

	// make searches as the user interacts with the form
	useEffect(() => {
		try {
			async function getSearchResults() {
				// create query param with the search value
				const query = `?title=${search}`;

				const response = await fetch("/api/songs/search/user/title" + query, {
					headers: {
						"Authorization": "Bearer " + user.token
					}
				});
				const json = await response.json();

				if (!response.ok) {
					const { message } = json;

					throw new Error(message);
				}

				setSuggestions([...json]);
			}

			if (search) {
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
	}, [search]);

	// double-clicking a song makes its data appear in the form
	async function onClickHandler(event) {
		const { detail, target } = event;

		// only accept double clicks
		if (detail < 2) {
			return;
		}

		clickedSongRef.current = target.closest("li");
		const { id } = clickedSongRef.current;

		// find this song in the db
		const response = await fetch("/api/songs/" + id);
		const json = await response.json();

		const { title, artist, album, year, links } = json;

		// update form state
		setFormState({
			title: title,
			artist: artist,
			album: album ? album.replace("<i>", "").replace("</i>", "") : "",
			year: year ? year : "",
			links: [...links]
		});

		setSuggestions([]);

		// make form visible
		formRef.current.className = "block";
	}

	function onChangeHandler(event) {
		const { value } = event.target;

		setSearch(value);
	}

	if (!user) {
		return <AuthFailed />;
	}

	return (
		<>
			<div className="page-title">
				<h2>Edit a Song</h2>
				<p>Note that you can only edit songs you yourself submitted.</p>
			</div>

			<div>
				<h3 className="text-lg">
					<label htmlFor="search-input">Search for a song to edit...</label>
				</h3>

				<input
					type="search"
					id="search"
					name="search"
					className="form-control"
					value={search}
					onChange={onChangeHandler}
				/>

				<ul className="form-song-list" onClick={onClickHandler}>
					{suggestions[0] &&
						suggestions.map((element) => <Song key={element._id} song={element} />)}
				</ul>

				<p>Double-click a song to copy its information into the form below.</p>
			</div>

			<hr />

			<SongForm
				formRef={formRef}
				clickedSongRef={clickedSongRef}
				formState={formState}
				setFormState={setFormState}
			/>
		</>
	);
}

export default EditSong;
