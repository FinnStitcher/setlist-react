import { useState, useEffect, useContext } from "react";
import UserContext from "../../UserContext";
import ModalContext from "../../ModalContext";

import Song from "../../components/songs/Song";
import SongForm from '../../components/songs/SongForm';
import AuthFailed from "../error_pages/AuthFailed";

function NewSong() {
	const [formState, setFormState] = useState({
		title: "",
		artist: "",
		album: "",
		year: "",
        links: []
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

	if (!user) {
		return <AuthFailed />;
	}

	return (
		<>
			<div className="page-title">
				<h2>Submit a Song</h2>
			</div>
            
            <SongForm isEditing={false} formState={formState} setFormState={setFormState} />

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
