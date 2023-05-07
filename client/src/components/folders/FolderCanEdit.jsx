import { useDateTime } from '../../hooks';

import PlaylistSlim from "../playlists/PlaylistSlim";
import EditButton from "../generic/EditButton";
import DeleteButton from "../generic/DeleteButton";

function FolderCanEdit({ folder }) {
	const { _id, name, playlists, isUnsorted, dateLastModified } = folder;

	function toggleFolder(e) {
		const { target } = e;

		// get the ul associated with this title div
		const folderBody = target.closest(".fl-title").nextElementSibling;
		// get the arrow
		const arrow = target.closest(".fl-title").querySelector(".fl-arrow");

		if (folderBody.matches(".hidden")) {
			folderBody.className = "block";
            arrow.style.transform = "rotate(0deg) translateY(0px)";
		} else if (folderBody.matches(".block")) {
			folderBody.className = "hidden";
            arrow.style.transform = "rotate(180deg) translateY(-3px)";
		}
	}

	return (
		<article className="border border-stone-300 mb-3">
			<div
				className="border-b border-stone-300 px-2 py-2 flex justify-between sm:justify-start fl-title"
				onClick={toggleFolder}
			>
				<h3>{name}</h3>

				<p className="ml-2 md:ml-4 fl-arrow">▼</p>
			</div>

			<div className="hidden">
				{isUnsorted ? null : (
					<div className="border-t-2 border-stone-300">
						<EditButton url={`/edit-folder/${_id}`} />

						<DeleteButton id={_id} />
					</div>
				)}

				<div className="pl-3 py-2.5">
					<ul className="divide-y space-y-1.5" id={isUnsorted ? "unsorted" : null}>
						{playlists[0] ? (
							playlists.map((element) => (
								<PlaylistSlim
									key={element._id}
									playlist={element}
								/>
							))
						) : (
							<p>This folder is empty.</p>
						)}
					</ul>

					<hr />

                    <p className="-mt-1.5 mb-1.5">Last modified {useDateTime(dateLastModified)}.</p>
				</div>
			</div>
		</article>
	);
}

export default FolderCanEdit;
