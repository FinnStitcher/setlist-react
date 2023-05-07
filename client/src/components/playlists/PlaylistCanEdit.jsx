import { Link } from "react-router-dom";

import { useDateTime } from "../../hooks";
import { togglePlaylist } from "../../utils/toggleBoxUtils.js";

import Song from "../songs/Song.jsx";
import EditButton from "../generic/EditButton";
import DeleteButton from "../generic/DeleteButton";

function PlaylistCanEdit({ playlist }) {
	const { _id, title, songs, dateCreated, dateLastModified } = playlist;

	return (
		<article className="border-2 border-stone-300 mb-3">
			<div className="pl-title" onClick={togglePlaylist}>
				<h3>{title}</h3>
				<p className="arrow">▼</p>
			</div>

			<div className="hidden">
				<div className="border-t-2 border-stone-400">
					<EditButton url={`/edit-playlist/${_id}`} />

					<DeleteButton id={_id} />
				</div>

				<div className="pl-3 py-2.5">
					<ul className="divide-y space-y-1.5">
						{songs[0] ? (
							songs.map((element) => <Song key={element._id} song={element} />)
						) : (
							<p>This playlist is empty.</p>
						)}
					</ul>

					<hr />

					<p className="-mt-1.5 mb-1.5">
						Created {useDateTime(dateCreated)}. Last modified{" "}
						{useDateTime(dateLastModified)}.
					</p>

					<p className="">
						<Link to={`/playlists/${_id}`}>Link to this playlist.</Link>
					</p>
				</div>
			</div>
		</article>
	);
}

export default PlaylistCanEdit;
