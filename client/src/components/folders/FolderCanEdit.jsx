import { useDateTime } from '../../hooks';

import PlaylistSlim from "../playlists/PlaylistSlim";
import EditButton from "../generic/EditButton";
import DeleteButton from "../generic/DeleteButton";

import {toggleFolder} from '../../utils/toggleBoxUtils.js';

function FolderCanEdit({ folder }) {
	const { _id, name, playlists, isUnsorted, dateLastModified } = folder;

	return (
		<article className="border border-stone-300 mb-3">
			<div
				className="fl-title no-border"
				onClick={toggleFolder}
			>
				<h3>{name}</h3>

				<p className="arrow">▼</p>
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
