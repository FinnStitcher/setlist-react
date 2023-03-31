import { useContext } from "react";
import ModalContext from "../../ModalContext";

function SongForm({ isEditing, formRef, clickedSongRef, formState, setFormState }) {
	const { modal, setModal } = useContext(ModalContext);

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

		const songObj = {
			title: title,
			artist: artist,
			album: album,
			year: parseInt(year)
		};

		let response = null;

		try {
			if (isEditing) {
                const songId = clickedSongRef.current.id;

				// make database call
				response = await fetch("/api/songs/" + songId, {
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
					year: ""
				});
			} else {
				// make database call
				response = await fetch("/api/songs", {
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
					year: ""
				});
			}
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

	return (
		<form
			className={isEditing ? "hidden" : null}
			ref={isEditing ? formRef : null}
			onSubmit={onSubmitHandler}
		>
			<label htmlFor="title" className="block text-lg mb-0.5">
				Title
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
	);
}

export default SongForm;
