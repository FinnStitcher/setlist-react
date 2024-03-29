import { useUserContext, useModalContext, useFetch } from "../../hooks";

import LinkFields from "./LinkFields.jsx";

function SongForm({ isEditing, formRef, clickedSongRef, formState, setFormState }) {
	const { user } = useUserContext();
	const { modal, setModal } = useModalContext();

	function addLinkHandler() {
		// check that number of links is within allowed limits
		if (formState.links.length >= 4) {
			// TODO: Modal
			console.log("cant add more");
			return;
		}

		// add a link object to the form state
		setFormState({
			...formState,
			links: [
				...formState.links,
				{
					source: "",
					href: "",
					tempId: Math.ceil(Math.random() * 1000)
				}
			]
		});
	}

	function onChangeHandler(event) {
		const { name, value } = event.target;

		setFormState({
			...formState,
			[name]: value
		});
	}

	async function onSubmitHandler(event) {
		event.preventDefault();

		const { title, artist, album, year, links } = formState;
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

		// make sure all links have both requisite values
		links.forEach((element) => {
			if (!element.source || !element.href) {
				setModal({
					...modal,
					active: "modal",
					msg: "Every link needs both fields filled out."
				});

				return;
			}
		});

		const songObj = {
			title: title,
			artist: artist,
			album: album,
			year: parseInt(year),
			// clean up link objects; not sending the temp ids
			links: links.map((element) => {
				return {
					source: element.source,
					href: element.href
				};
			})
		};

		const isEditing = window.location.pathname.includes("edit");

		let json = null;

		try {
			if (isEditing) {
				const songId = clickedSongRef.current.id;
				const url = "/api/songs/" + songId;

				json = await useFetch(url, "PUT", songObj, user.token);
			} else {
				json = await useFetch("/api/songs", "POST", songObj, user.token);
			}

			// no error, moves forward

			setModal({
				...modal,
				active: "modal",
				msg: `Your ${isEditing ? "update" : "submission"} was a success!`
			});

			setFormState({
				title: "",
				artist: "",
				album: "",
				year: "",
				links: []
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
		<form
			className={isEditing ? "hidden" : null}
			ref={isEditing ? formRef : null}
			onSubmit={onSubmitHandler}
		>
			<label htmlFor="title" className="form-label">
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

			<label htmlFor="artist" className="form-label">
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

			<label htmlFor="album" className="form-label">
				Album
			</label>
			<input
				id="album"
				name="album"
				className="form-control"
				value={formState.album}
				onChange={onChangeHandler}
			/>

			<label htmlFor="year" className="form-label">
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

			<div>
				<h3 className="text-xl">
					Links{" "}
					<button type="button" className="btn-small" onClick={addLinkHandler}>
						<span>+</span>
					</button>
				</h3>

				{formState.links.length > 0 &&
					formState.links.map((element, index) => (
						<LinkFields
							key={element.tempId}
							index={index}
							formState={formState}
							setFormState={setFormState}
						/>
					))}
			</div>

			<hr className="border-stone-400/50" />

			<button type="submit" className="rectangle-btn">
				Submit
			</button>
		</form>
	);
}

export default SongForm;
