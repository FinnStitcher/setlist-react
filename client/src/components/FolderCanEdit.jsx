import {Link} from 'react-router-dom';

import PlaylistSlim from './PlaylistSlim.jsx';

function FolderCanEdit({ folder }) {
	const { _id, name, playlists, isUnsorted } = folder;

	function toggleFolder(e) {
		const { target } = e;

		// get the ul associated with this title div
		const folderBody = target.closest('.fl-title').nextElementSibling;
		// get the arrow
		const arrow = target.closest('.fl-title').querySelector('.fl-arrow');

		if (folderBody.matches('.hidden')) {
			folderBody.className = 'block';

			arrow.textContent = '▲';
		} else if (folderBody.matches('.block')) {
			folderBody.className = 'hidden';

			arrow.textContent = '▼';
		}

		// TODO: animate it to rotate rather than just swapping
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
                {isUnsorted ? null : (<div className="border-t-2 border-stone-300">
					<Link
						role="button"
						to={`/edit-folder/${_id}`}
						className="rectangle-btn mr-1 w-36"
					>
						Edit
					</Link>

					<button
						type="button"
						data-id={_id}
						data-modal-btn="open-modal"
						data-btn-type="del-btn"
						className="rectangle-btn w-36 text-left"
					>
						Delete
					</button>
				</div>)}

				<div className="pl-3 py-2.5">
					<ul className="divide-y space-y-1.5">
						{playlists &&
							playlists.map(element => (
								<PlaylistSlim
									key={element._id}
									playlist={element}
								/>
							))}
					</ul>
				</div>
			</div>
		</article>
	);
}

export default FolderCanEdit;
