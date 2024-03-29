import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import {useUserContext, useModalContext, useFetch} from '../../hooks';

import Song from "../../components/songs/Song.jsx";
import Modal from '../../components/layout/Modal.jsx';

function SinglePlaylist() {
	const [data, setData] = useState();
	const { id: playlistId } = useParams();
	const { user } = useUserContext();
	const { setModal } = useModalContext();

	const belongsToThisUser = data?.uploadedBy === user?.user_id;

	// get data from db
	useEffect(() => {
		async function getData() {
			try {
                const json = await useFetch(`/api/playlists/${playlistId}`, "GET");

				setData({ ...json });
			} catch (err) {
				setModal({
					active: "modal",
					msg: `${err.name}: ${err.message}`
				});

				console.log(err);
			}
		}

		getData();
	}, []);

	// listens for clicks on the delete button
	function deleteHandler(e) {
		const { target } = e;

		setModal({
			...modal,
			active: "conf-del-modal",
			msg: "Are you sure you want to delete this playlist? If you want it back, you'll have to completely remake it."
		});
	}

	async function deleteConfirmedHandler() {
		// make database call
		try {
            await useFetch(`/api/playlists/${playlistId}`, "DELETE", null, user.token);

			// swap modals
			setModal({
				...modal,
				active: "comp-del-modal",
				msg: "Your playlist was successfully deleted. Redirecting...",
                navTo: '/playlists'
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
		data && (
			<>
				<div className="page-title">
					<h2>{data.title}</h2>

					{belongsToThisUser && (
						<div>
							<Link
								role="button"
								to={`/edit-playlist/${data._id}`}
								className="rectangle-btn"
							>
								Edit
							</Link>

							<button
								type="button"
								className="rectangle-btn text-left"
                                onClick={deleteHandler}
							>
								Delete
							</button>
						</div>
					)}
				</div>

				<p class="mb-4">
					Assembled by:{" "}
					<Link
						to={`/users/${data.uploadedBy}`}
						className="font-semibold"
					>
						{data.uploaderUsername}
					</Link>
				</p>

				<div className="border-2 border-stone-300 pl-3 py-2.5">
					<ul className="list-spacing">
						{data.songs[0] ? data.songs.map((element) => (
							<Song key={element._id} song={element} />
						)) : <p>This playlist is empty.</p>}
					</ul>
				</div>

<Modal id="conf-del-modal">
    <button
        className="block font-semibold mt-0.5"
        onClick={deleteConfirmedHandler}
    >
        Yes, I want to delete it
    </button>
</Modal>

<Modal id="comp-del-modal" />
			</>
		)
	);
}

export default SinglePlaylist;
