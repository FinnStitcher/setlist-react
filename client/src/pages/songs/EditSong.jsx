import { useState, useEffect, useRef, useContext } from "react";
import UserContext from "../../UserContext";
import ModalContext from "../../ModalContext";

import Song from "../../components/songs/Song";
import AuthFailed from "../error_pages/AuthFailed";

function EditSong() {
	const [formState, setFormState] = useState({
		title: "",
		artist: "",
		album: "",
		year: "",
		search: "",
        suggestions: []
	});
    
	const { user } = useContext(UserContext);
	const { modal, setModal } = useContext(ModalContext);

    const formRef = useRef();
    const clickedSongRef = useRef();

	// make searches as the user interacts with the form
	useEffect(() => {
		try {
			async function getSearchResults() {
                // create query param with the search value
                const query = `?title=${formState.search}`;

				const response = await fetch(
					'/api/songs/search/user/title' + query
				);
				const json = await response.json();

				if (!response.ok) {
					const { message } = json;

					throw new Error(message);
				}

				setFormState({
					...formState,
					suggestions: [...json]
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

	// double-clicking a song makes its data appear in the form
    function onClickHandler(event) {
        const {detail, target} = event;

        // only accept double clicks
        if (detail < 2) {
            return;
        }

        clickedSongRef.current = target.closest('li');
        const {current} = clickedSongRef;

        // extract data
        const title = current.children[0].textContent;

        // innerHTML instead of textContent so we can tell if there's an album or not
        const extraInfoArr = current.children[1].innerHTML.split(', ');

        // artist is required, so extraInfoArr[0] will always be the artist name
        const artist = extraInfoArr[0];

        let year = null;
        let album = null;

        if (extraInfoArr.length === 3) {
            year = extraInfoArr[1];
            album = extraInfoArr[2];
        } else if (extraInfoArr.length === 2) {
            // check if the other piece of data in the array is the album (in italics) or the year
            const secondItem = extraInfoArr[1];

            if (secondItem.includes('<i>')) {
                album = secondItem;
            } else {
                year = secondItem;
            }
        }
        // if length === 1, there was only one item in the array, the artist, which has already been saved to a variable
        
        // update form state
        setFormState({
            ...formState,
            title: title,
            artist: artist,
            album: album ? album.replace('<i>', '').replace('</i>', '') : '',
            year: year ? year : ''
        });

        // make form visible
        formRef.current.className = "block";
    }

	function onChangeHandler(event) {
        const {name, value} = event.target;

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
            const songId = clickedSongRef.current.id;

			// make database call
			const response = await fetch("/api/songs/" + songId, {
				method: "PUT",
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
                search: "",
                suggestions: []
            })
		} catch (err) {
            // TODO: Better error handling
			setModal({
				...modal,
				active: "modal",
				msg: `${err.name}: ${err.message}`
			});

			console.log(err);
		}
	}

    if (!user) {
        return <AuthFailed />
    }

	return (
		<>
			<div className="mb-4">
				<h2 className="page-title">Edit a Song</h2>
				<p>Note that you can only edit songs you yourself submitted.</p>
			</div>

			<div>
				<h3 className="text-lg">
					<label htmlFor="search-input">
						Search for a song to edit...
					</label>
				</h3>

				<input
					type="search"
					id="search"
					name="search"
					className="form-control"
                    value={formState.search}
                    onChange={onChangeHandler}
				/>

				<ul className="form-song-list" onClick={onClickHandler}>
                    {formState.suggestions[0] && formState.suggestions.map(element => <Song key={element._id} song={element} />)}
                </ul>

				<p>
					Double-click a song to copy its information into the form
					below.
				</p>
			</div>

			<hr />

			<form className="hidden" ref={formRef} onSubmit={onSubmitHandler}>
				<label htmlFor="title" className="block text-lg mb-0.5">
					Title
					<span className="required" title="Required">
						*
					</span>
				</label>
				<input id="title" name="title" className="form-control"
                    value={formState.title}
                    onChange={onChangeHandler} />

				<label htmlFor="artist" className="block text-lg mb-0.5">
					Artist
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
				<input id="album" name="album" className="form-control"
                    value={formState.album}
                    onChange={onChangeHandler} />

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
		</>
	);
}

export default EditSong;
